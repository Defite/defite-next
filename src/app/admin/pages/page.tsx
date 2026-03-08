'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { NextPageWithLayout } from '@/types/index';
import AdminLayout from '@/layouts/AdminLayout';

interface Page {
  slug: string;
  title: string;
  description?: string;
}

const AdminPages: NextPageWithLayout = () => {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const res = await fetch('/api/admin/pages');
      const data = await res.json();
      setPages(data.pages);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch pages');
      setLoading(false);
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm(`Are you sure you want to delete the page "${slug}"?`)) {
      return;
    }

    setDeleting(slug);
    try {
      const res = await fetch(`/api/admin/pages?slug=${encodeURIComponent(slug)}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete');
      }

      setPages(pages.filter((p) => p.slug !== slug));
    } catch (err) {
      alert('Failed to delete page');
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center py-12'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100'></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4'>
        <p className='text-red-800 dark:text-red-200'>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
          Manage Pages
        </h2>
        <Link
          href='/admin/pages/new'
          className='px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors'
        >
          New Page
        </Link>
      </div>

      <div className='bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden'>
        <table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
          <thead className='bg-gray-50 dark:bg-gray-700'>
            <tr>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                Title
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                Slug
              </th>
              <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className='bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700'>
            {pages.length === 0 ? (
              <tr>
                <td colSpan={3} className='px-6 py-8 text-center text-gray-500 dark:text-gray-400'>
                  No pages yet. Create your first page!
                </td>
              </tr>
            ) : (
              pages.map((page) => (
                <tr key={page.slug} className='hover:bg-gray-50 dark:hover:bg-gray-700'>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <Link
                      href={`/admin/pages/edit/${page.slug}`}
                      className='group'
                    >
                      <div className='text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors'>
                        {page.title}
                      </div>
                      {page.description && (
                        <div className='text-sm text-gray-500 dark:text-gray-400 truncate max-w-md'>
                          {page.description}
                        </div>
                      )}
                    </Link>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <code className='text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded'>
                      {page.slug}
                    </code>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                    <div className='flex items-center justify-end space-x-3'>
                      <Link
                        href={`/admin/pages/edit/${page.slug}`}
                        className='text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300'
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(page.slug)}
                        disabled={deleting === page.slug}
                        className='text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 disabled:opacity-50'
                      >
                        {deleting === page.slug ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

AdminPages.getLayout = function getLayout(page: React.ReactNode) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default AdminPages;
