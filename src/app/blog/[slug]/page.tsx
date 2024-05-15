import { getBlogPost, getBlogPosts } from '@/utils';
import { MDXRemote, compileMDX } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';

export default async function Post({ params }) {
  const post = await getBlogPost(params.slug);

  if (!post) {
    // Тут нужно показывать 404 ошибку
    notFound();
  }

  const { content, frontmatter } = await compileMDX<{ title: string }>({
    source: post,
    options: { parseFrontmatter: true },
  });

  return (
    <main className='wrapper mx-auto'>
      <h1>{frontmatter.title}</h1>
      {content}
    </main>
  );
}
