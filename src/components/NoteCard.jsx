package src/components/NoteCard.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import DatabaseHelper from '../utils/DatabaseHelper';
import './NoteCard.css';

const NoteCard = ({ noteSnapshot, onEdit, onDelete, className = '' }) => {
  const navigate = useNavigate();

  const id = noteSnapshot.id;
  const data = noteSnapshot.data() || {};
  const title = data.title || '';
  const date = data.date ? new Date(data.date.seconds * 1000) : null;
  const formattedDate = date ? date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : null;

  const handleEdit = async (e) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(id, noteSnapshot);
      return;
    }
    try {
      const fullDoc = await DatabaseHelper.getNoteById(id);
      navigate('/create-note', { state: { note: fullDoc } });
    } catch (error) {
      toast.error('Failed to load note for editing.', {
        style: { backgroundColor: 'var(--error-color)', color: '#fff' },
      });
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(id);
      return;
    }
    try {
      await DatabaseHelper.deleteNoteById(id);
      toast.success('Note dismissed', {
        style: { backgroundColor: 'var(--primary-color)', color: '#fff' },
      });
    } catch (error) {
      toast.error('Failed to delete note.', {
        style: { backgroundColor: 'var(--error-color)', color: '#fff' },
      });
    }
  };

  return (
    <div
      className={`note-card ${className}`}
      role="button"
      aria-label={`Edit note ${title}`}
      onClick={handleEdit}
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleEdit(e);
        }
      }}
    >
      <div className="note-card-content">
        <h3 className="note-title">{title}</h3>
        {formattedDate && <p className="note-date">{formattedDate}</p>}
      </div>
      <button
        type="button"
        className="note-delete-button"
        aria-label="Delete note"
        onClick={handleDelete}
      >
        &times;
      </button>
    </div>
  );
};

NoteCard.propTypes = {
  noteSnapshot: PropTypes.shape({
    id: PropTypes.string.isRequired,
    data: PropTypes.func.isRequired,
  }).isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  className: PropTypes.string,
};

export default NoteCard;