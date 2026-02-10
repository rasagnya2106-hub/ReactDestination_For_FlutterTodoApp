import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Fab,
  Box,
} from '@mui/material';
import SortIcon from '@mui/icons-material/Sort';
import AddIcon from '@mui/icons-material/Add';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { collection, query as firestoreQuery, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { AuthContext } from '../contexts/AuthContext';
import DatabaseHelper from '../utils/DatabaseHelper';
import CustomColors from '../theme/CustomColors';
import NoteItem from './NoteItem';

const sortOptions = [
  { label: 'Date Ascending', value: 'dateAsc' },
  { label: 'Date Descending', value: 'dateDesc' },
];

function buildFirestoreQuery(notesRef, sortKey) {
  switch (sortKey) {
    case 'dateDesc':
      return firestoreQuery(notesRef, orderBy('date', 'desc'));
    case 'dateAsc':
    default:
      return firestoreQuery(notesRef, orderBy('date', 'asc'));
  }
}

export default function MyNotes() {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const [uid, setUid] = useState(null);
  const [selectedSort, setSelectedSort] = useState('dateAsc');
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [unsubscribe, setUnsubscribe] = useState(null);

  useEffect(() => {
    if (currentUser) {
      const userId = currentUser.uid;
      setUid(userId);
      DatabaseHelper.updateNoteref(userId);
    }
  }, [currentUser]);

  useEffect(() => {
    if (!uid) return;
    if (unsubscribe) {
      unsubscribe();
    }
    const notesRef = collection(db, `users/${uid}/notes`);
    const q = buildFirestoreQuery(notesRef, selectedSort);
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNotes(data);
        setLoading(false);
        setError(null);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );
    setUnsubscribe(() => unsub);
    return () => {
      if (unsub) unsub();
    };
  }, [uid, selectedSort]);

  const handleSortClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSortClose = () => {
    setAnchorEl(null);
  };

  const handleSortSelect = (value) => {
    setSelectedSort(value);
    setLoading(true);
    handleSortClose();
  };

  const handleDelete = async (noteId) => {
    try {
      await DatabaseHelper.deleteNoteById(noteId);
      window.alert('Note deleted');
    } catch (e) {
      window.alert('Failed to delete note');
    }
  };

  const handleAddNote = () => {
    navigate('/create-note');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ bgcolor: CustomColors.primary }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            My Notes
          </Typography>
          <IconButton color="inherit" onClick={handleSortClick}>
            <SortIcon />
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleSortClose}>
            {sortOptions.map((option) => (
              <MenuItem
                key={option.value}
                selected={option.value === selectedSort}
                onClick={() => handleSortSelect(option.value)}
              >
                {option.label}
              </MenuItem>
            ))}
          </Menu>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 2, minHeight: '80vh', position: 'relative' }}>
        {error && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
            }}
          >
            <ErrorOutlineIcon sx={{ fontSize: 80, color: CustomColors.primary }} />
            <Typography variant="h6" color="error" sx={{ mt: 2 }}>
              {error.message || 'An error occurred'}
            </Typography>
          </Box>
        )}

        {loading && !error && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
            }}
          >
            <CircularProgress sx={{ color: CustomColors.firebaseOrange }} />
          </Box>
        )}

        {!loading && !error && (
          <List>
            {notes.map((note) => (
              <NoteItem key={note.id} noteId={note.id} noteData={note} onDelete={handleDelete} />
            ))}
          </List>
        )}
      </Box>

      <Fab
        color="primary"
        aria-label="add"
        onClick={handleAddNote}
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          bgcolor: CustomColors.firebaseOrange,
          '&:hover': { bgcolor: CustomColors.firebaseOrange },
        }}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
}