// src/components/DashboardLayout.jsx
import React, { useEffect, useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { SidebarItem } from './SidebarItem';

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const [menuItems, setMenuItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/api/menus/tree')
      .then((res) => setMenuItems(res.data))
      .catch((err) => console.error('Failed to load menu tree:', err));
  }, []);

  const handleLogout = async () => {
    if (logout) {
      await logout();
    } else {
      localStorage.removeItem('token');
    }
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-slate-100 dark:bg-slate-900">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-950 text-slate-100 flex flex-col justify-between p-4 min-h-screen border-r border-slate-800">
        <div className="space-y-6">
          <div className="flex items-center gap-2 font-bold text-xl px-3 text-indigo-400">
            CMS Admin
          </div>

          <nav className="space-y-1">
            <span className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Static Navigation
            </span>

            <Link to="/dashboard" className="block px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 font-medium text-sm">
              📊 Dashboard
            </Link>
            <Link to="/pages" className="block px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 font-medium text-sm">
              📄 Pages Management
            </Link>
            <Link to="/menus" className="block px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 font-medium text-sm">
              🌿 Menu Builder
            </Link>

            {menuItems.length > 0 && (
              <div className="pt-4 border-t border-slate-800">
                <span className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Dynamic Menus
                </span>
                <div className="mt-2 space-y-1">
                  {menuItems.map((item) => (
                    <SidebarItem key={item.id} item={item} />
                  ))}
                </div>
              </div>
            )}
          </nav>
        </div>

        {/* User Footer */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-white">Welcome back, {user?.name || 'System Admin'}</p>
            <p className="text-xs text-slate-400">{user?.email || 'admin@example.com'}</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-xs text-red-400 hover:text-red-300 font-semibold"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}