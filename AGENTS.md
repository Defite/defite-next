# AGENTS.md

Personal site + blog. Next.js 16 (App Router, Turbopack), React 19, Tailwind v4, TypeScript 7.
**Content is filesystem MDX — there is no CMS, database, or content package.**

## Commands

npm is the package manager (`package-lock.json` is the only lockfile; the README's
yarn/pnpm/bun mentions are create-next-app boilerplate).

- `npm run dev` — dev server on http://localhost:3000
- `npm run build` — production build. It **runs typecheck** and prints the prerendered route
  list, so it is the best single verification step.
- `npm run lint` — `oxlint` only
- `npx tsc --noEmit` — typecheck (no npm script exists for this)

There is **no test framework and no CI** (no `.github/` directory). Don't add or assume
jest/vitest/playwright; verify with `npm run lint` + `npx tsc --noEmit` (or `npm run build`).

Prettier is installed and configured (`.prettierrc.json`: `singleQuote`, `jsxSingleQuote`,
`printWidth: 80`, tailwind plugin) but is **not wired into any script and not enforced** — the
repo currently fails `npx prettier --check` on ~15 files. Do not run `prettier --write` across
the repo; match the file you are editing.

## Routes and content

All routes derive from files on disk; there is no route registry to update.

- `src/content/posts/<slug>.mdx` → `/blog/<slug>` (`src/app/blog/[slug]/page.tsx`)
- `src/content/pages/<slug>.mdx` → `/<slug>` (root catch-all `src/app/[slug]/page.tsx`)
- Nav items come from `src/routes.ts` — add an entry there when adding a page.

To add a blog post: create the MDX with frontmatter `title`, `description`, `date` (quoted
`'YYYY-MM-DD'`), then optionally `public/blog/<slug>/intro.avif`. Slug is the filename. Posts
and pages are prerendered via `generateStaticParams`, so new content needs a rebuild to appear
in production output (no revalidation is wired up).

Gotchas in the content pipeline:

- The MDX in `src/content` is compiled by **`next-mdx-remote/rsc` (`compileMDX`) in
  `src/utils.ts`**, not by the `@next/mdx` loader configured in `next.config.mjs`. That loader
  currently has no `.mdx` files in `app/` to act on.
- **`next-mdx-remote` v6 silently strips JSX attribute expressions from MDX.** Its `serialize`
  defaults to `blockJS: true`, which injects a `removeJavaScriptExpressions` remark plugin that
  deletes every `attr={value}` and every `{...spread}` inside JSX, plus bare `{expression}` nodes.
  So `<MdxImage src='…' width={850} height={300} />` reaches the component with **only** the
  string-literal attributes (`src`, `caption`) and `next/image` then throws
  `missing required "width" property`. Fix by writing dimensions as string literals
  (`width="850"` — `ImageProps` types `width` as `number | \`${number}\`` and `next/image`
  parses digit-only strings), or by passing `blockJS: false` to `compileMDX` in `src/utils.ts`
  (dangerous calls stay blocked either way).
- Only `MdxImage` and `MdxYoutube` are registered as custom components, and only for **blog
  posts** (`getSingleBlogPost`). Page MDX (`getPage`) gets no custom components and no
  `rehype-expressive-code`, so `<MdxImage>` or syntax highlighting will not work in
  `src/content/pages/*.mdx`.
- The intro image is hardcoded to `.avif`: `getPostImages` filters for `.avif` only and
  `getSingleBlogPost` looks for the exact filename `intro.avif`. Other extensions/filenames are
  silently ignored.
- Frontmatter `date` is parsed as `new Date(dateStr)` and formatted with `toLocaleDateString('en-GB')`.

## Codebase gotchas

- **`src/utils.ts` and `src/image.ts` start with `'use server'`.** Every export in those files
  becomes a server action, so exports must stay `async`. They read `src/content/**` and
  `public/blog/**` from disk at build/request time — they are server-only.
- `src/image.ts` generates blur placeholders at runtime with native `sharp` (remote URLs are
  fetched). Keep it server-side.
- **SVG imports are React components**, wired via the `*.svg` Turbopack rule in
  `next.config.mjs` (`@svgr/webpack`, `as: '*.js'`) and typed in `svgr.d.ts`. Use
  `import Icon from '@/icons/foo.svg'`, not a URL.
- Path alias: `@/*` → `./src/*`.
- `next-env.d.ts` is gitignored but present locally — do not commit it.
- `package.json` `resolutions` is a Yarn-only field and is a **no-op under npm**; the installed
  `@types/react` is 19.3.0, not the 19.0.1 listed there. Also `react` (19.3.0) and `react-dom`
  (19.2.3) are on different versions — leave that alone unless asked.

## Theming / styling

Tailwind v4 with a legacy JS config: `src/app/globals.css` does `@import 'tailwindcss'` plus
`@config '../../tailwind.config'`. Dark mode is class-based (`darkMode: ['class']` in
`tailwind.config.js`, `next-themes` with `attribute='class'` and `defaultTheme='system'` in
`src/app/layout.tsx`; tokens live under `:root` and `.dark`).

A new semantic color therefore needs edits in up to three places, all in sync:

1. CSS variable under both `:root` and `.dark` in `src/app/globals.css`
2. `theme.extend.colors` in `tailwind.config.js` (mapped to `var(--...)`)
3. an `@utility` block in `globals.css` if it needs a non-standard utility name

Existing one-off utilities: `text-foreground`, `bg-foreground`, `bg-control`,
`bg-control-active`, plus plain CSS classes `.wrapper`, `.color-primary`.

## Conventions

- Client components need an explicit `'use client'` (e.g. `Header`, `ThemeToggle`,
  `SegmentedNavControl`, `use-header-menu`). `GithubActivity` also `next/dynamic`s
  `react-github-calendar` with `ssr: false` inside `<Suspense>`.
- Components live in `src/components/<Name>/<Name>.tsx` + `index.ts` barrel + CSS module; a few
  flat files (`Header.tsx`, `Hero.tsx`, `Logo.tsx`, `PostsList.tsx`) predate that pattern.
- Commit messages follow Conventional Commits, and some are written in Russian — match the
  existing style. Dependency bumps arrive via Dependabot PRs to `npm_and_yarn`.
- `public/color-theme-test/index.html` is a standalone static page for eyeballing theme colors,
  not part of the App Router.