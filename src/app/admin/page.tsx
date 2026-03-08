'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { NextPageWithLayout } from '@/types/index';
import AdminLayout from '@/layouts/AdminLayout';

interface Post {
  slug: string;
  title: string;
  date: string;
  description?: string;
}

interface Page {
  slug: string;
  title: string;
  description?: string;
}

interface DashboardData {
  posts: Post[];
  pages: Page[];
}

const AdminDashboard: NextPageWithLayout = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((res) => res.json())
      .then((result) => {
        setData(result);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

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
    <div className='space-y-8'>
      <div className='flex items-center justify-between'>
        <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
          Dashboard
        </h2>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Posts Card */}
        <div className='bg-white dark:bg-gray-800 rounded-lg shadow p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-gray-600 dark:text-gray-400'>
                Total Posts
              </p>
              <p className='text-3xl font-bold text-gray-900 dark:text-white mt-1'>
                {data?.posts.length || 0}
              </p>
            </div>
            <Link
              href='/admin/posts'
              className='px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors'
            >
              Manage Posts
            </Link>
          </div>
        </div>

        {/* Pages Card */}
        <div className='bg-white dark:bg-gray-800 rounded-lg shadow p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-gray-600 dark:text-gray-400'>
                Total Pages
              </p>
              <p className='text-3xl font-bold text-gray-900 dark:text-white mt-1'>
                {data?.pages.length || 0}
              </p>
            </div>
            <Link
              href='/admin/pages'
              className='px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors'
            >
              Manage Pages
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Posts */}
      {data?.posts && data.posts.length > 0 && (
        <div className='bg-white dark:bg-gray-800 rounded-lg shadow'>
          <div className='px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between'>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
              Recent Posts
            </h3>
            <Link
              href='/admin/posts'
              className='text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300'
            >
              View all →
            </Link>
          </div>
          <div className='divide-y divide-gray-200 dark:divide-gray-700'>
            {data.posts.slice(0, 5).map((post) => (
              <Link
                key={post.slug}
                href={`/admin/posts/edit/${post.slug}`}
                className='block px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'
              >
                <div className='flex items-center justify-between'>
                  <div>
                    <h4 className='font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors'>
                      {post.title}
                    </h4>
                    {post.description && (
                      <p className='text-sm text-gray-600 dark:text-gray-400 mt-1'>
                        {post.description}
                      </p>
                    )}
                  </div>
                  <span className='text-sm text-gray-500 dark:text-gray-400'>
                    {post.date}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Recent Pages */}
      {data?.pages && data.pages.length > 0 && (
        <div className='bg-white dark:bg-gray-800 rounded-lg shadow'>
          <div className='px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between'>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
              Pages
            </h3>
            <Link
              href='/admin/pages'
              className='text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300'
            >
              View all →
            </Link>
          </div>
          <div className='divide-y divide-gray-200 dark:divide-gray-700'>
            {data.pages.map((page) => (
              <Link
                key={page.slug}
                href={`/admin/pages/edit/${page.slug}`}
                className='block px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'
              >
                <div className='flex items-center justify-between'>
                  <div>
                    <h4 className='font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors'>
                      {page.title}
                    </h4>
                    {page.description && (
                      <p className='text-sm text-gray-600 dark:text-gray-400 mt-1'>
                        {page.description}
                      </p>
                    )}
                  </div>
                  <code className='text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded'>
                    {page.slug}
                  </code>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

AdminDashboard.getLayout = function getLayout(page: React.ReactNode) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default AdminDashboard;