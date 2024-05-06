'use client';

import React from 'react';
import { Logo } from '../Logo';
import { SegmentedNavControl } from '@/components/SegmentedNavControl';
import { useHeaderMenu } from './useHeaderMenu';
import { ThemeToggle } from '../ThemeToggle';

const items = [
  {
    text: 'Home',
    href: '/',
  },
  {
    text: 'Blog',
    href: '/blog',
  },
  {
    text: 'About',
    href: '/about',
  },
];

export const Header = () => {
  const { activeIndex, handleGoToHome, setActiveIndex } = useHeaderMenu({
    items,
  });

  return (
    <header className='wrapper mx-auto'>
      <div className='flex items-center justify-between py-5'>
        <Logo onClick={handleGoToHome} />
        <SegmentedNavControl
          items={items}
          activeIndex={activeIndex}
          onClick={setActiveIndex}
        />
        <ThemeToggle />
      </div>
    </header>
  );
};
