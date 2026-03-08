import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const PAGES_PATH = path.join(process.cwd(), 'src', 'content', 'pages');

// GET /api/admin/pages/[slug] - Get single page for editing
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const filePath = path.join(PAGES_PATH, `${slug}.mdx`);

    // Check if file exists
    try {
      await fs.stat(filePath);
    } catch {
      return NextResponse.json(
        { error: 'Page not found' },
        { status: 404 }
      );
    }

    const source = await fs.readFile(filePath, 'utf-8');

    // Parse frontmatter and content
    const frontmatterMatch = source.match(/^---\n([\s\S]*?)\n---\n\n?([\s\S]*)$/);
    
    if (!frontmatterMatch) {
      return NextResponse.json(
        { error: 'Invalid page format' },
        { status: 500 }
      );
    }

    const frontmatterStr = frontmatterMatch[1];
    const content = frontmatterMatch[2] || '';

    // Parse frontmatter values
    const titleMatch = frontmatterStr.match(/^title:\s*(.+)$/m);
    const descriptionMatch = frontmatterStr.match(/^description:\s*(.+)$/m);

    if (!titleMatch) {
      return NextResponse.json(
        { error: 'Missing required frontmatter fields' },
        { status: 500 }
      );
    }

    const page = {
      slug,
      title: titleMatch[1].trim(),
      description: descriptionMatch ? descriptionMatch[1].trim() : '',
      content: content.trim(),
    };

    return NextResponse.json({ page });
  } catch (error) {
    console.error('Error fetching page:', error);
    return NextResponse.json(
      { error: 'Failed to fetch page' },
      { status: 500 }
    );
  }
}
