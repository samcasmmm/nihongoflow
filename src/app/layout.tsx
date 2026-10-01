import type { Metadata } from 'next';
import { Baloo_2, Inter } from 'next/font/google';
import './globals.css';

const baloo = Baloo_2({
  variable: '--font-baloo',
  subsets: ['latin'],
  weight: ['700', '800'],
  display: 'swap',
});

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'NihongoFlow 🦊 — Master Japanese with Guided Flow & SWOT Diagnostics',
  description:
    'Learn Japanese through a structured textbook loop: Vocabulary → Grammar → Practice → SWOT feedback. Powered by effort-based gamification.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' className={`${baloo.variable} ${inter.variable} h-full antialiased dark`} suppressHydrationWarning>
      <body className='min-h-full flex flex-col font-sans bg-(--bg) text-(--text)' suppressHydrationWarning>{children}</body>
    </html>
  );
}
