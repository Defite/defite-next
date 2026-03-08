import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const BLOG_POSTS_PATH = path.join(process.cwd(), 'src', 'content', 'posts');

// GET /api/admin/posts/[slug] - Get single post for editing
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const filePath = path.join(BLOG_POSTS_PATH, `${slug}.mdx`);

    // Check if file exists
    try {
      await fs.stat(filePath);
    } catch {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    const source = await fs.readFile(filePath, 'utf-8');

    // Parse frontmatter and content
    const frontmatterMatch = source.match(/^---\n([\s\S]*?)\n---\n\n?([\s\S]*)$/);
    
    if (!frontmatterMatch) {
      return NextResponse.json(
        { error: 'Invalid post format' },
        { status: 500 }
      );
    }

    const frontmatterStr = frontmatterMatch[1];
    const content = frontmatterMatch[2] || '';

    // Parse frontmatter values
    const titleMatch = frontmatterStr.match(/^title:\s*(.+)$/m);
    const dateMatch = frontmatterStr.match(/^date:\s*['"]?(.+?)['"]?$/m);
    const descriptionMatch = frontmatterStr.match(/^description:\s*(.+)$/m);

    if (!titleMatch || !dateMatch) {
      return NextResponse.json(
        { error: 'Missing required frontmatter fields' },
        { status: 500 }
      );
    }

    const post = {
      slug,
      title: titleMatch[1].trim(),
      date: dateMatch[1].trim().replace(/['"]/g, ''),
      description: descriptionMatch ? descriptionMatch[1].trim() : '',
      content: content.trim(),
    };

    return NextResponse.json({ post });
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}
