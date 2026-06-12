import type { Metadata } from 'next';
import './globals.css';
import Providers from '@/components/Providers';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'OrionVote — Favorite Website Voting System',
  description: 'Preview and vote for your favorite deployed websites. An interactive voting platform with live iframe previews.',
  keywords: ['voting', 'websites', 'favorites', 'poll'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <Providers>
          <Navbar />
          <main className="pt-16 min-h-screen">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
