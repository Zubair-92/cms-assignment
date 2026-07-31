// src/components/DashboardLayout.jsx
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import Sidebar from './Sidebar';

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const { isRtl } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (logout) {
      await logout();
    } else {
      localStorage.removeItem('token');
    }
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-100">
      {/* Dynamic, RTL-ready Sidebar Component */}
      <Sidebar />

      {/* Main Content Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navigation / User Header */}
        <header className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 px-8 py-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              {isRtl ? 'مرحباً بعودتك،' : 'Welcome back,'} {user?.name || (isRtl ? 'مدير النظام' : 'System Admin')}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {user?.email || 'admin@example.com'}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="px-3 py-1.5 text-xs font-semibold text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 bg-red-50 dark:bg-red-950/40 rounded-md transition-colors"
          >
            {isRtl ? 'تسجيل الخروج' : 'Logout'}
          </button>
        </header>

        {/* Dynamic Route Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}