'use client';

import { motion } from 'framer-motion';
import { Download, RefreshCcw, FlipHorizontal } from 'lucide-react';
import { useState, useEffect } from 'react';
import { mergeImageWithFrame } from '@/lib/canvas';
import { cn } from '@/lib/utils';

interface PhotoPreviewProps {
  capturedImage: string;
  frameUrl: string;
  onRetake: () => void;
  onDownload: (finalImage: string) => void;
}

export default function PhotoPreview({ capturedImage, frameUrl, onRetake, onDownload }: PhotoPreviewProps) {
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [isMirrored, setIsMirrored] = useState(true);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const processImage = async () => {
      setIsProcessing(true);
      try {
        const merged = await mergeImageWithFrame(capturedImage, frameUrl, isMirrored);
        setCurrentImage(merged);
      } catch (err) {
        console.error('Failed to process image:', err);
      } finally {
        setIsProcessing(false);
      }
    };
    processImage();
  }, [capturedImage, frameUrl, isMirrored]);

  return (
    <div className="flex flex-col items-center gap-12 w-full max-w-lg mx-auto">
      <div className="text-center space-y-4">
        <div className="text-[10px] font-black text-primary/40 uppercase tracking-[0.6em]">Session Complete</div>
        <h2 className="text-4xl sm:text-5xl font-black text-foreground tracking-tighter leading-none">
          THE <span className="serif-italic font-normal text-primary">Result</span>
        </h2>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98, rotate: -1 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        className="relative w-full aspect-[3/4] editorial-card p-3 sm:p-5 rounded-sm bg-white"
      >
        <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 tape-accent-minimal opacity-40" />

        <div className="w-full h-full bg-muted/20 relative overflow-hidden">
          {isProcessing && !currentImage ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <RefreshCcw className="w-8 h-8 animate-spin text-primary/20" />
            </div>
          ) : (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img 
              src={currentImage || ''} 
              alt="Result" 
              className={cn(
                "w-full h-full object-contain transition-opacity duration-500",
                isProcessing ? "opacity-50" : "opacity-100"
              )}
            />
          )}
        </div>
      </motion.div>

      <div className="grid grid-cols-3 gap-6 w-full">
        <motion.button
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsMirrored(!isMirrored)}
          disabled={isProcessing}
          className={cn(
            "flex flex-col items-center justify-center gap-3 py-6 px-4 rounded-full border border-border soft-transition",
            !isMirrored ? "bg-primary text-white border-primary" : "bg-white text-foreground/60 hover:bg-muted"
          )}
        >
          <FlipHorizontal className="w-5 h-5" />
          <span className="text-[9px] font-black uppercase tracking-[0.2em]">{isMirrored ? 'Normal' : 'Mirrored'}</span>
        </motion.button>

        <motion.button
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRetake}
          className="flex flex-col items-center justify-center gap-3 py-6 px-4 rounded-full border border-border bg-white text-foreground/60 hover:bg-muted soft-transition"
        >
          <RefreshCcw className="w-5 h-5" />
          <span className="text-[9px] font-black uppercase tracking-[0.2em]">Retake</span>
        </motion.button>

        <motion.button
          whileHover={{ y: -4, backgroundColor: '#24344D' }}
          whileTap={{ scale: 0.95 }}
          onClick={() => currentImage && onDownload(currentImage)}
          disabled={isProcessing || !currentImage}
          className="flex flex-col items-center justify-center gap-3 py-6 px-4 rounded-full bg-primary text-white shadow-xl shadow-primary/20 soft-transition disabled:opacity-50"
        >
          <Download className="w-5 h-5" />
          <span className="text-[9px] font-black uppercase tracking-[0.2em]">Archive</span>
        </motion.button>
      </div>
      
      <p className="text-[9px] font-black text-foreground/20 uppercase tracking-[0.4em] text-center">
        Editorial Memory • Seoul Studio Session • 2026
      </p>
    </div>
  );
}
