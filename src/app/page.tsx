'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { frames } from '@/data/frames';
import { ArrowRight, Sparkles, Heart, Star } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 sm:p-12 overflow-hidden relative">
      {/* Dreamy Sky Atmosphere */}
      <div className="sky-atmosphere" />
      
      {/* Floating Cloud Blobs */}
      <div className="cloud-tex w-[40vw] h-[30vw] top-[5%] left-[5%]" />
      <div className="cloud-tex w-[50vw] h-[40vw] bottom-[-10%] right-[-5%]" />
      <div className="cloud-tex w-[30vw] h-[20vw] top-[40%] right-[10%] opacity-20" />

      {/* Decorative Scrapbook Accents */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-[15%] right-[12%] text-primary opacity-30 hidden sm:block"
      >
        <Sparkles size={40} />
      </motion.div>
      <motion.div 
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[20%] left-[8%] text-secondary opacity-20 hidden sm:block"
      >
        <Star size={32} fill="currentColor" />
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
        className="text-center max-w-4xl mx-auto z-10 flex flex-col items-center"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-3 px-4 py-2 bg-white/40 backdrop-blur-md rounded-full border border-white/60 mb-10 shadow-sm"
        >
          <Heart size={14} className="text-secondary" fill="currentColor" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-secondary">Collect sweet moments</span>
        </motion.div>
        
        <h1 className="text-6xl sm:text-8xl font-bold tracking-tight mb-8 text-foreground leading-[1] text-shadow-dreamy">
          Create sweet <br /> 
          <span className="serif-italic font-normal text-secondary pr-4">memories</span> 
          together
        </h1>
        
        <p className="text-lg sm:text-xl text-foreground/60 mb-12 max-w-lg leading-relaxed font-medium">
          Capture your vibe with our collectible photocard layouts. 
          A dreamy digital photobooth experience by NorthVows.
        </p>

        <Link href="/photobooth">
          <motion.button
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.95 }}
            className="group relative inline-flex items-center justify-center px-12 py-5 bg-gradient-to-br from-secondary to-foreground text-primary-foreground rounded-full text-lg font-bold shadow-2xl shadow-secondary/30 transition-all gap-3 soft-transition border border-white/20 overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            Start Photobooth <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </motion.button>
        </Link>
      </motion.div>

      {/* Organic Scrapbook Frame Previews */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 1.5 }}
        className="mt-24 w-full max-w-7xl relative"
      >
        <div className="flex gap-6 sm:gap-12 overflow-x-auto pb-20 pt-10 snap-x snap-mandatory hide-scrollbar px-6">
          {frames.map((frame, index) => (
            <motion.div
              key={frame.id}
              initial={{ opacity: 0, rotate: index % 2 === 0 ? -4 : 4, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ 
                y: -15, 
                rotate: 0, 
                scale: 1.05,
                transition: { duration: 0.4 }
              }}
              transition={{ delay: 1 + index * 0.15, duration: 1 }}
              className={`flex-shrink-0 snap-center w-[220px] sm:w-[280px] relative rounded-sm p-3 border-[6px] border-white group soft-transition ${index % 2 === 0 ? 'denim-card' : 'scrapbook-card'}`}
            >
              {/* Tape Accent */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 tape-accent z-20 opacity-90 group-hover:opacity-100 transition-opacity rounded-sm shadow-sm" />
              
              <div className="aspect-[3/4] relative rounded-sm overflow-hidden bg-muted/20">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={frame.url} 
                  alt={frame.name}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
              </div>
              
              <div className="mt-4 flex flex-col items-center gap-1">
                 <span className={`text-[10px] font-black uppercase tracking-widest ${index % 2 === 0 ? 'text-white' : 'text-secondary/40'}`}>
                   {frame.name}
                 </span>
                 <div className={`w-6 h-px ${index % 2 === 0 ? 'bg-white/20' : 'bg-secondary/10'}`} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Floating notes */}
        <div className="absolute top-0 left-[10%] w-32 h-32 opacity-10 rotate-[-15deg] pointer-events-none hidden lg:block">
           <div className="scrapbook-card p-4 text-[10px] font-black uppercase tracking-widest text-secondary">
              memories never fade 💙
           </div>
           <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 tape-accent w-12" />
        </div>
        
        <div className="absolute bottom-10 right-[15%] w-32 h-32 opacity-10 rotate-[10deg] pointer-events-none hidden lg:block">
           <div className="scrapbook-card p-4 text-[10px] font-black uppercase tracking-widest text-secondary">
              your story, our frame
           </div>
           <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 tape-accent w-12" />
        </div>
      </motion.div>

      {/* Minimal Footer Info */}
      <div className="mt-12 text-[10px] font-black uppercase tracking-[0.5em] text-foreground/20 italic">
        Memory Studio Vol. 01 • Est. 2026
      </div>
    </div>
  );
}
