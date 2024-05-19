import { promises as fs } from 'fs';
import path from 'path';
import { compileMDX } from 'next-mdx-remote/rsc';
import { Page, Post } from './types';

export const BLOG_POSTS_PATH = path.join(
  process.cwd(),
  'src',
  'content',
  'posts'
);

export const BLOG_POST_IMAGES = path.join(process.cwd(), 'public', 'blog');

export const PAGES_PATH = path.join(process.cwd(), 'src', 'content', 'pages');

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

    return {
      slug: '/blog/' + postPath.replace('.mdx', ''),
      title,
      date: getDateFormat(date),
    };
  });

  return Promise.all(posts);
}

export async function getSingleBlogPost(slug: string) {
  const postsPaths = await getMDXFiles(BLOG_POSTS_PATH);
  const postImages = await getPostImages(slug);
  let introImage = postImages.find((filename) => filename === 'intro.avif');
  introImage = introImage ? `/blog/${slug}/${introImage}` : undefined;

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

  return {
    title,
    date: getDateFormat(date),
    content,
    introImage,
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
export function getDateFormat(dateStr: string) {
  const date = new Date(dateStr);
  const options = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  } as const;
  return date.toLocaleDateString('en-GB', options);
}
