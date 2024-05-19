'use client';

import { useEffect, useState } from 'react';
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

  useEffect(() => {
    menuIndex >= 0 && setActiveIndex(menuIndex);
  }, [menuIndex]);

  return {
    activeIndex,
    setActiveIndex,
  };
};
