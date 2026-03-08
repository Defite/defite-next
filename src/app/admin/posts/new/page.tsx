'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';

interface PostForm {
  slug: string;
  title: string;
  date: string;
  description: string;
  content: string;
}

export default function NewPost() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState<PostForm>({
    slug: '',
    title: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    content: '',
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      try {
        const res = await fetch('/api/admin/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Failed to create post');
        }

        router.push('/admin/posts');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to create post');
      }
    });
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Convert to URL-friendly slug
    const slug = e.target.value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    setFormData({ ...formData, slug });
  };

  return (
    <div className='max-w-4xl mx-auto space-y-6'>
      <div className='flex items-center justify-between'>
        <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
          New Post
        </h2>
      </div>

      {error && (
        <div className='bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4'>
          <p className='text-red-800 dark:text-red-200'>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className='space-y-6'>
        <div className='bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2'>
            Frontmatter
          </h3>

          <div>
            <label
              htmlFor='title'
              className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
            >
              Title *
            </label>
            <input
              type='text'
              id='title'
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-gray-500 focus:border-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
              placeholder='Post title'
            />
          </div>

          <div>
            <label
              htmlFor='slug'
              className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
            >
              Slug *
            </label>
            <input
              type='text'
              id='slug'
              required
              value={formData.slug}
              onChange={handleSlugChange}
              className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-gray-500 focus:border-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
              placeholder='post-slug'
            />
            <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
              Auto-generated from title. Will be used as the URL.
            </p>
          </div>

          <div>
            <label
              htmlFor='date'
              className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
            >
              Date *
            </label>
            <input
              type='date'
              id='date'
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-gray-500 focus:border-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
            />
          </div>

          <div>
            <label
              htmlFor='description'
              className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
            >
              Description
            </label>
            <textarea
              id='description'
              rows={2}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-gray-500 focus:border-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
              placeholder='Short description (optional)'
            />
          </div>
        </div>

        <div className='bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2'>
            Content (MDX)
          </h3>

          <div>
            <label
              htmlFor='content'
              className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
            >
              Body
            </label>
            <textarea
              id='content'
              rows={20}
              required
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-gray-500 focus:border-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm'
              placeholder='Write your post content in MDX format...'
            />
            <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
              Supports MDX syntax (Markdown + JSX components)
            </p>
          </div>
        </div>

        <div className='flex items-center justify-end space-x-4'>
          <button
            type='button'
            onClick={() => router.back()}
            className='px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors'
          >
            Cancel
          </button>
          <button
            type='submit'
            disabled={isPending}
            className='px-6 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:opacity-50'
          >
            {isPending ? 'Creating...' : 'Create Post'}
          </button>
        </div>
      </form>
    </div>
  );
}
