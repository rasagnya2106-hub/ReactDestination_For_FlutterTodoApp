import React from 'react';
import useNotes from '../hooks/useNotes';
import DatabaseService from '../services/DatabaseService';

const NotesList = () => {
  const notes = useNotes();

  const handleDelete = (id) => {
    DatabaseService.deleteNoteById(id);
  };

  const handleEdit = (id, currentTitle) => {
    const newTitle = window.prompt('Edit title', currentTitle);
    if (newTitle && newTitle !== currentTitle) {
      DatabaseService.updateNoteById(id, { title: newTitle });
    }
  };

  return (
    <ul>
      {notes.map((note) => (
        <li key={note.id}>
          {note.title}{' '}
          <button onClick={() => handleDelete(note.id)}>Delete</button>{' '}
          <button onClick={() => handleEdit(note.id, note.title)}>Edit</button>
        </li>
      ))}
    </ul>
  );
};

export default NotesList;