import { Hero } from '@/components/Hero';
import { PostsList } from '@/components/PostsList';
import { getBlogPosts } from '@/utils';

export default async function Home() {
  const posts = await getBlogPosts();

  return (
    <main className='wrapper mx-auto px-3 py-16 lg:px-0'>
      <Hero />
      <PostsList title='Recent posts' posts={posts} />
    </main>
  );
}
