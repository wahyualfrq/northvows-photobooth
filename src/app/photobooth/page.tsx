'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import FrameSelector from '@/components/photobooth/FrameSelector';
import CameraView from '@/components/photobooth/CameraView';
import PhotoPreview from '@/components/photobooth/PhotoPreview';
import { frames } from '@/data/frames';
import { Frame } from '@/types';
import { mergeImageWithFrame } from '@/lib/canvas';

export default function PhotoboothPage() {
  const [step, setStep] = useState<'selection' | 'camera' | 'preview'>('selection');
  const [selectedFrame, setSelectedFrame] = useState<Frame>(frames[0]);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [mergedImage, setMergedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

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
    setMergedImage(null);
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
    <main className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="p-6 flex items-center justify-between max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-4">
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-full hover:bg-muted transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </motion.button>
          </Link>
          <h1 className="text-xl font-bold tracking-tight">NORTHVOWS</h1>
        </div>
        
        <div className="hidden sm:block">
          <span className="text-sm font-medium px-4 py-1.5 rounded-full bg-muted border border-border">
            {step === 'selection' && 'Choose Frame'}
            {step === 'camera' && 'Strike a Pose'}
            {step === 'preview' && 'Ready!'}
          </span>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-5xl mx-auto w-full gap-8">
        <AnimatePresence mode="wait">
          {step === 'selection' && (
            <motion.div
              key="selection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full flex flex-col gap-12"
            >
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-2">Pick your aesthetic</h2>
                <p className="text-muted-foreground text-lg">Choose a frame that matches your mood</p>
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
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="w-full flex flex-col gap-8"
            >
              <CameraView 
                onCapture={handleCapture} 
                isCapturing={isProcessing} 
              />
              
              <div className="flex justify-center">
                <button 
                  onClick={() => setStep('selection')}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                >
                  Change Frame
                </button>
              </div>
            </motion.div>
          )}

          {step === 'preview' && capturedImage && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
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

      {/* Footer / Step Indicator */}
      <footer className="p-8 flex justify-center mt-auto">
        <div className="flex gap-2">
          {['selection', 'camera', 'preview'].map((s) => (
            <div 
              key={s}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                step === s ? 'bg-primary w-6' : 'bg-muted-foreground/30'
              }`}
            />
          ))}
        </div>
      </footer>
    </main>
  );
}
