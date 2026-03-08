import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { compileMDX } from 'next-mdx-remote/rsc';

const BLOG_POSTS_PATH = path.join(process.cwd(), 'src', 'content', 'posts');
const PAGES_PATH = path.join(process.cwd(), 'src', 'content', 'pages');

interface PostFrontmatter {
  title: string;
  date: string;
  description?: string;
}

interface PageFrontmatter {
  title: string;
  description?: string;
}

export async function GET() {
  try {
    // Fetch posts
    const postFilenames = await fs.readdir(BLOG_POSTS_PATH);
    const postMdxFiles = postFilenames.filter((file) => path.extname(file) === '.mdx');

    const posts = await Promise.all(
      postMdxFiles.map(async (file) => {
        const filePath = path.join(BLOG_POSTS_PATH, file);
        const source = await fs.readFile(filePath, 'utf-8');
        const { frontmatter } = await compileMDX<PostFrontmatter>({
          source,
          options: { parseFrontmatter: true },
        });

        return {
          slug: file.replace('.mdx', ''),
          title: frontmatter.title,
          date: frontmatter.date,
          description: frontmatter.description,
        };
      })
    );

    posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Fetch pages
    const pageFilenames = await fs.readdir(PAGES_PATH);
    const pageMdxFiles = pageFilenames.filter((file) => path.extname(file) === '.mdx');

    const pages = await Promise.all(
      pageMdxFiles.map(async (file) => {
        const filePath = path.join(PAGES_PATH, file);
        const source = await fs.readFile(filePath, 'utf-8');
        const { frontmatter } = await compileMDX<PageFrontmatter>({
          source,
          options: { parseFrontmatter: true },
        });

        return {
          slug: file.replace('.mdx', ''),
          title: frontmatter.title,
          description: frontmatter.description,
        };
      })
    );

    return NextResponse.json({ posts, pages });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
