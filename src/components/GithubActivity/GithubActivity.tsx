'use client';

import { useTheme } from 'next-themes';
import { GitHubCalendar } from 'react-github-calendar';

export const GithubActivity = () => {
  const { theme } = useTheme();

  return (
    <section className='flex flex-col gap-8'>
    <h2 className='color-primary'>My Github activity (not proud)</h2>
      <GitHubCalendar
        colorScheme={theme === 'dark' ? 'dark' : 'light'}
        username='Defite'
        loading={typeof window === 'undefined'}
      />
    </section>
  );
};
