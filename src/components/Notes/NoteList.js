import React from 'react';

const NoteList = (props) => {
    return (
        <ul className="notes-list">
            {props.children}
        </ul>
    );
}

export default NoteList;