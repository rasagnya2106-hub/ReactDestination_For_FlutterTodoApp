import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import LandingScreen from './screens/LandingScreen';

function AuthGuard({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route
            path="/home"
            element={
              <AuthGuard>
                <HomeScreen />
              </AuthGuard>
            }
          />
          <Route path="/landing" element={<LandingScreen />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;