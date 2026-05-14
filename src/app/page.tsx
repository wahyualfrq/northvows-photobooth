'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { frames } from '@/data/frames';
import { ArrowRight, Camera } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 sm:p-12 overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-border opacity-20 blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-border opacity-20 blur-3xl"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center max-w-2xl mx-auto z-10"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="inline-flex items-center justify-center p-3 bg-primary text-primary-foreground rounded-full mb-8"
        >
          <Camera className="w-6 h-6" />
        </motion.div>
        
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-4 text-primary">
          Capture Your Vibe.
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-lg mx-auto">
          An aesthetic online photobooth experience by NorthVows. Choose your frame, strike a pose, and keep the memory.
        </p>

        <Link href="/photobooth">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground rounded-full text-lg font-medium transition-colors hover:bg-primary/90 gap-2"
          >
            Start Photobooth <ArrowRight className="w-5 h-5" />
          </motion.button>
        </Link>
      </motion.div>

      {/* Frame Preview Carousel */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="mt-20 w-full max-w-5xl overflow-hidden"
      >
        <div className="flex gap-4 sm:gap-8 overflow-x-auto pb-8 snap-x snap-mandatory hide-scrollbar px-4 sm:px-0">
          {frames.map((frame, index) => (
            <motion.div
              key={frame.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="flex-shrink-0 snap-center w-[200px] sm:w-[280px] aspect-[3/4] relative rounded-2xl overflow-hidden shadow-lg border border-border bg-white"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={frame.url} 
                alt={frame.name}
                className="w-full h-full object-cover"
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
