import { Page } from '@/types';
import { getPage, getSingleBlogPost } from '@/utils';
import { notFound } from 'next/navigation';

type Props = {
  params: Page;
};

export default async function GenericPage({ params }: Props) {
  const page = await getPage(params.slug);

  if (!page) {
    notFound();
  }

  const { title, content, description } = page;

  return (
    <main className='wrapper mx-auto pt-16'>
      <h1 className='color-primary'>{title}</h1>
      {content}
    </main>
  );
}
