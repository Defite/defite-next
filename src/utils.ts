import fs from 'node:fs/promises';
import path from 'path';
import { compile } from '@mdx-js/mdx';

type Metadata = {
  title: string;
  publishedAt: string;
  summary: string;
  image?: string;
};

function getMDXFiles(dir: string) {
  return fs
    .readdir(dir)
    .then((filenames) =>
      filenames.filter((file) => path.extname(file) === '.mdx')
    );
}

async function readMDXFile(filePath: string) {
  const value = await fs.readFile(filePath, 'utf-8');

  return value;
}

async function getMDXData(dir: string, slug?: string) {
  // Array of filenames - ['foo-bar.mdx', 'hello-world.mdx']
  const mdxFiles = await getMDXFiles(dir);

  if (!slug) {
    const filePromises = mdxFiles.map(
      async (file) => await readMDXFile(path.join(dir, file))
    );

    return Promise.all(filePromises);
  } else {
    const post = mdxFiles.find((elem) => elem.split('.')[0] === slug);
    if (post) {
      return readMDXFile(path.join(dir, post));
    }
  }
}

export async function getBlogPost(slug: string) {
  return await getMDXData(
    path.join(process.cwd(), 'src', 'content', 'posts'),
    slug
  );
}

export async function getBlogPosts() {
  return await getMDXData(path.join(process.cwd(), 'src', 'content', 'posts'));
}

export function formatDate(date: string, includeRelative = false) {
  let currentDate = new Date();
  if (!date.includes('T')) {
    date = `${date}T00:00:00`;
  }
  let targetDate = new Date(date);

  let yearsAgo = currentDate.getFullYear() - targetDate.getFullYear();
  let monthsAgo = currentDate.getMonth() - targetDate.getMonth();
  let daysAgo = currentDate.getDate() - targetDate.getDate();

  let formattedDate = '';

  if (yearsAgo > 0) {
    formattedDate = `${yearsAgo}y ago`;
  } else if (monthsAgo > 0) {
    formattedDate = `${monthsAgo}mo ago`;
  } else if (daysAgo > 0) {
    formattedDate = `${daysAgo}d ago`;
  } else {
    formattedDate = 'Today';
  }

  let fullDate = targetDate.toLocaleString('en-us', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  if (!includeRelative) {
    return fullDate;
  }

  return `${fullDate} (${formattedDate})`;
}
