'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { frames } from '@/data/frames';
import { ArrowRight, MoveUpRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 sm:p-12 overflow-hidden relative">
      {/* Subtle Editorial Background */}
      <div className="editorial-bg" />

      {/* Main Editorial Hero */}
      <div className="w-full max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 lg:gap-24 items-center z-10">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: [0.25, 1, 0.5, 1] }}
          className="space-y-10"
        >
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-[10px] font-black uppercase tracking-[0.6em] text-primary/50"
            >
              Editorial Sessions • 2026
            </motion.div>
            <h1 className="text-7xl sm:text-9xl font-black text-foreground leading-[0.9] tracking-tighter">
              CAPTURE <br /> 
              <span className="serif-italic font-normal text-primary pr-4">Authentic</span> <br />
              MEMOIR.
            </h1>
          </div>
          
          <p className="text-lg sm:text-xl text-foreground/60 max-w-md leading-relaxed font-medium">
            A vintage-inspired digital photobooth for modern memoirs. 
            Denim editorials meet Korean studio culture.
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <Link href="/photobooth">
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: '#24344D' }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center justify-center px-10 py-5 bg-primary text-primary-foreground rounded-full text-lg font-bold shadow-2xl shadow-primary/10 transition-all gap-3 clean-transition"
              >
                Start Session <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
            
            <Link href="#collection" className="group">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40 group-hover:text-primary transition-colors">
                View Collection <MoveUpRight className="w-3 h-3 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </div>
            </Link>
          </div>
        </motion.div>

        {/* Asymmetrical Photostrip Display */}
        <div className="relative flex justify-center lg:justify-end">
          <div className="relative w-full max-w-[400px] h-[550px] sm:h-[650px]">
            {/* Main Photostrip */}
            <motion.div
              initial={{ opacity: 0, y: 50, rotate: -2 }}
              animate={{ opacity: 1, y: 0, rotate: -3 }}
              transition={{ delay: 0.4, duration: 1 }}
              className="absolute top-0 right-0 w-[240px] sm:w-[300px] z-20 editorial-card p-4 sm:p-5 rounded-sm"
            >
              <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 tape-accent-minimal opacity-60" />
              <div className="aspect-[3/4] bg-muted/20 relative overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={frames[0].url} alt="Denim Vibe" className="w-full h-full object-cover" />
              </div>
              <div className="mt-4 flex justify-between items-center px-1">
                <span className="text-[9px] font-black uppercase tracking-widest text-primary/40">Studio 01</span>
                <span className="serif-italic text-sm text-foreground/60">NorthVows</span>
              </div>
            </motion.div>

            {/* Background Photostrip */}
            <motion.div
              initial={{ opacity: 0, y: 80, rotate: 5 }}
              animate={{ opacity: 1, y: 30, rotate: 6 }}
              transition={{ delay: 0.6, duration: 1.2 }}
              className="absolute bottom-0 left-0 w-[200px] sm:w-[260px] z-10 editorial-card p-4 rounded-sm grayscale opacity-40 hover:opacity-80 transition-opacity"
            >
              <div className="aspect-[3/4] bg-muted/20 overflow-hidden">
                 {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={frames[1].url} alt="Denim Vibe" className="w-full h-full object-cover" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Minimal Footer Branding */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-12 left-12 hidden lg:flex items-center gap-6"
      >
        <span className="text-[10px] font-black uppercase tracking-[0.5em] vertical-text">Archive • 2026</span>
        <div className="w-[1px] h-20 bg-foreground/20" />
      </motion.div>

      <style jsx>{`
        .vertical-text {
          writing-mode: vertical-rl;
          text-orientation: mixed;
          transform: rotate(180deg);
        }
      `}</style>
    </div>
  );
}
