package src/components/NoteItem.jsx
import React, { useState } from 'react';
import { Card, CardContent, Typography, Snackbar } from '@mui/material';
import { SwipeableList, SwipeableListItem } from 'react-swipeable-list';
import 'react-swipeable-list/dist/styles.css';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Database from '../services/Database';

const NoteItem = ({ note, docId, onDelete }) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const navigate = useNavigate();

  const handleDismiss = async () => {
    await Database.deleteNoteById(docId);
    setSnackbarOpen(true);
    if (onDelete) onDelete(docId);
  };

  const handleClick = async () => {
    const noteRef = doc(db, 'notes', docId);
    const snapshot = await getDoc(noteRef);
    if (snapshot.exists()) {
      const fullNote = { id: snapshot.id, ...snapshot.data() };
      navigate('/create-note', { state: { note: fullNote } });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <SwipeableList>
        <SwipeableListItem
          key={docId}
          swipeLeft={{
            content: (
              <div
                style={{
                  backgroundColor: '#1976d2',
                  color: '#fff',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  height: '100%',
                }}
              >
                Delete
              </div>
            ),
            action: handleDismiss,
          }}
        >
          <Card
            onClick={handleClick}
            sx={{
              backgroundColor: 'primary.main',
              cursor: 'pointer',
              marginBottom: 1,
            }}
          >
            <CardContent>
              <Typography variant="h6" color="common.white">
                {note.title}
              </Typography>
            </CardContent>
          </Card>
        </SwipeableListItem>
      </SwipeableList>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message="Note dismissed"
      />
    </>
  );
};

export default NoteItem;