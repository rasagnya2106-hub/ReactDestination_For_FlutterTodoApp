package src/components/SnackbarProvider.jsx
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

const SnackbarContext = createContext(null);

export const SnackbarProvider = ({ children }) => {
  const [message, setMessage] = useState('');
  const [visible, setVisible] = useState(false);
  const timerRef = useRef(null);

  const showMessage = useCallback((msg) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setMessage(msg);
    setVisible(true);
    timerRef.current = setTimeout(() => {
      setVisible(false);
      timerRef.current = null;
    }, 3000);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <SnackbarContext.Provider value={showMessage}>
      {children}
      {visible && (
        <div style={styles.container}>
          <div style={styles.snackbar}>{message}</div>
        </div>
      )}
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (context === null) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
};

const styles = {
  container: {
    position: 'fixed',
    bottom: 20,
    left: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'center',
    pointerEvents: 'none',
    zIndex: 1000,
  },
  snackbar: {
    backgroundColor: '#323232',
    color: '#fff',
    padding: '12px 24px',
    borderRadius: 4,
    boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
    maxWidth: '80%',
    textAlign: 'center',
    pointerEvents: 'auto',
  },
};