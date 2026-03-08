import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { compileMDX } from 'next-mdx-remote/rsc';

const PAGES_PATH = path.join(process.cwd(), 'src', 'content', 'pages');

interface PageFrontmatter {
  title: string;
  description?: string;
}

// GET /api/admin/pages - List all pages
export async function GET() {
  try {
    const filenames = await fs.readdir(PAGES_PATH);
    const mdxFiles = filenames.filter((file) => path.extname(file) === '.mdx');

    const pages = await Promise.all(
      mdxFiles.map(async (file) => {
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

    return NextResponse.json({ pages });
  } catch (error) {
    console.error('Error fetching pages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pages' },
      { status: 500 }
    );
  }
}

// POST /api/admin/pages - Create new page
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, title, description, content } = body;

    if (!slug || !title) {
      return NextResponse.json(
        { error: 'Slug and title are required' },
        { status: 400 }
      );
    }

    const filePath = path.join(PAGES_PATH, `${slug}.mdx`);

    // Check if file already exists
    try {
      await fs.stat(filePath);
      return NextResponse.json(
        { error: 'Page with this slug already exists' },
        { status: 409 }
      );
    } catch {
      // File doesn't exist, continue
    }

    // Build frontmatter
    let frontmatter = `---\ntitle: ${title}`;
    if (description) {
      frontmatter += `\ndescription: ${description}`;
    }
    frontmatter += '\n---\n\n';

    const fullContent = frontmatter + content;

    await fs.writeFile(filePath, fullContent, 'utf-8');

    return NextResponse.json({
      success: true,
      slug,
      message: 'Page created successfully',
    });
  } catch (error) {
    console.error('Error creating page:', error);
    return NextResponse.json(
      { error: 'Failed to create page' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/pages - Update existing page
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, title, description, content } = body;

    if (!slug || !title) {
      return NextResponse.json(
        { error: 'Slug and title are required' },
        { status: 400 }
      );
    }

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

    // Build frontmatter
    let frontmatter = `---\ntitle: ${title}`;
    if (description) {
      frontmatter += `\ndescription: ${description}`;
    }
    frontmatter += '\n---\n\n';

    const fullContent = frontmatter + content;

    await fs.writeFile(filePath, fullContent, 'utf-8');

    return NextResponse.json({
      success: true,
      slug,
      message: 'Page updated successfully',
    });
  } catch (error) {
    console.error('Error updating page:', error);
    return NextResponse.json(
      { error: 'Failed to update page' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/pages - Delete page
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug is required' },
        { status: 400 }
      );
    }

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

    await fs.unlink(filePath);

    return NextResponse.json({
      success: true,
      message: 'Page deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting page:', error);
    return NextResponse.json(
      { error: 'Failed to delete page' },
      { status: 500 }
    );
  }
}
