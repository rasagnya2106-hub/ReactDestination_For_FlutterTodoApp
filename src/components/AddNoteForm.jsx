package src/components
import React, { useState } from 'react';
import { TextField, Button, Snackbar } from '@mui/material';
import DatabaseHelper from '../helpers/DatabaseHelper';

const AddNoteForm = () => {
  const [title, setTitle] = useState('');
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const note = { title };
    DatabaseHelper.addNote(note, (msg) => {
      setSnackMessage(msg);
      setSnackOpen(true);
    });
    setTitle('');
  };

  const handleSnackClose = () => {
    setSnackOpen(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Note Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <Button type="submit" variant="contained" color="primary">
          Add Note
        </Button>
      </form>
      <Snackbar
        open={snackOpen}
        autoHideDuration={3000}
        onClose={handleSnackClose}
        message={snackMessage}
      />
    </>
  );
};

export default AddNoteForm;