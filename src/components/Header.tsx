'use client';

import React from 'react';
import { Logo } from './Logo';
import { SegmentedNavControl } from '@/components/SegmentedNavControl';
import { useHeaderMenu } from '../hooks/use-header-menu';
import { ThemeToggle } from './ThemeToggle';
import { routes } from '@/routes';

export const Header = () => {
  const { activeIndex, setActiveIndex } = useHeaderMenu();

  return (
    <header className='wrapper mx-auto'>
      <div className='flex items-center justify-between px-3 py-5 lg:px-0'>
        <Logo />
        <SegmentedNavControl
          items={routes}
          activeIndex={activeIndex}
          onClick={setActiveIndex}
        />
        <ThemeToggle />
      </div>
    </header>
  );
};
