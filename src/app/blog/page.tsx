import { PostsList } from '@/components/PostsList';
import { getBlogPosts } from '@/utils';

export default async function Blog() {
  const posts = await getBlogPosts();

  return (
    <main className='wrapper mx-auto'>
      <h1>/blog</h1>
      <PostsList posts={posts} />
    </main>
  );
}
