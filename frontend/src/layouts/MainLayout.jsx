import React, { useState } from 'react';
import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const MainLayout = () => {
  const { currentUser, loading, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  // Check if loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Navigation items
  const navItems = [
    { path: '/dashboard', name: 'Dashboard', icon: 'dashboard' },
    { path: '/profile', name: 'Profile', icon: 'person' },
    { path: '/users', name: 'User Management', icon: 'group' },
    { path: '/groups', name: 'Group Management', icon: 'folder' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div 
        className={`bg-indigo-800 text-white ${
          isSidebarOpen ? 'w-64' : 'w-20'
        } transition-all duration-300 ease-in-out flex flex-col`}
      >
        {/* App Logo */}
        <div className="p-4 flex items-center justify-between">
          {isSidebarOpen && <h1 className="text-xl font-bold">Admin Panel</h1>}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md hover:bg-indigo-700 focus:outline-none"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isSidebarOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 5l7 7-7 7M5 5l7 7-7 7"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 mt-5 px-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center py-2 px-4 rounded-md ${
                location.pathname === item.path
                  ? 'bg-indigo-700 text-white'
                  : 'text-indigo-100 hover:bg-indigo-700'
              } transition-colors duration-200 mb-1`}
            >
              <span className="material-icons mr-3">{item.icon}</span>
              {isSidebarOpen && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>

        {/* User profile and logout */}
        <div className="p-4 border-t border-indigo-700">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">
              {currentUser.name?.charAt(0) || currentUser.email?.charAt(0) || 'U'}
            </div>
            {isSidebarOpen && (
              <div className="ml-3">
                <p className="text-sm font-medium">{currentUser.name || currentUser.email}</p>
                <button
                  onClick={logout}
                  className="text-xs text-indigo-200 hover:text-white"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between h-16 px-6">
            <h1 className="text-2xl font-semibold text-gray-800">
              {navItems.find(item => item.path === location.pathname)?.name || 'Dashboard'}
            </h1>
            <div className="flex items-center">
              <span className="text-sm text-gray-600 mr-4">
                {currentUser.name || currentUser.email}
              </span>
              {!isSidebarOpen && (
                <button
                  onClick={logout}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;