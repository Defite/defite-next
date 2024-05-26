import { PostsList } from '@/components/PostsList';
import { getBlogPosts } from '@/utils';

export default async function Blog() {
  const posts = await getBlogPosts();

  return (
    <main className='wrapper mx-auto px-2 pt-16 lg:px-0'>
      <PostsList title='/blog' posts={posts} />
    </main>
  );
}
