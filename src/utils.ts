'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { compileMDX } from 'next-mdx-remote/rsc';
import { Page, Post } from './types';

const BLOG_POSTS_PATH = path.join(
  process.cwd(),
  'src',
  'content',
  'posts'
);

const BLOG_POST_IMAGES = path.join(process.cwd(), 'public', 'blog');
const BLOG_POST_IMAGE_PATH = path.join(process.cwd(), 'public');
const PAGES_PATH = path.join(process.cwd(), 'src', 'content', 'pages');

/** Read BLOG_POSTS_PATH dir and gets only mdx files */
function getMDXFiles(dir: string) {
  return fs
    .readdir(dir)
    .then((filenames) =>
      filenames.filter((file) => path.extname(file) === '.mdx')
    );
}

function getPostImages(slug: string) {
  return fs
    .readdir(path.join(BLOG_POST_IMAGES, slug))
    .then((filenames) =>
      filenames.filter((file) => path.extname(file) === '.avif')
    );
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

    const { title, date } = frontmatter;
    const formattedDate = await getDateFormat(date);

    return {
      slug: postPath.replace('.mdx', ''),
      title,
      date: formattedDate,
    };
  });

  return Promise.all(posts);
}

export async function getSingleBlogPost(slug: string) {
  const postsPaths = await getMDXFiles(BLOG_POSTS_PATH);
  const postImages = await getPostImages(slug);
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
  });

  const { title, date } = frontmatter;
  const formattedDate = await getDateFormat(date);

  return {
    title,
    date: formattedDate,
    content,
    introImage: introImagePath,
  };
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

/** Creates base64 blurred image from source */
export async function getBlurredImage(src?: string) {
  if (!src) {
    return;
  }

  const buffer = await fs.readFile(path.join(BLOG_POST_IMAGE_PATH, src));
}
