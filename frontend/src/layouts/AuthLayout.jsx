import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AuthLayout = () => {
  const { currentUser, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // If user is already authenticated, redirect to dashboard
  if (currentUser) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto py-8">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;