package src/components/NotesPage.jsx
import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { deleteNote } from '../services/notesService';

const sortOptions = [
  { label: 'Date Created', value: 'dateCreated' },
  { label: 'Date Modified', value: 'dateModified' },
  { label: 'Title', value: 'title' },
  { label: 'Priority', value: 'priority' },
];

const NotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [sort, setSort] = useState(sortOptions[0].value);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setLoading(false);
      setError('User not authenticated');
      return;
    }

    const notesRef = collection(db, 'users', user.uid, 'notes');
    const q = query(notesRef, orderBy(sort, 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetched = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNotes(fetched);
        setLoading(false);
        setError(null);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [auth, sort]);

  const handleDelete = async (id) => {
    try {
      await deleteNote(id);
      alert('Note deleted');
    } catch (e) {
      alert('Failed to delete note');
    }
  };

  const handleNoteClick = async (id) => {
    const user = auth.currentUser;
    if (!user) return;
    const noteDoc = doc(db, 'users', user.uid, 'notes', id);
    const snap = await getDoc(noteDoc);
    if (snap.exists()) {
      navigate(`/create-note?id=${id}`);
    }
  };

  const handleAddNote = () => {
    navigate('/create-note');
  };

  return (
    <div style={{ padding: '16px', position: 'relative' }}>
      <header style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
        <h2>My Notes</h2>
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </header>

      {error && (
        <div style={{ textAlign: 'center', color: 'red' }}>
          <span role="img" aria-label="error">
            ❌
          </span>{' '}
          {error}
        </div>
      )}

      {loading && (
        <div style={{ textAlign: 'center' }}>
          <span role="img" aria-label="loading">
            ⏳
          </span>{' '}
          Loading...
        </div>
      )}

      {!loading && !error && (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {notes.map((note) => (
            <li
              key={note.id}
              style={{
                marginBottom: '12px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                overflow: 'hidden',
                position: 'relative',
                backgroundColor: '#fff',
              }}
            >
              <div
                onClick={() => handleNoteClick(note.id)}
                style={{ padding: '12px', cursor: 'pointer' }}
              >
                <h4 style={{ margin: '0 0 4px' }}>{note.title || 'Untitled'}</h4>
                <p style={{ margin: 0, color: '#555' }}>{note.content?.slice(0, 100)}</p>
              </div>
              <button
                onClick={() => handleDelete(note.id)}
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  bottom: 0,
                  width: '60px',
                  backgroundColor: '#ff5252',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                }}
                title="Delete"
              >
                🗑
              </button>
            </li>
          ))}
        </ul>
      )}

      <button
        onClick={handleAddNote}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: '#ff9800',
          color: '#fff',
          border: 'none',
          fontSize: '24px',
          cursor: 'pointer',
          boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
        }}
        title="Add Note"
      >
        +
      </button>
    </div>
  );
};

export default NotesPage;