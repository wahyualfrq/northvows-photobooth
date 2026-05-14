'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCcw, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CameraViewProps {
  onCapture: (imageSrc: string) => void;
  isCapturing: boolean;
}

const videoConstraints = {
  width: 720,
  height: 720,
  facingMode: "user",
};

export default function CameraView({ onCapture, isCapturing }: CameraViewProps) {
  const webcamRef = useRef<Webcam>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [flash, setFlash] = useState(false);

  const startCapture = useCallback(() => {
    setCountdown(3);
  }, []);

  useEffect(() => {
    if (countdown === null) return;

    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }

    if (countdown === 0) {
      setFlash(true);
      setTimeout(() => setFlash(false), 300);

      const imageSrc = webcamRef.current?.getScreenshot();
      if (imageSrc) {
        onCapture(imageSrc);
      }
      setCountdown(null);
    }
  }, [countdown, onCapture]);

  const toggleCamera = () => {
    setFacingMode(prev => prev === "user" ? "environment" : "user");
  };

  return (
    <div className="relative w-full aspect-square max-w-[500px] mx-auto group">
      {/* Decorative Tape Corners */}
      <div className="absolute -top-3 -left-3 w-12 h-6 bg-secondary/20 rotate-[-45deg] z-10 rounded-sm" />
      <div className="absolute -top-3 -right-3 w-12 h-6 bg-secondary/20 rotate-[45deg] z-10 rounded-sm" />
      
      {/* Main Camera Container */}
      <div className="relative w-full h-full overflow-hidden rounded-[40px] scrapbook-card border-[12px] border-white shadow-2xl">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/png"
          videoConstraints={{ ...videoConstraints, facingMode }}
          mirrored={facingMode === "user"}
          className="w-full h-full object-cover grayscale-[0.1] contrast-[1.1]"
        />

        {/* Flash Effect */}
        <AnimatePresence>
          {flash && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white z-50"
            />
          )}
        </AnimatePresence>

        {/* Countdown Overlay */}
        <AnimatePresence>
          {countdown !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center z-40 bg-primary/20 backdrop-blur-sm"
            >
              <motion.span 
                key={countdown}
                initial={{ scale: 0.5, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="text-9xl font-bold text-white drop-shadow-lg font-serif italic"
              >
                {countdown === 0 ? "♥" : countdown}
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Soft Vignette */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-black/10" />
      </div>

      {/* Camera Controls - Floating Style */}
      <div className="mt-10 flex justify-center items-center gap-8">
        <motion.button
          whileHover={{ scale: 1.1, rotate: 180 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleCamera}
          className="p-4 rounded-full bg-accent text-primary border border-border/50 shadow-sm transition-all"
        >
          <RefreshCcw className="w-5 h-5" />
        </motion.button>

        <div className="relative group/btn">
          <div className="absolute inset-[-12px] rounded-full border-2 border-primary/20 scale-100 group-hover/btn:scale-110 transition-transform duration-500" />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            disabled={countdown !== null || isCapturing}
            onClick={startCapture}
            className={cn(
              "relative w-20 h-20 rounded-full flex items-center justify-center transition-all",
              "bg-primary text-primary-foreground shadow-xl shadow-primary/30",
              (countdown !== null || isCapturing) && "opacity-50 cursor-not-allowed grayscale"
            )}
          >
            <div className="w-16 h-16 rounded-full border-2 border-primary-foreground/20 flex items-center justify-center">
               <Sparkles className="w-8 h-8" />
            </div>
          </motion.button>
        </div>

        <div className="w-[52px]" /> {/* Spacer to balance the layout */}
      </div>
    </div>
  );
}
