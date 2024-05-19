import { getSingleBlogPost } from '@/utils';
import { notFound } from 'next/navigation';
import Image from 'next/image';

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

  const { title, date, content, introImage } = post;

  return (
    <main className='wrapper mx-auto py-16'>
      <article className='text-neutral-700 dark:text-neutral-300'>
        {introImage && (
          <Image
            src={introImage}
            width={768}
            height={384}
            alt={title}
            className='-ml-4 mb-8 w-[calc(100%+32px)] max-w-none rounded-xl object-cover'
            style={{
              height: '350px',
            }}
          />
        )}
        <div className='mb-8 flex flex-col gap-3'>
          <h1 className='text-2xl font-semibold'>{title}</h1>
          <p className='font-normal text-foreground'>{date}</p>
        </div>
        <div className='prose prose-base dark:prose-dark prose-h2:text-lg prose-h2:mb-2 prose-h2:font-semibold prose-p:font-normal'>
          {content}
        </div>
      </article>
    </main>
  );
}
