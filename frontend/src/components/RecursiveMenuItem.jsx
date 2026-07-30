import React from 'react';

export default function RecursiveMenuItem({ 
  item, 
  index, 
  siblings = [], 
  onAddChild, 
  onDelete, 
  onReorder, 
  depth = 0 
}) {
  const isFirst = index === 0;
  const isLast = index === siblings.length - 1;

  return (
    <div className="border-l-2 border-indigo-200 dark:border-slate-700 ml-4 pl-4 my-2">
      <div className="flex items-center justify-between p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
        
        {/* Title, URL & Up/Down Controls */}
        <div className="flex items-center gap-2">
          {/* Reorder Buttons */}
          <div className="flex flex-col gap-0.5">
            <button
              type="button"
              onClick={() => onReorder(index, 'up', siblings)}
              disabled={isFirst}
              className="px-1 py-0.2 text-[10px] font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded disabled:opacity-20 disabled:cursor-not-allowed"
              title="Move Up"
            >
              ▲
            </button>
            <button
              type="button"
              onClick={() => onReorder(index, 'down', siblings)}
              disabled={isLast}
              className="px-1 py-0.2 text-[10px] font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded disabled:opacity-20 disabled:cursor-not-allowed"
              title="Move Down"
            >
              ▼
            </button>
          </div>

          <div>
            <span className="font-semibold text-slate-800 dark:text-slate-100">{item.title}</span>
            <span className="ml-2 text-xs font-mono text-slate-500">{item.url}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onAddChild(item.id)}
            className="px-2 py-1 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded dark:bg-slate-700 dark:text-indigo-400"
          >
            + Submenu
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="px-2 py-1 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded dark:bg-slate-700 dark:text-red-400"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Recursive Render for Children */}
      {item.children && item.children.length > 0 && (
        <div className="mt-1">
          {item.children.map((child, childIndex) => (
            <RecursiveMenuItem
              key={child.id}
              item={child}
              index={childIndex}
              siblings={item.children}
              onAddChild={onAddChild}
              onDelete={onDelete}
              onReorder={onReorder}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}