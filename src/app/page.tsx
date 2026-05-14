'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { frames } from '@/data/frames';
import { ArrowRight, Sparkles, Heart, Star } from 'lucide-react';
import { useRef } from 'react';

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, -50]);
  const y2 = useTransform(scrollY, [0, 500], [0, 50]);

  return (
    <div ref={containerRef} className="min-h-screen flex flex-col items-center justify-center p-6 sm:p-12 overflow-hidden relative">
      {/* Immersive Dreamy Background */}
      <div className="dreamy-bg" />
      
      {/* Floating Light Blobs */}
      <motion.div 
        animate={{ 
          x: [0, 50, 0], 
          y: [0, 30, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] left-[-5%] w-[40vw] h-[40vw] bg-primary/10 rounded-full blur-[100px] -z-10" 
      />
      <motion.div 
        animate={{ 
          x: [0, -40, 0], 
          y: [0, 50, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[-10%] right-[-5%] w-[50vw] h-[50vw] bg-accent/20 rounded-full blur-[120px] -z-10" 
      />

      {/* Doodle Accents */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[20%] left-[15%] text-primary opacity-10 hidden sm:block"
        >
          <Sparkles size={40} />
        </motion.div>
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-[40%] right-[15%] text-brown hidden sm:block"
        >
          <Star size={24} fill="currentColor" />
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
        className="text-center max-w-4xl mx-auto z-10 relative"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-white/20 blur-[80px] -z-10 rounded-full scale-150" />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/40 backdrop-blur-md text-foreground/70 text-xs font-bold mb-10 border border-white/50 tracking-[0.2em] uppercase"
        >
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span>Korean Studio Aesthetic</span>
        </motion.div>
        
        <h1 className="text-6xl sm:text-8xl font-bold tracking-tight mb-8 text-foreground leading-[1] text-shadow-soft">
          Keep every <br /> 
          <span className="text-primary italic font-serif relative">
            sweet moment
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ delay: 1, duration: 1.5 }}
              className="absolute bottom-2 left-0 h-2 bg-accent/30 -z-10"
            />
          </span> 
          <br /> forever ✨
        </h1>
        
        <p className="text-lg sm:text-2xl text-foreground/60 mb-14 max-w-xl mx-auto leading-relaxed font-medium italic opacity-80">
          Create dreamy photostrips and collectible memories 
          in our digital vintage studio.
        </p>

        <Link href="/photobooth">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="relative inline-block group"
          >
            <div className="absolute inset-0 bg-primary blur-2xl opacity-20 group-hover:opacity-40 transition-opacity rounded-full" />
            <button className="relative flex items-center justify-center px-12 py-6 bg-gradient-to-br from-primary to-secondary text-primary-foreground rounded-full text-xl font-bold shadow-2xl shadow-primary/20 transition-all gap-4 soft-transition border border-white/20">
              Start Photobooth <ArrowRight className="w-6 h-6" />
            </button>
          </motion.div>
        </Link>
      </motion.div>

      <motion.div 
        style={{ y: y1 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 1.5 }}
        className="mt-32 w-full max-w-7xl px-4 relative"
      >
        <div className="flex gap-8 sm:gap-16 overflow-x-auto pb-20 pt-10 snap-x snap-mandatory hide-scrollbar">
          {frames.map((frame, index) => (
            <motion.div
              key={frame.id}
              initial={{ opacity: 0, rotate: index % 2 === 0 ? -4 : 4, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ 
                y: -15, 
                rotate: 0, 
                scale: 1.05,
                transition: { duration: 0.4 }
              }}
              transition={{ delay: 1 + index * 0.15, duration: 1 }}
              className="flex-shrink-0 snap-center w-[240px] sm:w-[320px] relative scrapbook-card rounded-2xl p-4 sm:p-5 border-2 border-white/50 group"
            >
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 tape-accent z-20 opacity-90 group-hover:opacity-100 transition-opacity shadow-sm" />
              
              <div className="aspect-[3/4] relative rounded-xl overflow-hidden bg-muted/20">
                <div className="absolute inset-0 bg-gradient-to-tr from-black/5 via-transparent to-white/10 z-10 pointer-events-none" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={frame.url} 
                  alt={frame.name}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
              </div>
              
              <div className="mt-6 flex items-center justify-between px-1">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-[0.3em] font-black text-primary/40 leading-none mb-1">Theme</span>
                  <span className="text-sm font-bold text-foreground/80 tracking-widest">{frame.name}</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-primary/40">
                   <Heart size={14} fill="currentColor" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          style={{ y: y2 }}
          className="absolute -bottom-10 right-20 text-brown/5 pointer-events-none hidden lg:block"
        >
          <span className="text-[180px] font-serif italic font-black leading-none tracking-tighter">Memories</span>
        </motion.div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 2 }}
        className="mt-16 flex items-center gap-4 text-foreground/40 font-bold text-[10px] tracking-[0.5em] uppercase"
      >
        <div className="w-12 h-px bg-current" />
        NorthVows Studio • Seoul to You
        <div className="w-12 h-px bg-current" />
      </motion.div>
    </div>
  );
}
