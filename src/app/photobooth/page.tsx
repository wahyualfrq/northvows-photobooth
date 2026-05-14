'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sparkles, Heart } from 'lucide-react';
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
      {/* Decorative background doodles */}
      <div className="absolute top-[5%] right-[5%] text-primary/5 -z-10 rotate-12">
         <Sparkles size={120} />
      </div>
      <div className="absolute bottom-[5%] left-[5%] text-brown/5 -z-10 -rotate-12">
         <Heart size={100} fill="currentColor" />
      </div>

      {/* Header */}
      <header className="p-6 sm:p-10 flex items-center justify-between max-w-6xl mx-auto w-full z-10">
        <div className="flex items-center gap-6">
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.1, x: -4 }}
              whileTap={{ scale: 0.9 }}
              className="p-3 rounded-full bg-white border border-border shadow-sm hover:shadow-md transition-all text-primary"
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
          </Link>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold tracking-[0.2em] text-primary">NORTHVOWS</h1>
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest opacity-60">Digital Studio</span>
          </div>
        </div>
        
        <div className="hidden sm:flex items-center gap-3">
          <div className="h-px w-8 bg-border" />
          <span className="text-[10px] font-bold text-brown/70 uppercase tracking-[0.3em]">
            {step === 'selection' && 'Step 01: Frame'}
            {step === 'camera' && 'Step 02: Capture'}
            {step === 'preview' && 'Step 03: Memory'}
          </span>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:pb-20 max-w-5xl mx-auto w-full gap-10 z-10">
        <AnimatePresence mode="wait">
          {step === 'selection' && (
            <motion.div
              key="selection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
              className="w-full flex flex-col gap-12"
            >
              <div className="text-center space-y-3">
                <h2 className="text-4xl font-bold text-foreground font-serif italic">Choose your mood</h2>
                <p className="text-muted-foreground text-sm uppercase tracking-widest font-medium">Select a collectible layout for your story</p>
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
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.6 }}
              className="w-full flex flex-col gap-10"
            >
              <CameraView 
                onCapture={handleCapture} 
                isCapturing={false} 
              />
              
              <div className="flex justify-center">
                <button 
                  onClick={() => setStep('selection')}
                  className="text-[10px] font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-[0.3em] px-4 py-2 rounded-full border border-border/50 bg-white shadow-sm"
                >
                  ← Back to frames
                </button>
              </div>
            </motion.div>
          )}

          {step === 'preview' && capturedImage && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
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

      {/* Footer Step Indicator */}
      <footer className="p-10 flex justify-center mt-auto">
        <div className="flex gap-4">
          {['selection', 'camera', 'preview'].map((s, i) => (
            <div key={s} className="flex flex-col items-center gap-2">
              <div 
                className={cn(
                  "h-1.5 rounded-full transition-all duration-700",
                  step === s ? 'bg-primary w-12' : 'bg-border w-4'
                )}
              />
            </div>
          ))}
        </div>
      </footer>
    </main>
  );
}
