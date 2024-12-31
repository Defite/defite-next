'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { compileMDX } from 'next-mdx-remote/rsc';
import { Page, Post } from './types';
import { MdxImage } from './components/MdxImage';
import { MdxYoutube } from './components/MdxYoutube';

const BLOG_POSTS_PATH = path.join(process.cwd(), 'src', 'content', 'posts');

const BLOG_POST_IMAGES = path.join(process.cwd(), 'public', 'blog');
const PAGES_PATH = path.join(process.cwd(), 'src', 'content', 'pages');

/** Read BLOG_POSTS_PATH dir and gets only mdx files */
function getMDXFiles(dir: string) {
  return fs
    .readdir(dir)
    .then((filenames) =>
      filenames.filter((file) => path.extname(file) === '.mdx')
    );
}

async function getPostImages(slug: string, skipWarning?: boolean) {
  const dir = path.join(BLOG_POST_IMAGES, slug);

  try {
    await fs.stat(dir);

    return fs
      .readdir(dir)
      .then((filenames) =>
        filenames.filter((file) => path.extname(file) === '.avif')
      );
  } catch (error) {
    // There's no intro image, is it supposed to be so?
    if (!skipWarning) {
      /* eslint-disable-next-line no-console */
      console.warn(
        `Can\'t find intro image in ${dir}. JFYI, nothing to worry about.`
      );
    }

    return [];
  }
}

/** Returns array with blog posts info for the post list*/
export async function getBlogPosts() {
  const postsPaths = await getMDXFiles(BLOG_POSTS_PATH);

  const posts = postsPaths.map(async (postPath) => {
    const source = await fs.readFile(path.join(BLOG_POSTS_PATH, postPath));
    const { frontmatter } = await compileMDX<Post>({
      source,
      options: { parseFrontmatter: true },
    });

    const { title, date, description } = frontmatter;
    const formattedDate = await getDateFormat(date);

    return {
      slug: postPath.replace('.mdx', ''),
      title,
      description,
      date: formattedDate,
      createdDate: +new Date(date),
    };
  });

  const data = await Promise.all(posts);

  return data.sort((a, b) => b.createdDate - a.createdDate);
}

export async function getSingleBlogPost(slug: string) {
  const postsPaths = await getMDXFiles(BLOG_POSTS_PATH);
  const postImages = await getPostImages(slug, true);
  let introImage = postImages.find((filename) => filename === 'intro.avif');
  let introImagePath = introImage ? `/blog/${slug}/${introImage}` : undefined;

  const postPath = postsPaths.find(
    (postPath) => postPath.replace('.mdx', '') === slug
  );

  if (!postPath) {
    return;
  }

  const source = await fs.readFile(path.join(BLOG_POSTS_PATH, postPath));

  const { content, frontmatter } = await compileMDX<Post>({
    source,
    options: { parseFrontmatter: true },
    components: { MdxImage, MdxYoutube },
  });

  const { title, date, description } = frontmatter;
  const formattedDate = await getDateFormat(date);

  return {
    title,
    description,
    date: formattedDate,
    content,
    introImage: introImagePath,
  };
}

export async function getPagesSlugs() {
  const pagesPaths = await getMDXFiles(PAGES_PATH);

  return pagesPaths.map((pagePath) => {
    return {
      slug: pagePath.replace('.mdx', '')
    }
  })
 }

export async function getPage(slug: string) {
  const pagesPaths = await getMDXFiles(PAGES_PATH);
  const pagePath = pagesPaths.find(
    (pagePath) => pagePath.replace('.mdx', '') === slug
  );

  if (!pagePath) {
    return;
  }

  const source = await fs.readFile(path.join(PAGES_PATH, pagePath));

  const { content, frontmatter } = await compileMDX<Page>({
    source,
    options: { parseFrontmatter: true },
  });

  const { title, description } = frontmatter;

  return {
    title,
    description,
    content,
  };
}

/** Formats date from YYYY-MM-DD to 01 Jan 2024 */
export async function getDateFormat(dateStr: string) {
  const date = new Date(dateStr);
  const options = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  } as const;
  return date.toLocaleDateString('en-GB', options);
}
