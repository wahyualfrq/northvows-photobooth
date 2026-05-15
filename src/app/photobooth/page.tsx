'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { layouts } from '@/data/layouts';
import { frames } from '@/data/frames';
import { Frame, Layout } from '@/types';
import CameraView from '@/components/photobooth/CameraView';
import { Sparkle, Star, ArrowLeft, Flower, Heart, Sun } from 'lucide-react';
import Link from 'next/link';

export default function PhotoboothPage() {
  const router = useRouter();
  const [selectedLayout, setSelectedLayout] = useState<Layout>(layouts[2]); // Default 2x2
  const [selectedFrame] = useState<Frame>(frames[0]); // Placeholder frame for preview

  const handleCameraComplete = (photos: string[]) => {
    // Save to localStorage for the result page
    if (typeof window !== 'undefined') {
      localStorage.setItem('northvows_captured_photos', JSON.stringify(photos));
      localStorage.setItem('northvows_selected_layout', JSON.stringify(selectedLayout));
      router.push('/photobooth/result');
    }
  };

  return (
    <main className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Premium Sky Background */}
      <div className="photobooth-sky-bg" />

      {/* Floating Exit Button */}
      <div className="absolute top-8 left-8 sm:left-12 z-50">
        <Link href="/">
          <motion.button
            whileHover={{ x: -4 }}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-[#24344D]/30 hover:text-[#24344D] transition-colors"
          >
            <ArrowLeft size={12} /> EXIT STUDIO
          </motion.button>
        </Link>
      </div>

      {/* Decorative Scrapbook Elements */}
      <div className="absolute top-[15%] left-[5%] text-[#AFCDF5] opacity-20 pointer-events-none">
        <Sparkle size={24} fill="currentColor" />
      </div>
      <div className="absolute bottom-[20%] left-[2%] text-[#AFCDF5] opacity-10 pointer-events-none -rotate-12">
        <Star size={32} fill="currentColor" />
      </div>

      {/* Aesthetic Star Overlays - Top Layer with Floating Animation */}
      <motion.div 
        animate={{ 
          y: [0, -15, 0],
          rotate: [12, 14, 12]
        }}
        transition={{ 
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="hidden sm:block absolute top-[12%] -right-2 sm:-right-4 w-32 sm:w-64 opacity-100 pointer-events-none z-[150]"
      >
        <img src="/images/star1.webp" alt="Decorative Star" className="w-full h-auto" />
      </motion.div>

      <motion.div 
        animate={{ 
          y: [0, 15, 0],
          rotate: [-6, -8, -6]
        }}
        transition={{ 
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
        className="hidden sm:block absolute bottom-[2%] -left-6 sm:-left-8 w-40 sm:w-80 opacity-100 pointer-events-none z-[150]"
      >
        <img src="/images/star2.webp" alt="Decorative Star" className="w-full h-auto" />
      </motion.div>

      {/* Decorative Record Overlay */}
      <div className="hidden sm:block absolute top-[6%] -left-28 sm:-left-64 w-64 sm:w-[450px] opacity-100 pointer-events-none z-[150] rotate-[-15deg]">
        <img src="/images/record1.webp" alt="Decorative Record" className="w-full h-auto" />
      </div>
      {/* Cute Decorative Icons */}
      <div className="absolute top-[45%] left-[8%] text-[#5A7FB2] opacity-30 pointer-events-none rotate-12">
        <Flower size={32} fill="currentColor" />
      </div>
      <div className="absolute top-[18%] right-[12%] text-[#5A7FB2] opacity-40 pointer-events-none -rotate-12">
        <Heart size={24} fill="currentColor" />
      </div>
      <div className="absolute bottom-[35%] right-[5%] text-[#5A7FB2] opacity-30 pointer-events-none rotate-[20deg]">
        <Sun size={28} fill="currentColor" />
      </div>
      <div className="absolute top-[60%] right-[15%] text-[#5A7FB2] opacity-30 pointer-events-none -rotate-6">
        <Flower size={22} fill="currentColor" />
      </div>
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center px-6 sm:px-12 max-w-7xl mx-auto w-full z-10 pt-24 sm:pt-12 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="w-full flex flex-col items-center gap-0 sm:gap-4"
        >
          {/* Centered Header Title */}
          <div className="text-center space-y-3 mb-0 sm:mb-4">
            <h1 className="text-3xl sm:text-5xl font-black text-[#24344D] tracking-tighter uppercase leading-none">
              LIVE <span className="serif-italic font-normal text-[#AFCDF5] lowercase px-2">from</span> STUDIO.
            </h1>
            <p className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.2em] sm:tracking-[0.4em] text-[#24344D]/20">Instant Memory Capture</p>
          </div>

          <CameraView 
            onComplete={handleCameraComplete}
            selectedLayout={selectedLayout}
            selectedFrame={selectedFrame}
            onLayoutChange={setSelectedLayout}
          />
        </motion.div>
      </div>
    </main>
  );
}
