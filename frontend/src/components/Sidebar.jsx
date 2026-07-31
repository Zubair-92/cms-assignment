import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import { useLanguage } from '../context/LanguageContext';

// Recursive sub-item component for sidebar dropdowns
const DynamicSidebarItem = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isRtl } = useLanguage();
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
            {isOpen ? '▼' : isRtl ? '◄' : '►'}
          </button>
        )}
      </div>

      {/* Render submenus recursively with RTL-aware border & indenting */}
      {hasChildren && isOpen && (
        <div
          className={`mt-1 space-y-1 ${
            isRtl
              ? 'pr-4 border-r border-slate-700 mr-3'
              : 'pl-4 border-l border-slate-700 ml-3'
          }`}
        >
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
  const { lang, isRtl, toggleLanguage } = useLanguage();

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    try {
      const response = await axios.get('/menus/tree');
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
    <aside className="w-64 bg-slate-900 text-slate-100 min-h-screen p-4 flex flex-col justify-between border-e border-slate-800">
      <div>
        <h2 className="text-xl font-bold mb-6 text-white px-2">
          {isRtl ? 'نظام إدارة المحتوى' : 'CMS Admin'}
        </h2>
        
        {/* Static Core System Section */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2">
            {isRtl ? 'النظام الأساسي' : 'System Core'}
          </p>
          <nav className="space-y-1">
            <Link to="/dashboard" className="block px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800">
              📊 {isRtl ? 'لوحة التحكم' : 'Dashboard'}
            </Link>
            <Link to="/pages" className="block px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800">
              📄 {isRtl ? 'إدارة الصفحات' : 'Pages Management'}
            </Link>
            <Link to="/menus" className="block px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800">
              🌿 {isRtl ? 'منشئ القوائم' : 'Menu Builder'}
            </Link>
          </nav>
        </div>

        {/* Dynamic Navigation Section */}
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2">
            {isRtl ? 'القوائم الديناميكية' : 'Dynamic Navigation'}
          </p>
          {loading ? (
            <p className="text-xs text-slate-500 px-2">
              {isRtl ? 'جاري التحميل...' : 'Loading menu...'}
            </p>
          ) : dynamicMenus.length === 0 ? (
            <p className="text-xs text-slate-500 px-2">
              {isRtl ? 'لا توجد روابط حتى الآن' : 'No dynamic links yet.'}
            </p>
          ) : (
            <nav className="space-y-1">
              {dynamicMenus.map((menu) => (
                <DynamicSidebarItem key={menu.id} item={menu} />
              ))}
            </nav>
          )}
        </div>
      </div>

      {/* Language / RTL Toggle Switch */}
      <div className="border-t border-slate-800 pt-4 mt-auto">
        <button
          onClick={toggleLanguage}
          className="w-full flex items-center justify-between px-3 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 text-sm font-medium transition-colors"
        >
          <span className="flex items-center gap-2">
            🌐 {lang === 'en' ? 'English' : 'العربية'}
          </span>
          <span className="text-xs bg-indigo-600 px-2 py-0.5 rounded font-bold uppercase tracking-wide">
            {lang === 'en' ? 'RTL' : 'LTR'}
          </span>
        </button>
      </div>
    </aside>
  );
}