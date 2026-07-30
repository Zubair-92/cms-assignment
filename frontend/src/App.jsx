// App.jsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import api from './api/axios';
import Login from './pages/Login';
import Sidebar from './components/Sidebar';
import Pages from './pages/Pages';
import Menus from './pages/Menus';
import DynamicPage from './pages/DynamicPage';
import DashboardOverview from './pages/DashboardOverview';

// Admin Panel Layout
const DashboardLayout = () => {
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center shadow-sm">
          <h2 className="text-lg font-semibold text-gray-700">
            Welcome back, <span className="text-blue-600 font-bold">{user?.name || 'Admin'}</span>
          </h2>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-md hover:bg-red-600 transition"
          >
            Logout
          </button>
        </header>
        <div className="p-8 flex-1 overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

// Recursive Nav Item for Public Topbar
const PublicNavItem = ({ item }) => {
  const hasChildren = item.children && item.children.length > 0;

  return (
    <div className="relative group">
      <Link
        to={item.url}
        className="px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 transition"
      >
        {item.title}
        {hasChildren && <span className="text-xs text-slate-400">▼</span>}
      </Link>

      {/* Dropdown Menu for Nested Submenus */}
      {hasChildren && (
        <div className="absolute left-0 hidden group-hover:block w-48 bg-white dark:bg-slate-800 rounded-md shadow-lg py-1 border border-slate-200 dark:border-slate-700 z-50">
          {item.children.map((child) => (
            <Link
              key={child.id}
              to={child.url}
              className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-slate-700 hover:text-indigo-600 transition"
            >
              {child.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

// Public Site Layout with Navigation Header
const PublicLayout = () => {
  const [publicMenus, setPublicMenus] = useState([]);

  useEffect(() => {
    const fetchPublicMenus = async () => {
      try {
        const response = await api.get('/menus/public');
        const payload = response.data;
        setPublicMenus(Array.isArray(payload) ? payload : payload.data || []);
      } catch (err) {
        console.error('Failed to load public navigation menu:', err);
      }
    };

    fetchPublicMenus();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 flex flex-col">
      {/* Public Header Nav */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
            My CMS Site
          </Link>
          <nav className="flex items-center space-x-2">
            {publicMenus.map((menuItem) => (
              <PublicNavItem key={menuItem.id} item={menuItem} />
            ))}
          </nav>
        </div>
      </header>

      {/* Dynamic Page Content */}
      <main className="container mx-auto px-4 py-8 flex-1">
        <Outlet />
      </main>
    </div>
  );
};

// Protected Admin Route Guard
const ProtectedRoute = () => {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 font-medium">
        Loading session...
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <DashboardLayout />;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Authentication */}
          <Route path="/login" element={<Login />} />

          {/* Protected Admin Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardOverview />} />
            <Route path="/pages" element={<Pages />} />
            <Route path="/menus" element={<Menus />} />
          </Route>

          {/* Public Dynamic CMS Pages */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<DynamicPage />} />
            <Route path="/:slug" element={<DynamicPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}