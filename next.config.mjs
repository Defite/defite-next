/** @type {import('next').NextConfig} */
import createMDX from '@next/mdx';

const withMDX = createMDX({
  // Add markdown plugins here, as desired
  options: {
    remarkPlugins: ['remark-frontmatter', 'remark-mdx-frontmatter'],
  },
});

const nextConfig = {
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
};

export default withMDX(nextConfig);
