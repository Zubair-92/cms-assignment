// src/pages/DynamicPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';

export default function DynamicPage() {
  const { slug } = useParams();
  const activeSlug = slug || 'home'; // Defaults to 'home' if visiting root '/'

  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchPage = async () => {
      setLoading(true);
      setNotFound(false);
      try {
        const response = await api.get(`/pages/slug/${activeSlug}`);
        const payload = response.data;
        if (payload && payload.success && payload.data) {
          setPage(payload.data);
        } else {
          setNotFound(true);
        }
      } catch (err) {
        if (err.response?.status === 404) {
          setNotFound(true);
        } else {
          console.error('Error fetching page:', err);
          setNotFound(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [activeSlug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center text-slate-400">
        Loading content...
      </div>
    );
  }

  if (notFound || !page) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center space-y-4">
        <h1 className="text-4xl font-extrabold text-slate-800 dark:text-slate-100">404</h1>
        <p className="text-slate-500">The page you are looking for does not exist or has been moved.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-4">
        {page.title}
      </h1>
      <div 
        className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: page.content }}
      />
    </div>
  );
}