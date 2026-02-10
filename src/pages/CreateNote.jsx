package src/pages/CreateNote.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  addDoc,
  collection,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const CreateNote = () => {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getFirestore();
  const storage = getStorage();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNote = async () => {
      if (!noteId) return;
      const uid = auth.currentUser?.uid;
      if (!uid) return;
      const noteRef = doc(db, 'users', uid, 'notes', noteId);
      const snap = await getDoc(noteRef);
      if (snap.exists()) {
        const data = snap.data();
        setTitle(data.title || '');
        setContent(data.content || '');
        if (data.dateTime && data.dateTime.toDate) {
          setDate(data.dateTime.toDate().toISOString().slice(0, 10));
        }
      }
    };
    fetchNote();
  }, [noteId, auth, db]);

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFile(e.target.files[0]);
    } else {
      setFile(null);
    }
  };

  const uploadFile = async (fileObj) => {
    const uid = auth.currentUser?.uid;
    const storageRef = ref(storage, `users/${uid}/notes/${Date.now()}_${fileObj.name}`);
    await uploadBytes(storageRef, fileObj);
    const url = await getDownloadURL(storageRef);
    return url;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    const uid = auth.currentUser?.uid;
    if (!uid) {
      setLoading(false);
      return;
    }
    const noteData = {
      title,
      content,
      dateTime: Timestamp.fromDate(new Date(date)),
      updatedAt: serverTimestamp(),
    };
    if (file) {
      try {
        const fileUrl = await uploadFile(file);
        noteData.fileUrl = fileUrl;
        noteData.fileName = file.name;
      } catch {}
    }
    try {
      if (noteId) {
        const noteRef = doc(db, 'users', uid, 'notes', noteId);
        await setDoc(noteRef, noteData, { merge: true });
      } else {
        const notesCol = collection(db, 'users', uid, 'notes');
        await addDoc(notesCol, { ...noteData, createdAt: serverTimestamp() });
      }
      navigate('/notes');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-note-page">
      <h2>{noteId ? 'Edit Note' : 'Create Note'}</h2>
      <form onSubmit={handleSave} className="note-form">
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input"
            required
          />
        </div>
        <div className="form-group">
          <label>Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="input"
            rows={5}
            required
          />
        </div>
        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="input"
            required
          />
        </div>
        <div className="form-group">
          <label>Attachment (optional)</label>
          <input type="file" onChange={handleFileChange} className="input" />
        </div>
        <button type="submit" className="button primary" disabled={loading}>
          {loading ? 'Saving...' : 'Save'}
        </button>
      </form>
    </div>
  );
};

export default CreateNote;