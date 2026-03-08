import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { compileMDX } from 'next-mdx-remote/rsc';

const BLOG_POSTS_PATH = path.join(process.cwd(), 'src', 'content', 'posts');

interface PostFrontmatter {
  title: string;
  date: string;
  description?: string;
}

// GET /api/admin/posts - List all posts
export async function GET() {
  try {
    const filenames = await fs.readdir(BLOG_POSTS_PATH);
    const mdxFiles = filenames.filter((file) => path.extname(file) === '.mdx');

    const posts = await Promise.all(
      mdxFiles.map(async (file) => {
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

    // Sort by date descending
    posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

// POST /api/admin/posts - Create new post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, title, date, description, content } = body;

    if (!slug || !title || !date) {
      return NextResponse.json(
        { error: 'Slug, title, and date are required' },
        { status: 400 }
      );
    }

    const filePath = path.join(BLOG_POSTS_PATH, `${slug}.mdx`);

    // Check if file already exists
    try {
      await fs.stat(filePath);
      return NextResponse.json(
        { error: 'Post with this slug already exists' },
        { status: 409 }
      );
    } catch {
      // File doesn't exist, continue
    }

    // Build frontmatter
    let frontmatter = `---\ntitle: ${title}\ndate: '${date}'`;
    if (description) {
      frontmatter += `\ndescription: ${description}`;
    }
    frontmatter += '\n---\n\n';

    const fullContent = frontmatter + content;

    await fs.writeFile(filePath, fullContent, 'utf-8');

    return NextResponse.json({
      success: true,
      slug,
      message: 'Post created successfully',
    });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/posts - Update existing post
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, title, date, description, content } = body;

    if (!slug || !title || !date) {
      return NextResponse.json(
        { error: 'Slug, title, and date are required' },
        { status: 400 }
      );
    }

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

    // Build frontmatter
    let frontmatter = `---\ntitle: ${title}\ndate: '${date}'`;
    if (description) {
      frontmatter += `\ndescription: ${description}`;
    }
    frontmatter += '\n---\n\n';

    const fullContent = frontmatter + content;

    await fs.writeFile(filePath, fullContent, 'utf-8');

    return NextResponse.json({
      success: true,
      slug,
      message: 'Post updated successfully',
    });
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/posts - Delete post
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

    await fs.unlink(filePath);

    return NextResponse.json({
      success: true,
      message: 'Post deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}
