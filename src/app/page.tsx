import { Hero } from '@/components/Hero';
import { PostsList } from '@/components/PostsList';
import { getBlogPosts } from '@/utils';

export default async function Home() {
  const posts = await getBlogPosts();

  return (
    <main className='wrapper mx-auto flex flex-col gap-20 px-2 pt-16 lg:px-0'>
      <Hero />
      <PostsList title='Recent posts' posts={posts} />
    </main>
  );
}
