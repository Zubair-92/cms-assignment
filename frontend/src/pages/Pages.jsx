// src/pages/Pages.jsx
import React, { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Pages() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPage, setEditingPage] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    status: 'published',
    add_to_menu: false,
  });

  const fetchPages = async () => {
    setLoading(true);
    try {
      const response = await api.get('/pages');
      const payload = response.data;
      setPages(Array.isArray(payload) ? payload : payload.data || []);
    } catch (err) {
      console.error('Failed to fetch pages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const handleOpenModal = (page = null) => {
    if (page) {
      setEditingPage(page);
      setFormData({
        title: page.title,
        slug: page.slug,
        content: page.content,
        status: page.status || 'published',
        add_to_menu: false,
      });
    } else {
      setEditingPage(null);
      setFormData({
        title: '',
        slug: '',
        content: '',
        status: 'published',
        add_to_menu: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPage) {
        await api.put(`/pages/${editingPage.id}`, formData);
      } else {
        const response = await api.post('/pages', formData);
        
        // Auto-add page to menu builder if checked
        if (formData.add_to_menu && response.data?.data) {
          const newPage = response.data.data;
          await api.post('/menus', {
            title: newPage.title,
            url: `/${newPage.slug}`,
            target: '_self',
            is_active: true,
          });
        }
      }
      setIsModalOpen(false);
      fetchPages();
    } catch (err) {
      console.error('Failed to save page:', err);
      alert(err.response?.data?.message || 'Error saving page details.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this page?')) return;
    try {
      await api.delete(`/pages/${id}`);
      fetchPages();
    } catch (err) {
      console.error('Failed to delete page:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Pages Management</h1>
          <p className="text-sm text-slate-500">Create, publish, and link content pages across your site.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2 bg-indigo-600 text-white font-medium text-sm rounded-lg hover:bg-indigo-700 transition"
        >
          + Create Page
        </button>
      </div>

      {/* Pages Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-slate-400">Loading pages...</div>
        ) : pages.length === 0 ? (
          <div className="p-8 text-center text-slate-500">No pages found. Create one to get started!</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Slug / Path</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {pages.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30">
                  <td className="py-3 px-4 font-medium text-slate-900 dark:text-slate-100">{p.title}</td>
                  <td className="py-3 px-4 text-slate-500">
                    <a
                      href={`/${p.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      /{p.slug}
                    </a>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 text-xs rounded-full font-medium ${
                        p.status === 'published'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400'
                      }`}
                    >
                      {p.status || 'published'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-3">
                    <button
                      onClick={() => handleOpenModal(p)}
                      className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="text-red-500 hover:underline font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 dark:text-slate-100">
                {editingPage ? 'Edit Page' : 'Create Page'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Services"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                  Custom Slug (Optional)
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="e.g. services (leave blank to auto-generate)"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">HTML Content</label>
                <textarea
                  rows="6"
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="<h1>Our Services</h1><p>We provide full stack dynamic solution...</p>"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                ></textarea>
              </div>

              {!editingPage && (
                <div className="flex items-center space-x-2 pt-2">
                  <input
                    type="checkbox"
                    id="add_to_menu"
                    checked={formData.add_to_menu}
                    onChange={(e) => setFormData({ ...formData, add_to_menu: e.target.checked })}
                    className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                  />
                  <label htmlFor="add_to_menu" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Add link automatically to public navigation header
                  </label>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm font-medium"
                >
                  {editingPage ? 'Update Page' : 'Save & Publish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}