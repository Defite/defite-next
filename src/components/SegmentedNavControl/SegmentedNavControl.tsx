import cn from 'classnames';
import Link from 'next/link';
import { FC, useEffect, useRef, useState } from 'react';
import styles from './styles.module.css';

type Item = {
  text: string;
  href: string;
};

type Props = {
  defaultItemIndex?: number;
  items: Item[];
  pathname?: string;
};

export const SegmentedNavControl: FC<Props> = ({
  defaultItemIndex = 0,
  items,
  pathname = '/',
}) => {
  const [activeIndex, setActiveIndex] = useState(
    items.map((item) => item.href).indexOf(pathname) || defaultItemIndex
  );
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
    setActiveIndex(index);
  };

  return (
    <div ref={containerRef} className={styles.container}>
      <ul className={styles.controls}>
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
                className='relative z-10 inline-block rounded-full px-3 py-1 text-sm'
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
