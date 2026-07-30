// src/pages/Dashboard.jsx
import React from 'react';

export default function Dashboard() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Welcome to CMS Dashboard</h1>
      <p className="text-slate-600 dark:text-slate-400">
        Use the sidebar to manage your pages, roles, and recursive navigation menus.
      </p>
    </div>
  );
}