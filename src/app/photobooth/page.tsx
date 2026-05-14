'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, MoveUpRight } from 'lucide-react';
import Link from 'next/link';

import FrameSelector from '@/components/photobooth/FrameSelector';
import CameraView from '@/components/photobooth/CameraView';
import PhotoPreview from '@/components/photobooth/PhotoPreview';
import { frames } from '@/data/frames';
import { Frame } from '@/types';
import { cn } from '@/lib/utils';

export default function PhotoboothPage() {
  const [step, setStep] = useState<'selection' | 'camera' | 'preview'>('selection');
  const [selectedFrame, setSelectedFrame] = useState<Frame>(frames[0]);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const handleFrameSelect = (frame: Frame) => {
    setSelectedFrame(frame);
    setStep('camera');
  };

  const handleCapture = async (imageSrc: string) => {
    setCapturedImage(imageSrc);
    setStep('preview');
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setStep('camera');
  };

  const handleDownload = (finalImage: string) => {
    if (!finalImage) return;
    const link = document.createElement('a');
    link.href = finalImage;
    link.download = `northvows-${selectedFrame.id}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Subtle Editorial Background */}
      <div className="editorial-bg" />

      {/* Header */}
      <header className="p-8 sm:p-12 flex items-center justify-between max-w-7xl mx-auto w-full z-10">
        <div className="flex items-center gap-10">
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.1, x: -4 }}
              whileTap={{ scale: 0.9 }}
              className="p-3 rounded-full bg-white border border-border shadow-sm text-primary transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
          </Link>
          <div className="flex flex-col gap-1">
            <h1 className="text-xl font-black tracking-[0.4em] text-primary uppercase leading-none">NORTHVOWS</h1>
            <div className="flex items-center gap-2">
               <div className="w-4 h-[1px] bg-primary/20" />
               <span className="text-[8px] uppercase font-black text-foreground/30 tracking-[0.4em]">Memory Archive</span>
            </div>
          </div>
        </div>
        
        <div className="hidden lg:flex items-center gap-8">
          <div className="flex items-center gap-3">
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">0{step === 'selection' ? '1' : step === 'camera' ? '2' : '3'}</span>
             <div className="w-12 h-[1px] bg-border" />
          </div>
          <span className="serif-italic text-sm text-foreground/40">
            {step === 'selection' && 'Layout Collection'}
            {step === 'camera' && 'Live Session'}
            {step === 'preview' && 'Review Memoir'}
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:pb-24 max-w-7xl mx-auto w-full gap-12 z-10">
        <AnimatePresence mode="wait">
          {step === 'selection' && (
            <motion.div
              key="selection"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
              className="w-full flex flex-col gap-16"
            >
              <div className="text-center space-y-4">
                <h2 className="text-5xl sm:text-7xl font-black text-foreground tracking-tighter leading-none uppercase">
                   SELECT <br /> <span className="serif-italic font-normal text-primary lowercase">the</span> STYLE.
                </h2>
                <div className="flex items-center justify-center gap-4 text-foreground/30">
                  <div className="w-8 h-px bg-current" />
                  <span className="text-[9px] font-black uppercase tracking-[0.6em]">Denim Series No. 01</span>
                  <div className="w-8 h-px bg-current" />
                </div>
              </div>
              <FrameSelector 
                selectedFrame={selectedFrame} 
                onSelect={handleFrameSelect} 
              />
            </motion.div>
          )}

          {step === 'camera' && (
            <motion.div
              key="camera"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full flex flex-col gap-12"
            >
              <CameraView 
                onCapture={handleCapture} 
                isCapturing={false} 
              />
              
              <div className="flex justify-center">
                <button 
                  onClick={() => setStep('selection')}
                  className="group flex items-center gap-3 text-[10px] font-black text-foreground/40 hover:text-primary transition-all uppercase tracking-[0.4em]"
                >
                  <ArrowLeft className="w-3 h-3 transition-transform group-hover:-translate-x-1" />
                  Change Layout
                </button>
              </div>
            </motion.div>
          )}

          {step === 'preview' && capturedImage && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full"
            >
              <PhotoPreview 
                capturedImage={capturedImage}
                frameUrl={selectedFrame.url}
                onRetake={handleRetake}
                onDownload={handleDownload}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Editorial Decorative Side Text */}
      <div className="absolute right-12 bottom-12 hidden lg:block">
        <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-[0.6em] text-foreground/10 rotate-90 origin-right">
           <span>NORTHVOWS STUDIO</span>
           <div className="w-8 h-px bg-current" />
           <span>2026 ARCHIVE</span>
        </div>
      </div>
    </main>
  );
}
