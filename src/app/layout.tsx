import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { ReactQueryProvider } from '@/components/providers/ReactQueryProvider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Medebr Shop',
  description: 'A premium mini e-commerce platform challenge',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-gray-50 antialiased dark:bg-gray-900`}
      >
        <ReactQueryProvider>
          <AuthProvider>
            <Navbar />
            <main className="min-h-[calc(100vh-4rem)]">{children}</main>
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
