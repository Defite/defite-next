import React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/Header';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { SpeedInsights } from '@vercel/speed-insights/next';

// Inter is variable from 100 to 900.
const sans = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
  adjustFontFallback: false,
  fallback: ['ui-sans-serif', 'system-ui', 'sans-serif'],
});

export const metadata: Metadata = {
  title: 'Nikita Makhov — Front-end web developer',
  description: 'Personal web site, blog, projects, code and thoughts',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning className='antialiased'>
      <body className={`${sans.variable} font-sans`}>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          {children}
        </ThemeProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
