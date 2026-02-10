package src/components/NoteList.jsx
import React from 'react';
import { useNotes } from '../hooks/useNotes';
import DatabaseHelper from '../services/DatabaseHelper';

const NoteList = () => {
  const { notes, loading, error } = useNotes();

  const handleDelete = async (id) => {
    try {
      await DatabaseHelper.delete(id);
      console.log('Deleted note', id);
    } catch (e) {
      console.error('Delete failed', e);
    }
  };

  const handleEdit = async (id, currentTitle) => {
    const newTitle = window.prompt('Edit note title:', currentTitle);
    if (newTitle !== null && newTitle !== currentTitle) {
      try {
        await DatabaseHelper.update(id, { title: newTitle });
        console.log('Updated note', id, newTitle);
      } catch (e) {
        console.error('Update failed', e);
      }
    }
  };

  if (loading) return <div>Loading notes...</div>;
  if (error) return <div>Error loading notes: {error.message}</div>;

  return (
    <ul>
      {notes.map((note) => (
        <li key={note.id}>
          {note.title}
          <button onClick={() => handleEdit(note.id, note.title)}>Edit</button>
          <button onClick={() => handleDelete(note.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
};

export default NoteList;