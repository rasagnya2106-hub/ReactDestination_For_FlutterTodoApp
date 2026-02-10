package src/components/SortMenu.jsx
import React, { useState, useRef, useEffect } from 'react';
import NoteQuery from '../enums/NoteQuery';
import CustomColors from '../styles/CustomColors';

const options = [
  { label: 'Sort by Title ↑', value: NoteQuery.TITLE_ASC },
  { label: 'Sort by Title ↓', value: NoteQuery.TITLE_DESC },
  { label: 'Sort by Date ↑', value: NoteQuery.DATE_ASC },
  { label: 'Sort by Date ↓', value: NoteQuery.DATE_DESC }
];

const SortMenu = ({ selectedQuery, onSelect }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const handleToggle = () => setOpen(!open);
  const handleSelect = (value) => {
    onSelect(value);
    setOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }} ref={menuRef}>
      <button
        onClick={handleToggle}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: CustomColors.primary,
          fontSize: '1.5rem'
        }}
        aria-label="Sort options"
      >
        ☰
      </button>
      {open && (
        <ul
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            margin: 0,
            padding: '0.5rem 0',
            listStyle: 'none',
            background: '#fff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            borderRadius: '4px',
            minWidth: '180px',
            zIndex: 1000
          }}
        >
          {options.map((opt) => (
            <li key={opt.value}>
              <button
                onClick={() => handleSelect(opt.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem 1rem',
                  background: opt.value === selectedQuery ? CustomColors.primary + '20' : 'transparent',
                  border: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  color: opt.value === selectedQuery ? CustomColors.primary : '#000'
                }}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SortMenu;