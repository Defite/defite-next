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
  const [activeIndex, setActiveIndex] = useState(
    items.map((item) => item.href).indexOf(pathname) || defaultItemIndex
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
