import { Hero } from '@/components/Hero';
import { PostsList } from '@/components/PostsList';

export default function Home() {
  return (
    <main className='wrapper mx-auto flex flex-col gap-20'>
      <Hero />
      <PostsList />
    </main>
  );
}
