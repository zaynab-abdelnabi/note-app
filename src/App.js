import React, { useState, useEffect } from 'react';
import './App.css';
import NoteContainer from './components/Notes/NoteContainer';
import NoteList from './components/Notes/NoteList';
import Note from './components/Notes/Note';
import NoteForm from './components/Notes/NoteForm';
import Preview from './components/Preview';
import Message from './components/Message';
import Alert from './components/Alert';

function App() {
    const [notes, setNotes] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [selectedNote, setSelectedNote] = useState(null);
    const [creating, setCreating] = useState(false);
    const [editing, setEditing] = useState(false);
    const [validationErrors, setValidationErrors] = useState([]);


    // to check is the notes are in local storage
    useEffect(() => {
        if (localStorage.getItem('notes')) {
            setNotes(JSON.parse(localStorage.getItem('notes')));
        } else {
            localStorage.setItem('notes', JSON.stringify([]));
            setNotes([]);
        }
    }, []);


    useEffect(() => {
        if (validationErrors.length !== 0) {
            setTimeout(() => {
                setValidationErrors([]);
            }, 3000);
        }
    }, [validationErrors]);

    // save notes in local storage(new, edited, after delete)
    const saveToLocalStorage = (name, item) => {
        localStorage.setItem(name, JSON.stringify(item));
    };

    //check inputs (message for empty title) (message for empty content)
    const validate = () => {
        const validationErrors = [];
        let passed = true;
        if (!title) {
            validationErrors.push('الرجاء إدخال عنوان الملاحظة');
            passed = false;
        }
        if (!content) {
            validationErrors.push('الرجاء إدخال محتوى الملاحظة');
            passed = false;
        }
        setValidationErrors(validationErrors);
        return passed;
    };

    //on change title value
    const changeTitleHandler = (event) => {
        setTitle(event.target.value);
    };

    //on change textarea value
    const changeContentHandler = (event) => {
        setContent(event.target.value);
    };

    //changing to add note creating mood
    const addNoteHandler = () => {
        setCreating(true);
        setTitle('');
        setContent('');
        setEditing(false);
    };

    //on click to selected note
    const selectNoteHandler = (noteId) => {
        setSelectedNote(noteId);
        setCreating(false);
        setEditing(false);
    };

    //save new note when click on save button
    const saveNoteHandler = () => {
        if (!validate()) return;

        const note = {
            id: new Date(),
            title: title,
            content: content,
        };
        
        const updatedNotes = [...notes, note];
        
        saveToLocalStorage('notes', updatedNotes);
        setNotes(updatedNotes);
        setTitle('');
        setContent('');
        setCreating(false);
        setSelectedNote(note.id);
    };

    //delete note when click on trash icon
    const deleteNoteHandler = (noteId) => {
        
        const updatedNotes = [...notes];
        const noteIndex = updatedNotes.findIndex((note) => note.id === noteId);
        
        updatedNotes.splice(noteIndex, 1);
        
        saveToLocalStorage('notes', updatedNotes);
        setNotes(updatedNotes);
        setSelectedNote(null);
    };

    //edit note when click on pen icon
    const editNoteHandler = (noteId) => {
        
        const note = notes.find((note) => note.id === noteId);

        setEditing(true);
        setTitle(note.title);
        setContent(note.content);
    };

    // save note after editing
    const updateNoteHandler = () => {
        
        if (!validate()) return;
        
        const updatedNotes = [...notes];
        const noteIndex = notes.findIndex((note) => note.id === selectedNote);
        
        updatedNotes[noteIndex] = {
            id: selectedNote,
            title: title,
            content: content,
        };

        saveToLocalStorage('notes', updatedNotes);
        setNotes(updatedNotes);
        setEditing(false);
        setTitle('');
        setContent('');
    };

    //add note form
    const getAddNote = () => {
        return (
            <NoteForm
                formTitle='ملاحظة جديدة'
                title={title}
                titleChanged={changeTitleHandler}
                content={content}
                contentChanged={changeContentHandler}
                submitClicked={saveNoteHandler}
                submitText='حفظ'
            />
        );
    };

    //changing in the view section
    const getPreview = () => {
        if (notes.length === 0) {
            return <Message title="لا يوجد ملاحظات" />;
        }

        if (!selectedNote) {
            return <Message title="الرجاء اختيار ملاحظة" />;
        }

        const note = notes.find((note) => {
            return note.id === selectedNote;
        });

        let noteDisplay = (
            <div>
                <h2>{note.title}</h2>
                <p>{note.content}</p>
            </div>
        );

        if (editing) {
            noteDisplay = (
                <NoteForm
                    formTitle='تعديل ملاحظة'
                    title={title}
                    titleChanged={changeTitleHandler}
                    content={content}
                    contentChanged={changeContentHandler}
                    submitClicked={updateNoteHandler}
                    submitText='تعديل'
                />
            );
        }

        return (
            <div>
                {!editing && (
                    <div className="note-operations">
                        <a href="#" onClick={() => editNoteHandler(note.id)}>
                            <i className="fa fa-pencil-alt" />
                        </a>
                        <a href="#" onClick={() => deleteNoteHandler(note.id)}>
                            <i className="fa fa-trash" />
                        </a>
                    </div>
                )}

                {noteDisplay}

            </div>
        );
    };

    return (
        <div className="App">
            <NoteContainer>
                <NoteList>
                    {notes.map((note) => (
                        <Note
                            key={note.id}
                            title={note.title}
                            noteClicked={() => selectNoteHandler(note.id)}
                            active={selectedNote === note.id}
                        />
                    ))}
                </NoteList>
                <button className="add-btn" onClick={addNoteHandler}>
                    +
        </button>
            </NoteContainer>
            <Preview>{creating ? getAddNote() : getPreview()}</Preview>

            {validationErrors.length !== 0 && (<Alert validationMessages={validationErrors} />)}
        </div>
    );
}

export default App;

