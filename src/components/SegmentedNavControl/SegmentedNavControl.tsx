'use client';

import cn from 'classnames';
import Link from 'next/link';
import { FC, useEffect, useRef, useState } from 'react';
import styles from './styles.module.css';

type Item = {
  text: string;
  href: string;
};

type Props = {
  activeIndex: number;
  items: Item[];
  onClick?: (index: number) => void;
};

export const SegmentedNavControl: FC<Props> = ({
  activeIndex,
  items,
  onClick,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef(new Map());

  useEffect(() => {
    if (containerRef.current && itemsRef.current) {
      const activeSegmentRef = itemsRef.current.get(activeIndex);
      const { offsetWidth, offsetLeft } = activeSegmentRef;
      const { style } = containerRef.current;
      style.setProperty('--highlight-width', `${offsetWidth}px`);
      style.setProperty('--highlight-x-pos', `${offsetLeft}px`);
    }
  }, [activeIndex, containerRef, items]);

  const handleClick = (index: number) => {
    onClick?.(index);
  };

  return (
    <div ref={containerRef} className={styles.container}>
      <ul className={cn(styles.controls, 'dark:bg-zinc-800')}>
        {items.map((item, index) => {
          return (
            <li
              key={index}
              ref={(node) => {
                if (node) {
                  itemsRef.current?.set(index, node);
                } else {
                  itemsRef.current.delete(index);
                }
              }}
            >
              <Link
                className={cn(styles.link, {
                  [styles.activeLink]: activeIndex === index,
                  'hover:text-neutral-900 dark:hover:text-neutral-100':
                    activeIndex !== index,
                })}
                href={item.href}
                onClick={() => handleClick(index)}
              >
                {item.text}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
