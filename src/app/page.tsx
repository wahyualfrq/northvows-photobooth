'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { frames } from '@/data/frames';
import { Camera, Cloud, Flower2, Heart, Star, Moon, Bird, Cherry, Ghost, Sparkle } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center p-6 sm:p-12 overflow-hidden relative">
      {/* Dreamy Sky Atmosphere */}
      <div className="sky-atmosphere" />
      
      {/* Floating Cloud Blobs */}
      <div className="cloud-tex w-[40vw] h-[30vw] top-[5%] left-[5%]" />
      <div className="cloud-tex w-[50vw] h-[40vw] bottom-[-10%] right-[-5%]" />
      <div className="cloud-tex w-[30vw] h-[20vw] top-[40%] right-[10%] opacity-20" />

      {/* Decorative Scrapbook Accents */}
      <motion.div 
        animate={{ 
          y: [0, -10, 0],
          rotate: [0, 5, 0]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[18%] right-[15%] text-primary opacity-30 hidden sm:block"
      >
        <Cloud size={48} fill="currentColor" />
      </motion.div>

      <motion.div 
        animate={{ 
          y: [0, 15, 0],
          rotate: [0, -10, 0]
        }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[6%] left-[10%] text-secondary opacity-20 hidden sm:block"
      >
        <Moon size={40} fill="currentColor" />
      </motion.div>

      <motion.div 
        animate={{ 
          x: [0, 20, 0],
          y: [0, -5, 0]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[35%] right-[8%] text-primary opacity-20 hidden sm:block"
      >
        <Bird size={36} />
      </motion.div>

      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, -10, 0]
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[45%] left-[5%] text-primary opacity-20 hidden sm:block"
      >
        <Flower2 size={32} />
      </motion.div>

      <motion.div 
        animate={{ 
          y: [0, -12, 0],
          scale: [1, 1.05, 1]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[25%] right-[12%] text-secondary opacity-20 hidden sm:block"
      >
        <Cherry size={32} />
      </motion.div>

      <motion.div 
        animate={{ 
          x: [0, -10, 0],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[35%] left-[12%] text-primary opacity-20 hidden sm:block"
      >
        <Ghost size={34} />
      </motion.div>

      {/* Tiny Sparkles */}
      <motion.div 
        animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.2, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute top-[25%] left-[25%] text-primary opacity-20"
      >
        <Sparkle size={16} fill="currentColor" />
      </motion.div>
      <motion.div 
        animate={{ opacity: [0.1, 0.4, 0.1], scale: [0.8, 1, 0.8] }}
        transition={{ duration: 4, repeat: Infinity, delay: 1 }}
        className="absolute bottom-[40%] right-[30%] text-secondary opacity-20"
      >
        <Sparkle size={20} fill="currentColor" />
      </motion.div>

      {/* Floating Image Elements */}
      <motion.div 
        animate={{ 
          y: [0, -8, 0],
          rotate: [-5, 5, -5]
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[18%] right-[12%] z-20 pointer-events-none hidden sm:block"
      >
        <div className="relative w-32 h-32 sm:w-72 sm:h-72 opacity-90 hover:opacity-100 transition-opacity">
          <Image 
            src="/images/cameraE.webp" 
            alt="Vintage Camera" 
            fill
            className="object-contain drop-shadow-2xl"
          />
        </div>
      </motion.div>

      <motion.div 
        animate={{ 
          y: [0, 10, 0],
          rotate: [5, -5, 5]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[12%] left-[5%] z-20 pointer-events-none hidden sm:block"
      >
        <div className="relative w-32 h-32 sm:w-64 sm:h-64 opacity-80 hover:opacity-100 transition-opacity">
          <Image 
            src="/images/element2.webp" 
            alt="Scrapbook Element" 
            fill
            className="object-contain drop-shadow-xl"
          />
        </div>
      </motion.div>

      <motion.div 
        animate={{ 
          y: [0, -15, 0],
          rotate: [-5, 5, -5]
        }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[35%] right-[8%] z-20 pointer-events-none hidden sm:block"
      >
        <div className="relative w-28 h-28 sm:w-56 sm:h-56 opacity-80 hover:opacity-100 transition-opacity">
          <Image 
            src="/images/element3.webp" 
            alt="Scrapbook Decoration" 
            fill
            className="object-contain drop-shadow-lg"
          />
        </div>
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
        className="text-center max-w-4xl mx-auto z-10 flex flex-col items-center mt-[12vh] sm:mt-[22vh]"
      >   
        <h1 className="text-4xl xs:text-5xl sm:text-8xl font-bold tracking-tight mb-6 sm:mb-10 text-foreground leading-[1.1] sm:leading-[1.05] text-shadow-dreamy">
          Collect moments <br /> 
          <span className="serif-italic font-normal text-secondary pr-2 sm:pr-4">keep them</span> 
          forever
        </h1>
        
        <p className="text-base sm:text-xl text-foreground/60 mb-10 sm:mb-16 max-w-[340px] xs:max-w-md sm:max-w-lg leading-relaxed font-medium">
          Create dreamy photostrips inspired by <br className="hidden sm:block" />
          vintage memories and Korean photo booths.
        </p>

        <Link href="/photobooth">
          <motion.button
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.95 }}
            className="group relative inline-flex items-center justify-center px-8 py-4 sm:px-14 sm:py-6 bg-gradient-to-br from-secondary to-foreground text-primary-foreground rounded-full text-base sm:text-lg font-bold shadow-2xl shadow-secondary/30 transition-all gap-3 soft-transition border border-white/20 overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Camera className="w-5 h-5 transition-transform group-hover:scale-110" /> Start Photobooth
          </motion.button>
        </Link>
      </motion.div>

      {/* Organic Scrapbook Frame Previews */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 1.5 }}
        className="mt-20 sm:mt-40 w-full max-w-7xl relative"
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
        Copyright by northvows • Est. 2026
      </div>
    </div>
  );
}
