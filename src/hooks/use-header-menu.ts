'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { routes } from '@/routes';

export const useHeaderMenu = (defaultItemIndex = 0) => {
  const pathname = usePathname();
  const menuIndex = routes.findIndex((route) =>
    route.href !== '/' ? pathname.includes(route.href) : route.href === pathname
  );
  const [activeIndex, setActiveIndex] = useState(
    menuIndex >= 0 ? menuIndex : defaultItemIndex
  );

  return {
    activeIndex,
    setActiveIndex,
  };
};
