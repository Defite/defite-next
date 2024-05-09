import Link from 'next/link';
import { FC } from 'react';

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
          <li className='flex gap-9 py-2' key={index}>
            <span>{post.date}</span>
            <Link href={post.href} className='color-primary'>
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};
