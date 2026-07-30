import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from '../api/axios'; // adjust import path to your axios instance

// Recursive sub-item component for sidebar dropdowns
const DynamicSidebarItem = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between px-3 py-2 text-sm rounded-lg hover:bg-slate-800 text-slate-300">
        <Link to={item.url || '#'} className="flex-1">
          {item.title}
        </Link>
        
        {hasChildren && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-slate-400 hover:text-white px-2 py-0.5 text-xs focus:outline-none"
          >
            {isOpen ? '▼' : '►'}
          </button>
        )}
      </div>

      {/* Render submenus recursively if expanded */}
      {hasChildren && isOpen && (
        <div className="pl-4 border-l border-slate-700 ml-3 mt-1 space-y-1">
          {item.children.map((child) => (
            <DynamicSidebarItem key={child.id} item={child} />
          ))}
        </div>
      )}
    </div>
  );
};

export default function Sidebar() {
  const [dynamicMenus, setDynamicMenus] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
  try {
    // Notice: '/menus/tree' without the leading '/api'
    const response = await axios.get('/menus/tree');
    
    // Unwraps the array properly
    const menuData = Array.isArray(response.data) 
      ? response.data 
      : (response.data.data || []);
      
    console.log('Fetched dynamic menus:', menuData);
    setDynamicMenus(menuData);
  } catch (error) {
    console.error('Failed to load menu tree:', error?.response || error);
  } finally {
    setLoading(false);
  }
};

  return (
    <aside className="w-64 bg-slate-900 text-slate-100 min-h-screen p-4 flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-bold mb-6 text-white px-2">CMS Admin</h2>
        
        {/* Static Section */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2">
            System Core
          </p>
          <nav className="space-y-1">
            <Link to="/dashboard" className="block px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800">
              📊 Dashboard
            </Link>
            <Link to="/pages" className="block px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800">
              📄 Pages Management
            </Link>
            <Link to="/menus" className="block px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800">
              🌿 Menu Builder
            </Link>
          </nav>
        </div>

        {/* Dynamic Nav Section (Fetched from Menu Builder) */}
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2">
            Dynamic Navigation
          </p>
          {loading ? (
            <p className="text-xs text-slate-500 px-2">Loading menu...</p>
          ) : dynamicMenus.length === 0 ? (
            <p className="text-xs text-slate-500 px-2">No dynamic links yet.</p>
          ) : (
            <nav className="space-y-1">
              {dynamicMenus.map((menu) => (
                <DynamicSidebarItem key={menu.id} item={menu} />
              ))}
            </nav>
          )}
        </div>
      </div>
    </aside>
  );
}