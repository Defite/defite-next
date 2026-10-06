import { getBlogPosts, getSingleBlogPost } from '@/utils';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getPlaceholderImage } from '@/image';

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

type PostHeaderProps = {
  title: string;
  description?: string;
  date: string;
  dateISO: string;
  readingTime: number;
  /** Renders on top of the cover image, so type has to stay light-on-dark. */
  overlay?: boolean;
};

function PostHeader({
  title,
  description,
  date,
  dateISO,
  readingTime,
  overlay = false,
}: PostHeaderProps) {
  return (
    <header className={overlay ? undefined : 'mb-10'}>
      <div
        className={`mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold tracking-[0.16em] uppercase ${
          overlay
            ? 'text-white/70'
            : 'text-neutral-500 dark:text-neutral-400'
        }`}
      >
        <span
          className={`size-1.5 rounded-full ${
            overlay ? 'bg-orange-400' : 'bg-orange-600 dark:bg-orange-400'
          }`}
        />
        <time dateTime={dateISO}>{date}</time>
        {readingTime ? (
          <>
            <span aria-hidden='true'>/</span>
            <span>{readingTime} min read</span>
          </>
        ) : null}
      </div>

      <h1
        className={`font-bold text-3xl leading-[1.05] tracking-tight text-balance sm:text-4xl lg:text-5xl ${
          overlay ? 'text-white' : 'text-neutral-900 dark:text-neutral-100'
        }`}
      >
        {title}
      </h1>

      {description ? (
        <p
          className={`mt-4 max-w-2xl text-lg/7 ${
            overlay ? 'text-white/80' : 'text-neutral-600 dark:text-neutral-400'
          }`}
        >
          {description}
        </p>
      ) : null}
    </header>
  );
}

export default async function Post(props: Props) {
  const params = await props.params;
  const post = await getSingleBlogPost(params.slug);

  if (!post) {
    notFound();
  }

  const {
    title,
    description,
    date,
    dateISO,
    readingTime,
    content,
    introImage = '',
  } = post;
  const imageWithPlaceholder = await getPlaceholderImage(introImage);

  return (
    <main
      className={`wrapper mx-auto px-3 lg:px-0 ${
        introImage ? 'pt-8 pb-16' : 'py-16'
      }`}
    >
      <article className='text-neutral-700 dark:text-neutral-300'>
        {introImage ? (
          <section className='relative isolate mb-10 flex min-h-[22rem] flex-col justify-end overflow-hidden rounded-2xl sm:min-h-[26rem]'>
            <Image
              src={imageWithPlaceholder.src}
              alt={title}
              fill
              className='object-cover'
              sizes='(max-width: 850px) 100vw, 850px'
              placeholder='blur'
              blurDataURL={imageWithPlaceholder.placeholder}
              priority
            />
            <div className='absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/10' />
            <div className='relative p-6 sm:p-10'>
              <PostHeader
                title={title}
                description={description}
                date={date}
                dateISO={dateISO}
                readingTime={readingTime}
                overlay
              />
            </div>
          </section>
        ) : (
          <PostHeader
            title={title}
            description={description}
            date={date}
            dateISO={dateISO}
            readingTime={readingTime}
          />
        )}
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
