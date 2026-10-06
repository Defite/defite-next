import React from 'react';
import type { Metadata } from 'next';
import { Google_Sans } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/Header';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { SpeedInsights } from '@vercel/speed-insights/next';

// Google Sans is variable from 400 to 700 — 700 is the heaviest weight it has.
const sans = Google_Sans({
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
    <html lang='en' suppressHydrationWarning className=''>
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
