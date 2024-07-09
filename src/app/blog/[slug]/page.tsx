import { getBlogPosts, getSingleBlogPost } from '@/utils';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getPlaceholderImage } from '@/image';

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

  const { title, description, date, content, introImage = '' } = post;
  const imageWithPlaceholder = await getPlaceholderImage(introImage);

  return (
    <main className='wrapper mx-auto px-2 py-16 lg:px-0'>
      <article className='text-neutral-700 dark:text-neutral-300'>
        {introImage && (
          <Image
            src={imageWithPlaceholder.src}
            width={768}
            height={384}
            alt={title}
            className='mx-auto mb-8 h-full max-w-full rounded-xl object-cover lg:-ml-4 lg:w-[calc(100%+32px)] lg:max-w-none'
            sizes='(max-width: 768px) 70vw, 50vw'
            placeholder='blur'
            blurDataURL={imageWithPlaceholder.placeholder}
            priority
          />
        )}
        <div className='mb-8 flex flex-col gap-3'>
          <div>
            <h1 className='text-2xl font-semibold'>{title}</h1>
            {description ? (
              <p className='text-lg text-foreground'>{description}</p>
            ) : null}
          </div>
          <p className='font-normal text-foreground'>{date}</p>
        </div>
        <div className='prose prose-base dark:prose-dark prose-h2:mb-2 prose-h2:text-lg prose-h2:font-semibold prose-p:font-normal'>
          {content}
        </div>
      </article>
    </main>
  );
}

export async function generateStaticParams() {
  const posts = await getBlogPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}
