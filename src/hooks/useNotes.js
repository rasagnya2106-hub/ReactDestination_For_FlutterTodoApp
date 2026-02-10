package src/hooks
import { useState, useEffect, useContext } from 'react';
import { onSnapshot } from 'firebase/firestore';
import { notesRef } from '../services/DatabaseService';
import { AuthContext } from '../context/AuthContext';

const useNotes = () => {
  const { uid } = useContext(AuthContext) || {};
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!uid || !notesRef) {
      setLoading(false);
      setNotes([]);
      return;
    }

    const unsubscribe = onSnapshot(
      notesRef,
      (snapshot) => {
        const notesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNotes(notesData);
        setLoading(false);
        setError(null);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [uid, notesRef]);

  return { notes, loading, error };
};

export default useNotes;