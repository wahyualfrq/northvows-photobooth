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
  const [isMirrored, setIsMirrored] = useState(true); // Default to mirrored as per webcam
  const [isProcessing, setIsProcessing] = useState(true);

  // Initial merge and re-merge on toggle
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
    <div className="flex flex-col items-center gap-8 w-full max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border-8 border-white bg-white"
      >
        {isProcessing && !currentImage ? (
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <RefreshCcw className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img 
            src={currentImage || ''} 
            alt="Photobooth Result" 
            className={cn(
              "w-full h-full object-contain transition-opacity duration-200",
              isProcessing ? "opacity-50" : "opacity-100"
            )}
          />
        )}
      </motion.div>

      <div className="grid grid-cols-3 gap-3 w-full">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleFlip}
          disabled={isProcessing}
          className={cn(
            "flex flex-col items-center justify-center gap-1 py-3 px-2 rounded-2xl border-2 border-border font-medium transition-colors hover:bg-muted",
            !isMirrored && "bg-primary/5 border-primary/30"
          )}
        >
          <FlipHorizontal className="w-5 h-5 text-primary" />
          <span className="text-[10px] uppercase tracking-wider">
            {isMirrored ? 'Normal' : 'Mirror'}
          </span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onRetake}
          className="flex flex-col items-center justify-center gap-1 py-3 px-2 rounded-2xl border-2 border-border font-medium transition-colors hover:bg-muted"
        >
          <RefreshCcw className="w-5 h-5 text-primary" />
          <span className="text-[10px] uppercase tracking-wider">Retake</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => currentImage && onDownload(currentImage)}
          disabled={isProcessing || !currentImage}
          className="flex flex-col items-center justify-center gap-1 py-3 px-2 rounded-2xl bg-primary text-primary-foreground font-medium transition-colors hover:bg-primary/90 col-span-1 disabled:opacity-50"
        >
          <Download className="w-5 h-5" />
          <span className="text-[10px] uppercase tracking-wider">Save</span>
        </motion.button>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        All processing is done in your browser. <br/> No photos are stored on our servers.
      </p>
    </div>
  );
}
