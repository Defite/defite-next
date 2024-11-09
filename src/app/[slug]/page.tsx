import { Page } from '@/types';
import { getPage } from '@/utils';
import { notFound } from 'next/navigation';

type Props = {
  params: Page;
};

export default async function GenericPage(props: Props) {
  const params = await props.params;
  const page = await getPage(params.slug);

  if (!page) {
    notFound();
  }

  const { title, content } = page;

  return (
    <main className='wrapper mx-auto px-2 pt-16 lg:px-0'>
      <h1 className='color-primary'>{title}</h1>
      {content}
    </main>
  );
}
