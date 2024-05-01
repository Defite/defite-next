'use client';

import { FC } from 'react';
import { usePathname } from 'next/navigation';
import { SegmentedNavControl } from './SegmentedNavControl/SegmentedNavControl';

const menu = [
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

export const NavMenu: FC = () => {
  const pathname = usePathname();

  return <SegmentedNavControl pathname={pathname} items={menu} />;
};
