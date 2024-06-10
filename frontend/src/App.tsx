import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import WikiPage from './pages/WikiPage';
import { AuthProvider } from './contexts/AuthContext';

const App: React.FC = () =>
{
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<WikiPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/*" element={<WikiPage />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
