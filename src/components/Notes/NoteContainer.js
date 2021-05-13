import React from 'react';

const NoteContainer = (props) => {
    return (
        <div className="notes-section">
            {props.children}
        </div>
    );
}

export default NoteContainer;