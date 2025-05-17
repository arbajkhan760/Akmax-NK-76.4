
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Header from '@/components/app/Header';
import BottomNav from '@/components/app/BottomNav';
import { Toaster } from "@/components/ui/toaster";
import { cn } from '@/lib/utils';
import Akgroup76AiInitializer from '@/components/app/Akgroup76AiInitializer'; // Import the initializer

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'AK Reels',
  description: 'The next generation social media platform by AK Group 76',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          `${geistSans.variable} ${geistMono.variable}`
        )}
      >
        <Akgroup76AiInitializer /> {/* Initialize AKGROUP76 AI service */}
        <div className="relative flex min-h-screen flex-col">
          {/* Header is conditionally rendered or removed on /camera page by CameraInterface itself or page layout */}
          <Header />
          {/* Adjust padding: pb-[4.5rem] for mobile (height of BottomNav), md:pb-0 for desktop 
              This padding is for general pages. Camera page might override this or hide BottomNav.
          */}
          <main className="flex-1 pb-[calc(4.5rem+env(safe-area-inset-bottom))] md:pb-0">{children}</main>
          <BottomNav />
        </div>
        <Toaster />
      </body>
    </html>
  );
}
