'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Camera, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = ['Home', 'Frames', 'Photobooth', 'About'];

  return (
    <>
      <nav className={cn(
        "fixed top-0 left-0 w-full z-50 px-4 sm:px-6 transition-all duration-500",
        isScrolled 
          ? "bg-white/10 backdrop-blur-xl py-3 shadow-sm border-b border-white/5" 
          : "bg-transparent py-5 sm:py-6"
      )}>
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-foreground/60 hover:text-foreground transition-colors"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            
            <Link href="/">
              <h1 className="text-base sm:text-lg font-black tracking-tighter text-foreground/80 hover:text-foreground soft-transition">NorthVows</h1>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((item) => (
              <Link 
                key={item} 
                href="/" 
                className="relative px-4 py-2 text-[9px] font-black uppercase tracking-[0.4em] text-foreground/30 hover:text-primary transition-all duration-300 group"
              >
                <span className="relative z-10">{item}</span>
                <span className="absolute inset-0 bg-primary/5 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300 -z-0" />
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
             <Link href="/photobooth" className="group flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2 bg-white/40 backdrop-blur-md border border-white/60 text-secondary rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-widest hover:bg-secondary hover:text-white soft-transition">
                <Camera size={12} className="group-hover:rotate-12 transition-transform" />
                <span className="hidden xs:block">Start Session</span>
             </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-0 z-40 bg-white/60 backdrop-blur-2xl md:hidden pt-24 px-8"
          >
            <div className="flex flex-col gap-6">
              {navLinks.map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link 
                    href="/" 
                    onClick={() => setIsMenuOpen(false)}
                    className="text-2xl font-black uppercase tracking-widest text-foreground/40 hover:text-primary transition-colors"
                  >
                    {item}
                  </Link>
                </motion.div>
              ))}
            </div>
            
            <div className="absolute bottom-12 left-8 border-l border-primary/20 pl-4">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/20">
                NorthVows Archive <br />
                © 2026 Collection
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
