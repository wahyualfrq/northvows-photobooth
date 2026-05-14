'use client';

import { motion } from 'framer-motion';
import { Download, RefreshCcw, FlipHorizontal, Heart } from 'lucide-react';
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

  const handleFlip = () => {
    setIsMirrored(!isMirrored);
  };

  return (
    <div className="flex flex-col items-center gap-10 w-full max-w-md mx-auto">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold font-serif italic text-primary">Sweet Moment Captured!</h2>
        <p className="text-sm text-muted-foreground">Ready to keep this memory forever?</p>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden scrapbook-card border-[12px] border-white shadow-2xl group"
      >
        {/* Tape Decor */}
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-16 h-6 bg-primary/10 rotate-[2deg] z-10" />

        {isProcessing && !currentImage ? (
          <div className="absolute inset-0 flex items-center justify-center bg-accent/30">
            <RefreshCcw className="w-8 h-8 animate-spin text-secondary" />
          </div>
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img 
            src={currentImage || ''} 
            alt="Photobooth Result" 
            className={cn(
              "w-full h-full object-contain transition-opacity duration-300",
              isProcessing ? "opacity-50" : "opacity-100"
            )}
          />
        )}

        {/* Floating Heart Decor */}
        <div className="absolute bottom-6 right-6 text-primary/30 opacity-0 group-hover:opacity-100 transition-opacity">
          <Heart size={24} fill="currentColor" />
        </div>
      </motion.div>

      <div className="grid grid-cols-3 gap-4 w-full px-2">
        <motion.button
          whileHover={{ y: -4, backgroundColor: 'rgba(53, 92, 138, 0.05)' }}
          whileTap={{ scale: 0.95 }}
          onClick={handleFlip}
          disabled={isProcessing}
          className={cn(
            "flex flex-col items-center justify-center gap-2 py-4 px-2 rounded-2xl border-2 soft-transition",
            !isMirrored ? "bg-primary/5 border-primary" : "border-border bg-white"
          )}
        >
          <FlipHorizontal className={cn("w-5 h-5", !isMirrored ? "text-primary" : "text-muted-foreground")} />
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Mirror</span>
        </motion.button>

        <motion.button
          whileHover={{ y: -4, backgroundColor: 'rgba(53, 92, 138, 0.05)' }}
          whileTap={{ scale: 0.95 }}
          onClick={onRetake}
          className="flex flex-col items-center justify-center gap-2 py-4 px-2 rounded-2xl border-2 border-border bg-white soft-transition"
        >
          <RefreshCcw className="w-5 h-5 text-muted-foreground" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Retake</span>
        </motion.button>

        <motion.button
          whileHover={{ y: -4, scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => currentImage && onDownload(currentImage)}
          disabled={isProcessing || !currentImage}
          className="flex flex-col items-center justify-center gap-2 py-4 px-2 rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 soft-transition disabled:opacity-50"
        >
          <Download className="w-5 h-5" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Save</span>
        </motion.button>
      </div>

      <div className="p-4 rounded-xl bg-accent/30 border border-border/50 text-center">
        <p className="text-[10px] leading-relaxed text-brown/70 font-medium uppercase tracking-widest">
          Memory preserved in your browser • Local processing only
        </p>
      </div>
    </div>
  );
}
