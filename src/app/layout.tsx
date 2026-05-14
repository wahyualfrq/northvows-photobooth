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
        <nav className="fixed top-0 left-0 w-full z-50 px-8 py-6 flex items-center justify-between max-w-7xl mx-auto left-1/2 -translate-x-1/2 pointer-events-none">
          <div className="flex items-center gap-2 pointer-events-auto">
            <h1 className="text-xl font-bold tracking-tighter text-foreground">NorthVows</h1>
          </div>
          
          <div className="hidden md:flex items-center gap-8 pointer-events-auto">
            {['Home', 'Frames', 'Photobooth', 'About'].map((item) => (
              <Link key={item} href="/" className="group relative text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40 hover:text-primary soft-transition px-3 py-1">
                {item}
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-primary transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-6 pointer-events-auto">
             <Link href="/photobooth" className="group flex items-center gap-2 px-6 py-2.5 bg-foreground text-background rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 soft-transition">
                <Camera size={14} className="group-hover:rotate-12 transition-transform" />
                <span>Start Session</span>
             </Link>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
