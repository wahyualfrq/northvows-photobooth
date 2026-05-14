'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { layouts } from '@/data/layouts';
import { frames } from '@/data/frames';
import { Frame, Layout } from '@/types';
import CameraView from '@/components/photobooth/CameraView';
import { Sparkle, Star, ArrowLeft } from 'lucide-react';
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

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center px-6 sm:px-12 max-w-7xl mx-auto w-full z-10 pt-12 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="w-full flex flex-col items-center gap-4"
        >
          {/* Centered Header Title */}
          <div className="text-center space-y-3 mb-4">
            <h1 className="text-4xl sm:text-5xl font-black text-[#24344D] tracking-tighter uppercase leading-none">
              LIVE <span className="serif-italic font-normal text-[#AFCDF5] lowercase px-2">from</span> STUDIO.
            </h1>
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-[#24344D]/20">Instant Memory Capture</p>
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
