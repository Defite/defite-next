import Link from 'next/link';
import { FC } from 'react';
import styles from './styles.module.css';

const postsMock = [
  {
    href: '/',
    title: 'Add https to your localhost',
    date: 'Sep 1, 2022',
  },
  {
    href: '/',
    title: 'Upgrading PS5 SSD storage',
    date: 'Jun 6, 2022',
  },
  {
    href: '/',
    title: 'Hello world',
    date: 'Jun 1, 2022',
  },
];

export const PostsList: FC = () => {
  return (
    <section className='flex flex-col gap-8'>
      <h2 className='color-primary'>Recent posts</h2>

      <ul>
        {postsMock.map((post, index) => (
          <li key={index}>
            <Link
              href={post.href}
              className='-mx-3 flex gap-9 rounded-md px-3 py-2 transition-colors duration-200 hover:bg-neutral-100 hover:dark:bg-neutral-800'
            >
              <span className='w-28'>{post.date}</span>
              <span className='color-primary'>{post.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};
