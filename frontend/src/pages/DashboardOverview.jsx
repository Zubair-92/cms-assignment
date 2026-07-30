// src/pages/DashboardOverview.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function DashboardOverview() {
  const [stats, setStats] = useState({ pagesCount: 0, menusCount: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const [pagesRes, menusRes] = await Promise.all([
          api.get('/pages'),
          api.get('/menus/public'),
        ]);

        const pagesData = pagesRes.data?.data || pagesRes.data || [];
        const menusData = menusRes.data?.data || menusRes.data || [];

        setStats({
          pagesCount: Array.isArray(pagesData) ? pagesData.length : 0,
          menusCount: Array.isArray(menusData) ? menusData.length : 0,
        });
      } catch (err) {
        console.error('Failed to load dashboard statistics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-xl p-6 text-white shadow-md">
        <h1 className="text-2xl font-bold">CMS Core Control Panel</h1>
        <p className="text-indigo-100 text-sm mt-1">
          Manage dynamic pages, recursive navigation menus, and system routing from one central place.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Content Pages</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
              {loading ? '...' : stats.pagesCount}
            </span>
            <Link to="/pages" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
              Manage Pages →
            </Link>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">Root Menu Nodes</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
              {loading ? '...' : stats.menusCount}
            </span>
            <Link to="/menus" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
              Manage Menus →
            </Link>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">System API Status</span>
          <div className="mt-2 flex items-center justify-between">
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Sanctum Active
            </span>
            <a href="/" target="_blank" rel="noreferrer" className="text-xs font-semibold text-slate-500 hover:text-slate-700">
              View Public Site ↗
            </a>
          </div>
        </div>
      </div>

      {/* Quick Action Shortcuts */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-800 dark:text-slate-100">Quick Operations</h3>
        <div className="flex flex-wrap gap-4">
          <Link
            to="/pages"
            className="px-4 py-2 bg-indigo-50 dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 font-medium text-sm rounded-lg hover:bg-indigo-100 transition"
          >
            📄 Create & Publish New Page
          </Link>
          <Link
            to="/menus"
            className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium text-sm rounded-lg hover:bg-slate-200 transition"
          >
            🌿 Reorder Menu Trees
          </Link>
        </div>
      </div>
    </div>
  );
}