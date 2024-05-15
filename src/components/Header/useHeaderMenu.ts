'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';

type Item = {
  text: string;
  href: string;
};

type Props = {
  items: Item[];
  defaultItemIndex?: number;
};

export function useHeaderMenu({ items, defaultItemIndex = 0 }: Props) {
  const pathname = usePathname();
  const menuIndex = items.findIndex(
    (item) => item.href !== '/' && pathname.includes(item.href)
  );
  const [activeIndex, setActiveIndex] = useState(
    menuIndex >= 0 ? menuIndex : defaultItemIndex
  );

  const handleGoToHome = () => {
    setActiveIndex(0);
  };

  return {
    activeIndex,
    setActiveIndex,
    handleGoToHome,
  };
}
