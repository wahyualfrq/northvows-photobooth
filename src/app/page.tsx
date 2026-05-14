'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { frames } from '@/data/frames';
import { ArrowRight, Sparkles, Heart } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 sm:p-12 overflow-hidden relative bg-background">
      {/* Background decoration elements */}
      <div className="absolute top-[10%] left-[5%] w-32 h-32 bg-secondary/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-[10%] right-[5%] w-48 h-48 bg-primary/10 rounded-full blur-3xl -z-10" />
      
      {/* Doodle Accents */}
      <motion.div 
        animate={{ rotate: [0, 10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[15%] right-[10%] text-secondary opacity-30 hidden sm:block"
      >
        <Sparkles size={48} />
      </motion.div>
      <motion.div 
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[20%] left-[10%] text-brown opacity-20 hidden sm:block"
      >
        <Heart size={40} fill="currentColor" />
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
        className="text-center max-w-3xl mx-auto z-10"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent text-brown text-sm font-medium mb-8 border border-border/50">
          <Sparkles className="w-4 h-4" />
          <span>Korean Studio Aesthetic</span>
        </div>
        
        <h1 className="text-5xl sm:text-7xl font-bold tracking-tight mb-6 text-foreground leading-[1.1]">
          Create sweet <br /> 
          <span className="text-primary italic font-serif">memories</span> together ✨
        </h1>
        
        <p className="text-lg sm:text-xl text-muted-foreground mb-12 max-w-lg mx-auto leading-relaxed">
          Capture your vibe with our collectible vintage photocard layouts. 
          A dreamy digital photobooth experience by NorthVows.
        </p>

        <Link href="/photobooth">
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: '#22324D' }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center justify-center px-10 py-5 bg-primary text-primary-foreground rounded-full text-lg font-semibold shadow-xl shadow-primary/20 transition-all gap-3 soft-transition"
          >
            Start Photobooth <ArrowRight className="w-5 h-5" />
          </motion.button>
        </Link>
      </motion.div>

      {/* Photostrip Preview Carousel - Scrapbook Style */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 1 }}
        className="mt-24 w-full max-w-6xl px-4"
      >
        <div className="flex gap-8 sm:gap-12 overflow-x-auto pb-12 snap-x snap-mandatory hide-scrollbar">
          {frames.map((frame, index) => (
            <motion.div
              key={frame.id}
              initial={{ opacity: 0, rotate: index % 2 === 0 ? -3 : 3, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -10, rotate: 0, scale: 1.02 }}
              transition={{ delay: 0.8 + index * 0.1, duration: 0.8 }}
              className="flex-shrink-0 snap-center w-[220px] sm:w-[280px] relative scrapbook-card rounded-xl p-3 sm:p-4 border-2 border-accent group"
            >
              {/* Tape Accent */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 tape-accent z-20 opacity-80 group-hover:opacity-100 transition-opacity" />
              
              <div className="aspect-[3/4] relative rounded-lg overflow-hidden bg-muted/30">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={frame.url} 
                  alt={frame.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="mt-4 text-center">
                <span className="text-xs uppercase tracking-[0.2em] font-bold text-muted-foreground/60">{frame.name}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Decorative text at the bottom */}
      <div className="mt-12 text-muted-foreground/30 font-serif italic text-sm tracking-widest uppercase">
        Memory Journal • Vol. 01 • Est. 2026
      </div>
    </div>
  );
}
