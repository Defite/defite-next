'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { routes } from '@/routes';

const getActiveIndex = (pathname: string, defaultItemIndex: number) => {
  const index = routes.findIndex((route) => {
    if (route.href === '/') {
      return pathname === route.href;
    }

    // Match the route itself and anything nested under it (`/blog/slug`),
    // without false positives like `/blogging` matching `/blog`.
    return pathname === route.href || pathname.startsWith(`${route.href}/`);
  });

  return index >= 0 ? index : defaultItemIndex;
};

export const useHeaderMenu = (defaultItemIndex = 0) => {
  const pathname = usePathname();
  // Highlight the clicked item instantly, then defer back to the URL once
  // navigation settles.
  const [clickedIndex, setClickedIndex] = useState<number | null>(null);

  useEffect(() => {
    setClickedIndex(null);
  }, [pathname]);

  const setActiveIndex = (index: number) => setClickedIndex(index);

  return {
    activeIndex: clickedIndex ?? getActiveIndex(pathname, defaultItemIndex),
    setActiveIndex,
  };
};
