'use client';

import { useTheme } from 'next-themes';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Dynamically import the component with SSR disabled
const GitHubCalendar = dynamic(
  () => import('react-github-calendar').then((mod) => mod.GitHubCalendar),
  {
    ssr: false,
  }
);

export const GithubActivity = () => {
  const { resolvedTheme } = useTheme();

  const colorScheme = resolvedTheme === 'dark' ? 'dark' : 'light';

  return (
    <section className='flex flex-col gap-8'>
      <h2 className='color-primary'>My Github activity</h2>
      <Suspense fallback={'Loading...'}>
        <GitHubCalendar colorScheme={colorScheme} username='Defite' />
      </Suspense>
    </section>
  );
};
