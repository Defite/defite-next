import { PostsList } from '@/components/PostsList';
import { getBlogPosts } from '@/utils';

export default function Blog() {
  const posts = getBlogPosts();

  return (
    <main className='wrapper mx-auto'>
      <h1>/blog</h1>
      <PostsList />
    </main>
  );
}
