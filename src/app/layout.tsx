import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Cormorant_Garamond } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import { Camera, Heart } from 'lucide-react';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  weight: ['400', '700'],
  style: ['italic', 'normal'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'NorthVows | Vintage Sky Photobooth',
  description: 'Capture sweet memories under the dreamy blue sky.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jakarta.variable} ${cormorant.variable}`}>
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-primary selection:text-primary-foreground">
        <nav className="fixed top-0 left-0 w-full z-50 p-6 flex items-center justify-between max-w-7xl mx-auto left-1/2 -translate-x-1/2 pointer-events-none">
          <div className="flex items-center gap-2 pointer-events-auto">
            <h1 className="text-xl font-bold tracking-tighter text-foreground">NorthVows</h1>
          </div>
          
          <div className="hidden md:flex items-center gap-12 pointer-events-auto">
            {['Home', 'Frames', 'Photobooth', 'About'].map((item) => (
              <Link key={item} href="/" className="text-xs font-bold uppercase tracking-[0.2em] text-foreground/60 hover:text-foreground soft-transition">
                {item}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-6 pointer-events-auto">
             <Link href="/photobooth" className="flex items-center gap-2 px-5 py-2.5 bg-foreground text-background rounded-full text-xs font-bold shadow-lg hover:scale-105 soft-transition">
                <Camera size={14} />
                <span>Start Photobooth</span>
             </Link>
             <Heart size={20} className="text-foreground/40 hover:text-foreground cursor-pointer transition-colors" />
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
