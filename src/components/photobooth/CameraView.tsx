'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, RefreshCcw, Zap } from 'lucide-react';
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
      // Trigger flash effect
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
    <div className="relative w-full aspect-square max-w-[520px] mx-auto overflow-hidden rounded-3xl bg-muted border-4 border-white shadow-2xl">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/png"
        videoConstraints={{ ...videoConstraints, facingMode }}
        mirrored={facingMode === "user"}
        className="w-full h-full object-cover"
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
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
            key={countdown}
            className="absolute inset-0 flex items-center justify-center z-40"
          >
            <span className="text-8xl font-bold text-white drop-shadow-2xl">
              {countdown === 0 ? "STAY!" : countdown}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Camera Controls Overlay */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center gap-6 px-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleCamera}
          className="p-3 rounded-full bg-black/20 backdrop-blur-md text-white border border-white/20"
        >
          <RefreshCcw className="w-6 h-6" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          disabled={countdown !== null || isCapturing}
          onClick={startCapture}
          className={cn(
            "p-5 rounded-full bg-white text-black shadow-xl border-4 border-black/5",
            (countdown !== null || isCapturing) && "opacity-50 cursor-not-allowed"
          )}
        >
          <Camera className="w-8 h-8" />
        </motion.button>

        <div className="p-3 w-12 h-12" /> {/* Spacer */}
      </div>
    </div>
  );
}
