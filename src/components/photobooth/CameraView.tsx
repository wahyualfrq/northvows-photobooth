'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, RefreshCcw } from 'lucide-react';
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
      setTimeout(() => setFlash(false), 200);

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
    <div className="w-full max-w-[500px] mx-auto space-y-12">
      {/* Editorial Camera Container */}
      <div className="relative aspect-square w-full editorial-card rounded-sm overflow-hidden p-2 bg-white">
        <div className="w-full h-full overflow-hidden bg-muted/20 relative">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/png"
            videoConstraints={{ ...videoConstraints, facingMode }}
            mirrored={facingMode === "user"}
            className="w-full h-full object-cover"
          />

          {/* Flash */}
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

          {/* Countdown */}
          <AnimatePresence>
            {countdown !== null && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center z-40 bg-black/5 backdrop-blur-[2px]"
              >
                <motion.span 
                  key={countdown}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-9xl font-black text-white drop-shadow-2xl font-serif italic"
                >
                  {countdown === 0 ? "!" : countdown}
                </motion.span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Minimal Label Overlay */}
        <div className="absolute top-6 right-6 px-3 py-1 bg-black/10 backdrop-blur-md rounded-full text-[8px] font-black uppercase tracking-[0.4em] text-white">
          Studio Session Live
        </div>
      </div>

      {/* Shutter Controls */}
      <div className="flex justify-center items-center gap-10">
        <motion.button
          whileHover={{ scale: 1.1, rotate: 180 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleCamera}
          className="p-4 rounded-full text-foreground/40 hover:text-primary hover:bg-primary/5 transition-all"
        >
          <RefreshCcw className="w-5 h-5" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          disabled={countdown !== null || isCapturing}
          onClick={startCapture}
          className={cn(
            "relative w-24 h-24 rounded-full border-2 border-primary flex items-center justify-center p-2 group transition-all",
            (countdown !== null || isCapturing) && "opacity-50 grayscale cursor-not-allowed"
          )}
        >
          <div className="w-full h-full rounded-full bg-primary flex items-center justify-center text-primary-foreground group-hover:scale-95 transition-transform duration-500 shadow-xl shadow-primary/20">
            <Camera className="w-8 h-8" />
          </div>
        </motion.button>

        <div className="w-[60px]" /> {/* Layout Balancer */}
      </div>
    </div>
  );
}
