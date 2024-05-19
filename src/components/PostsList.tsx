import Link from 'next/link';
import { FC } from 'react';
import styles from './styles.module.css';
import { Post } from '@/types';

type Props = {
  title: string;
  posts: Post[];
};

export const PostsList: FC<Props> = ({ title, posts }) => {
  return (
    <section className='flex flex-col gap-8'>
      <h2 className='color-primary'>{title}</h2>

      <ul>
        {posts.map((post, index) => (
          <li key={index}>
            <Link
              href={post.slug}
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
