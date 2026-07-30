import React, { useEffect, useState } from 'react';
import api from '../api/axios';

function RecursiveMenuItem({ 
  item, 
  index, 
  siblings = [], 
  onSelectParent, 
  onDelete, 
  onReorder,
  onUpdate
}) {
  const [expanded, setExpanded] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(item.title);
  const [editUrl, setEditUrl] = useState(item.url);
  const [saving, setSaving] = useState(false);

  const hasChildren = item.children && item.children.length > 0;
  const isFirst = index === 0;
  const isLast = index === siblings.length - 1;

  const handleSaveEdit = async () => {
    setSaving(true);
    try {
      await onUpdate(item.id, { title: editTitle, url: editUrl });
      setIsEditing(false);
    } catch (err) {
      console.error('Update failed', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="ml-4 pl-4 border-l-2 border-indigo-200 dark:border-slate-700 my-2">
      <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
        
        {isEditing ? (
          /* Inline Edit Form */
          <div className="flex items-center gap-2 flex-1 mr-4">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="px-2 py-1 text-sm border rounded dark:bg-slate-900 dark:border-slate-700 text-slate-800 dark:text-slate-100 flex-1"
            />
            <input
              type="text"
              value={editUrl}
              onChange={(e) => setEditUrl(e.target.value)}
              className="px-2 py-1 text-sm border rounded dark:bg-slate-900 dark:border-slate-700 text-slate-800 dark:text-slate-100 flex-1"
            />
            <button
              onClick={handleSaveEdit}
              disabled={saving}
              className="px-2.5 py-1 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded transition disabled:opacity-50"
            >
              {saving ? '...' : 'Save'}
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setEditTitle(item.title);
                setEditUrl(item.url);
              }}
              className="px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
            >
              Cancel
            </button>
          </div>
        ) : (
          /* Standard Display */
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => onReorder(index, 'up', siblings)}
                disabled={isFirst}
                className="w-6 h-6 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-slate-600 rounded transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                title="Move Up"
              >
                ▲
              </button>
              <button
                type="button"
                onClick={() => onReorder(index, 'down', siblings)}
                disabled={isLast}
                className="w-6 h-6 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-slate-600 rounded transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                title="Move Down"
              >
                ▼
              </button>
            </div>

            {hasChildren && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-slate-400 hover:text-slate-600 text-xs font-mono w-4"
              >
                {expanded ? '▼' : '►'}
              </button>
            )}
            
            <span className="font-semibold text-slate-800 dark:text-slate-100">{item.title}</span>
            <span className="text-xs font-mono text-indigo-500 bg-indigo-50 dark:bg-slate-700 dark:text-indigo-300 px-2 py-0.5 rounded">
              {item.url}
            </span>
          </div>
        )}

        {/* Action Controls */}
        {!isEditing && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="px-2.5 py-1 text-xs font-medium text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-md transition dark:bg-slate-700 dark:text-amber-400"
            >
              Edit
            </button>
            <button
              onClick={() => onSelectParent(item)}
              className="px-2.5 py-1 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-md transition dark:bg-slate-700 dark:text-indigo-300"
            >
              + Submenu
            </button>
            <button
              onClick={() => onDelete(item.id)}
              className="px-2.5 py-1 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition dark:bg-slate-700 dark:text-red-400"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {hasChildren && expanded && (
        <div className="mt-1">
          {item.children.map((child, childIndex) => (
            <RecursiveMenuItem
              key={child.id}
              item={child}
              index={childIndex}
              siblings={item.children}
              onSelectParent={onSelectParent}
              onDelete={onDelete}
              onReorder={onReorder}
              onUpdate={onUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Menus() {
  const [menuTree, setMenuTree] = useState([]);
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [selectedParent, setSelectedParent] = useState(null);

  const fetchTree = async () => {
    try {
      const response = await api.get('/menus/tree');
      setMenuTree(response.data);
    } catch (err) {
      console.error('Failed to fetch menu tree:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPages = async () => {
    try {
      const response = await api.get('/pages');
      setPages(Array.isArray(response.data) ? response.data : response.data.data || []);
    } catch (err) {
      console.error('Failed to fetch pages for dropdown:', err);
    }
  };

  useEffect(() => {
    fetchTree();
    fetchPages();
  }, []);

  const handlePageSelect = (e) => {
    const pageId = e.target.value;
    if (!pageId) return;

    const selectedPage = pages.find((p) => String(p.id) === String(pageId));
    if (selectedPage) {
      setTitle(selectedPage.title || selectedPage.name);
      setUrl(selectedPage.slug ? `/${selectedPage.slug}` : `/pages/${selectedPage.id}`);
    }
  };

  const handleUpdate = async (id, updatedData) => {
    try {
      await api.put(`/menus/${id}`, updatedData);
      await fetchTree();
    } catch (err) {
      alert('Failed to update menu item.');
      throw err;
    }
  };

  const handleReorder = async (currentIndex, direction, siblingList) => {
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= siblingList.length) return;

    const reordered = [...siblingList];
    const [movedItem] = reordered.splice(currentIndex, 1);
    reordered.splice(targetIndex, 0, movedItem);

    const payload = reordered.map((item, idx) => ({
      id: item.id,
      order: idx,
    }));

    try {
      await api.post('/menus/reorder', { items: payload });
      await fetchTree();
    } catch (err) {
      console.error('Failed to reorder menu items:', err);
      alert('Failed to save new menu order.');
    }
  };

  const handleCreateMenu = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/menus', {
        title,
        url,
        parent_id: selectedParent ? selectedParent.id : null,
      });

      setTitle('');
      setUrl('');
      setSelectedParent(null);
      await fetchTree();
    } catch (err) {
      console.error('POST /menus error:', err);
      alert('Failed to create menu item.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this menu item and its children?')) return;
    try {
      await api.delete(`/menus/${id}`);
      fetchTree();
    } catch (err) {
      alert('Failed to delete menu item.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            Recursive Menu Management
          </h1>
          <p className="text-slate-500 text-sm">
            Create top-level menu links or nest items to create dynamic dropdown trees.
          </p>
        </div>
      </div>

      {/* Form Section */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
          {selectedParent ? `Add Submenu under "${selectedParent.title}"` : 'Add Root Menu Node'}
        </h2>

        {pages.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Link Existing Page:</span>
            <select
              onChange={handlePageSelect}
              defaultValue=""
              className="px-3 py-1.5 border rounded-lg dark:bg-slate-900 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
            >
              <option value="" disabled>-- Select a published page --</option>
              {pages.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title || p.name} ({p.slug ? `/${p.slug}` : `/pages/${p.id}`})
                </option>
              ))}
            </select>
          </div>
        )}

        <form onSubmit={handleCreateMenu} className="flex flex-wrap items-center gap-4">
          <input
            type="text"
            placeholder="Menu Title (e.g. Services)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm flex-1 min-w-[200px]"
          />
          <input
            type="text"
            placeholder="URL (e.g. /services)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            className="px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm flex-1 min-w-[200px]"
          />

          {selectedParent && (
            <div className="flex items-center gap-2 bg-indigo-50 dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 px-3 py-2 rounded-lg text-xs font-medium">
              Parent: {selectedParent.title}
              <button
                type="button"
                onClick={() => setSelectedParent(null)}
                className="hover:text-red-500 font-bold ml-1"
              >
                ✕
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-lg transition disabled:opacity-50"
          >
            {submitting ? 'Saving...' : selectedParent ? 'Add Submenu' : '+ Add Root Item'}
          </button>
        </form>
      </div>

      {/* Visual Hierarchy Tree */}
      <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700 min-h-[300px]">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4">
          Active Hierarchy Tree
        </h2>

        {loading ? (
          <p className="text-slate-400 text-sm">Loading dynamic tree...</p>
        ) : menuTree.length === 0 ? (
          <p className="text-slate-400 text-sm italic">
            No menu items found. Use the form above to add your first root item!
          </p>
        ) : (
          <div className="-ml-4">
            {menuTree.map((item, index) => (
              <RecursiveMenuItem
                key={item.id}
                item={item}
                index={index}
                siblings={menuTree}
                onSelectParent={(parent) => setSelectedParent(parent)}
                onDelete={handleDelete}
                onReorder={handleReorder}
                onUpdate={handleUpdate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}