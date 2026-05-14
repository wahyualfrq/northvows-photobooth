'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { frames } from '@/data/frames';
import { ArrowRight, Sparkles, Heart, Star } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 sm:p-12 overflow-hidden relative">
      {/* Cloudy Sky Background */}
      <div className="cloudy-sky-bg" />
      
      {/* Floating Cloud Glows */}
      <div className="absolute top-[10%] left-[-5%] w-[40vw] h-[40vw] bg-primary/20 rounded-full cloud-glow -z-10" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[50vw] h-[50vw] bg-accent/30 rounded-full cloud-glow -z-10" />

      {/* Decorative Accents */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute top-[15%] right-[15%] text-primary hidden sm:block"
      >
        <Sparkles size={32} />
      </motion.div>
      <motion.div 
        animate={{ rotate: [0, 10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[20%] left-[10%] text-secondary/30 hidden sm:block"
      >
        <Star size={24} fill="currentColor" />
      </motion.div>

      {/* Main Content (Centered) */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.25, 1, 0.5, 1] }}
        className="text-center max-w-4xl mx-auto z-10 flex flex-col items-center"
      >
        {/* Aesthetic Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 backdrop-blur-md text-secondary text-[10px] font-black tracking-[0.4em] uppercase mb-10 border border-white/80 shadow-sm"
        >
          <Heart size={10} fill="currentColor" />
          <span>School Memoir Collection</span>
        </motion.div>
        
        {/* Hero Headline */}
        <h1 className="text-6xl sm:text-8xl font-black tracking-tighter mb-8 text-foreground leading-[1] text-balance">
          Create sweet <br /> 
          <span className="serif-italic font-normal text-primary">memories</span> together.
        </h1>
        
        {/* Emotional Description */}
        <p className="text-lg sm:text-xl text-foreground/60 mb-12 max-w-xl leading-relaxed font-medium">
          Capture nostalgic moments in our cloudy-blue digital studio. 
          A collectible photobooth experience for your memory book.
        </p>

        {/* CTA Button */}
        <Link href="/photobooth">
          <motion.button
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center justify-center px-12 py-5 bg-gradient-to-br from-primary to-secondary text-primary-foreground rounded-full text-lg font-bold shadow-xl shadow-primary/20 transition-all gap-3 soft-lift border border-white/20"
          >
            Start Session <ArrowRight className="w-5 h-5" />
          </motion.button>
        </Link>
      </motion.div>

      {/* Photostrip Preview Section - Scrapbook Yearbook Style */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 1 }}
        className="mt-24 w-full max-w-6xl relative"
      >
        <div className="flex gap-6 sm:gap-10 overflow-x-auto pb-16 pt-10 snap-x snap-mandatory hide-scrollbar px-6">
          {frames.map((frame, index) => (
            <motion.div
              key={frame.id}
              initial={{ opacity: 0, rotate: index % 2 === 0 ? -2 : 2, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ 
                y: -10, 
                rotate: 0, 
                scale: 1.02,
                transition: { duration: 0.3 }
              }}
              transition={{ delay: 0.8 + index * 0.1, duration: 0.8 }}
              className="flex-shrink-0 snap-center w-[220px] sm:w-[280px] relative memory-card rounded-xl p-3 sm:p-4 border-2 border-white/80 group"
            >
              {/* Tape Accent */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 tape-accent z-20 opacity-80 group-hover:opacity-100 transition-opacity rounded-sm" />
              
              <div className="aspect-[3/4] relative rounded-lg overflow-hidden bg-muted/30">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={frame.url} 
                  alt={frame.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              
              {/* Handwritten-style Caption */}
              <div className="mt-4 text-center">
                 <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/40 block mb-1">Layout</span>
                 <span className="text-xs font-bold text-foreground/70 tracking-widest">{frame.name}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Bottom Branding */}
      <div className="mt-12 opacity-30 flex items-center gap-4">
        <div className="w-12 h-px bg-foreground" />
        <span className="text-[9px] font-black uppercase tracking-[0.5em]">Memory Archive • 2026</span>
        <div className="w-12 h-px bg-foreground" />
      </div>
    </div>
  );
}
