# Admin Panel Setup Guide

This document explains how to set up and use the admin panel for your Next.js blog.

## Features

- **GitHub OAuth2 Authentication**: Secure login using your GitHub account
- **Posts Management**: Create, read, update, and delete blog posts
- **Pages Management**: Create, read, update, and delete static pages
- **MDX Editor**: Write content using MDX (Markdown + JSX components)
- **Dark Mode Support**: Matches your existing theme

## Setup Instructions

### 1. Create GitHub OAuth App

1. Go to https://github.com/settings/developers
2. Click "New OAuth App"
3. Fill in the application details:
   - **Application name**: Your Blog Admin (or any name you prefer)
   - **Homepage URL**: `http://localhost:3000` (for local development)
   - **Authorization callback URL**: `http://localhost:3000/api/auth/[...nextauth]`

4. Click "Register application"
5. Copy the **Client ID**
6. Click "Generate a new client secret" and copy the **Client Secret**

### 2. Configure Environment Variables

1. Create a `.env.local` file in the project root:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` and add your credentials:
   ```env
   GITHUB_CLIENT_ID=your_actual_client_id_here
   GITHUB_CLIENT_SECRET=your_actual_client_secret_here
   ADMIN_GITHUB_LOGIN=your_github_username
   ```

### 3. Run the Development Server

```bash
npm run dev
```

### 4. Access the Admin Panel

1. Navigate to `http://localhost:3000/admin`
2. You'll be redirected to the login page
3. Click "Sign in with GitHub"
4. Authorize the application
5. You'll be redirected to the admin dashboard

## Admin Panel Structure

```
/admin              - Dashboard with overview
/admin/login        - Login page
/admin/posts        - Posts list
/admin/posts/new    - Create new post
/admin/posts/edit/[slug] - Edit existing post
/admin/pages        - Pages list
/admin/pages/new    - Create new page
/admin/pages/edit/[slug] - Edit existing page
```

## API Routes

```
/api/admin/posts          - GET (list), POST (create), PUT (update), DELETE (delete)
/api/admin/posts/[slug]   - GET (single post for editing)
/api/admin/pages          - GET (list), POST (create), PUT (update), DELETE (delete)
/api/admin/pages/[slug]   - GET (single page for editing)
/api/admin/stats          - GET (dashboard statistics)
/api/auth/[...nextauth]   - NextAuth.js authentication handler
```

## Content Format

### Posts

Posts are stored in `src/content/posts/` as `.mdx` files with frontmatter:

```mdx
---
title: Your Post Title
date: '2024-01-15'
description: Optional description
---

Your MDX content here...
```

### Pages

Pages are stored in `src/content/pages/` as `.mdx` files with frontmatter:

```mdx
---
title: Your Page Title
description: Optional description
---

Your MDX content here...
```

## Security Notes

- Currently, any GitHub user who authenticates can access the admin panel
- For production, you should add additional authorization checks
- Consider adding the `ADMIN_GITHUB_LOGIN` check in the middleware or auth callback
- Store your `.env.local` file securely and never commit it to version control

## Production Deployment

### Vercel

1. Add the environment variables in your Vercel project settings
2. Update the OAuth callback URL to your production domain
3. Deploy your application

### Other Platforms

Make sure to set the environment variables in your hosting platform's configuration.

## Troubleshooting

### "Invalid redirect_uri" error

Make sure the callback URL in your GitHub OAuth app matches exactly:
- Development: `http://localhost:3000/api/auth/[...nextauth]`
- Production: `https://your-domain.com/api/auth/[...nextauth]`

### Can't access admin panel

- Check that you're logged in with GitHub
- Verify the middleware is working correctly
- Check browser console for errors

### Content not saving

- Ensure file permissions allow writing to `src/content/`
- Check that the MDX format is correct
- Verify required frontmatter fields (title, date for posts; title for pages)
