import { getSingleBlogPost } from '@/utils';
import { notFound } from 'next/navigation';

type Props = {
  params: {
    slug: string;
  };
};

export default async function Post({ params }: Props) {
  const post = await getSingleBlogPost(params.slug);

  if (!post) {
    notFound();
  }

  const { title, date, content } = post;

  return (
    <main className='wrapper mx-auto'>
      <h1>{title}</h1>
      {content}
    </main>
  );
}
