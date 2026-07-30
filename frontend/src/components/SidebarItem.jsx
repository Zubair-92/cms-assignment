// src/components/SidebarItem.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export function SidebarItem({ item }) {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;

  return (
    <div className="flex flex-col space-y-1">
      <div className="flex items-center justify-between px-3 py-2 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
        <Link to={item.url || '#'} className="flex-1 font-medium text-sm">
          {item.title}
        </Link>
        {hasChildren && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 text-slate-400 hover:text-white text-xs"
          >
            {isOpen ? '▲' : '▼'}
          </button>
        )}
      </div>

      {hasChildren && isOpen && (
        <div className="ml-4 pl-2 border-l border-slate-700 space-y-1">
          {item.children.map((child) => (
            <SidebarItem key={child.id} item={child} />
          ))}
        </div>
      )}
    </div>
  );
}