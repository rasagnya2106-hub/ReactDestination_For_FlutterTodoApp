package src/components/NoteAdder.jsx
import React, { useState, useEffect } from 'react';
import Note from '../models/Note';
import DatabaseService from '../services/DatabaseService';

const NoteAdder = () => {
  const [title, setTitle] = useState('');
  const [toast, setToast] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const note = new Note({ title });
    try {
      await DatabaseService.addNote(note);
      setToast('Note Added');
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Note Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <button type="submit">Add Note</button>
      </form>
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#323232',
          color: '#fff',
          padding: '12px 24px',
          borderRadius: '4px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
        }}>
          {toast}
        </div>
      )}
    </div>
  );
};

export default NoteAdder;