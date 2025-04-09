import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Layouts
import AuthLayout from './layouts/AuthLayout';
import MainLayout from './layouts/MainLayout';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import UserManagement from './pages/UserManagement';
import GroupManagement from './pages/GroupManagement';
import NotFound from './pages/NotFound';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Protected routes */}
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/groups" element={<GroupManagement />} />
          </Route>

          {/* Redirect root to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* 404 page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;