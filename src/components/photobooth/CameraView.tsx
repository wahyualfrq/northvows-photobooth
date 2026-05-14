import { useState, useCallback, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, RefreshCcw, Sparkles, Layout as LayoutIcon, Wand2, Filter, FlipHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Frame, Layout } from '@/types';
import { layouts } from '@/data/layouts';

interface CameraViewProps {
  onComplete: (photos: string[]) => void;
  selectedLayout: Layout;
  selectedFrame: Frame;
  onLayoutChange: (layout: Layout) => void;
}

const filters = [
  { id: 'none', name: 'Original', class: '' },
  { id: 'cloudy', name: 'Cloudy Blue', class: 'brightness-[1.1] saturate-[0.8] hue-rotate-[10deg]' },
  { id: 'vintage', name: 'Vintage Fade', class: 'sepia-[0.2] contrast-[0.9] brightness-[1.1]' },
  { id: 'film', name: 'Soft Film', class: 'contrast-[0.8] brightness-[1.05] saturate-[0.9]' },
  { id: 'denim', name: 'Cool Denim', class: 'saturate-[0.7] hue-rotate-[-10deg] brightness-[1.05]' },
  { id: 'diary', name: 'Warm Diary', class: 'sepia-[0.3] saturate-[1.2] brightness-[0.95]' },
];

export default function CameraView({ onComplete, selectedLayout, selectedFrame, onLayoutChange }: CameraViewProps) {
  const webcamRef = useRef<Webcam>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [flash, setFlash] = useState(false);
  const [activeFilter, setActiveFilter] = useState(filters[0]);
  
  const [isMirrored, setIsMirrored] = useState(true);
  
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const totalShots = selectedLayout.rows * selectedLayout.cols;

  const toggleMirror = () => {
    setIsMirrored(prev => !prev);
  };

  const takeNextShot = useCallback(async () => {
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
        setCapturedPhotos(prev => [...prev, imageSrc]);
      }
      setCountdown(null);
    }
  }, [countdown]);

  // Handle sequence logic
  useEffect(() => {
    if (isCapturing && capturedPhotos.length < totalShots && countdown === null) {
      const delay = capturedPhotos.length === 0 ? 0 : 1500;
      const timer = setTimeout(() => takeNextShot(), delay);
      return () => clearTimeout(timer);
    }

    if (capturedPhotos.length === totalShots && isCapturing) {
      setIsCapturing(false);
      setTimeout(() => onComplete(capturedPhotos), 1000);
    }
  }, [isCapturing, capturedPhotos.length, totalShots, countdown, takeNextShot, onComplete, capturedPhotos]);

  const toggleCamera = () => {
    setFacingMode(prev => prev === "user" ? "environment" : "user");
  };

  const startSession = () => {
    setCapturedPhotos([]);
    setIsCapturing(true);
  };

  return (
    <div className="w-full flex flex-col lg:flex-row gap-16 items-start justify-start lg:pl-20">
      {/* Left Column: Cinematic Camera Preview */}
      <div className="w-full max-w-[500px] space-y-8 mt-12">
        <div className="relative aspect-[4/4.2] w-full flex items-center justify-center">
          {/* Main Camera Body Frame */}
          <img 
            src="/images/CameraPict.webp" 
            alt="Vintage Camera Body" 
            className="absolute inset-0 w-full h-full object-contain z-10 pointer-events-none scale-[1.15]"
          />

          {/* LCD Screen Area (Webcam Feed) */}
          <div className="absolute top-[44.4%] left-[28.8%] right-[12.8%] bottom-[11.8%] z-0 bg-black overflow-hidden shadow-inner">
            <div className="w-full h-full relative">
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/png"
                videoConstraints={{ width: 1080, height: 1440, facingMode }}
                mirrored={isMirrored}
                className={cn("w-full h-full object-cover transition-all duration-700", activeFilter.class)}
              />

              {/* Session Overlay Inside LCD */}
              <div className="absolute inset-0 pointer-events-none p-2 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                   <div className="flex flex-col">
                      <span className="text-[6px] font-black text-white uppercase tracking-[0.2em]">Studio</span>
                      <span className="text-[5px] font-bold text-white/60 uppercase tracking-[0.1em]">NorthVows</span>
                   </div>
                   <div className="flex items-center gap-1">
                      <div className="w-1 h-1 bg-red-500 rounded-full animate-pulse" />
                      <span className="text-[6px] font-black text-red-500 uppercase tracking-widest">Rec</span>
                   </div>
                </div>
              </div>

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

              {/* Countdown Animation Inside LCD */}
              <AnimatePresence>
                {countdown !== null && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center z-40 bg-black/20 backdrop-blur-[2px]"
                  >
                    <motion.div 
                      key={countdown}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.5 }}
                      className="text-4xl font-black text-white drop-shadow-lg font-serif italic"
                    >
                      {countdown === 0 ? "!" : countdown}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Shutter & Basic Controls - Adjusted lower */}
        <div className="flex justify-center items-center gap-8 mt-4">
          <motion.button
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleCamera}
            disabled={isCapturing}
            className="p-3 rounded-full text-[#24344D]/30 hover:text-secondary hover:bg-white transition-all shadow-sm disabled:opacity-20"
          >
            <RefreshCcw className="w-4 h-4" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            disabled={isCapturing}
            onClick={startSession}
            className={cn(
              "relative w-20 h-20 rounded-full border-[3px] border-secondary flex items-center justify-center p-2 group transition-all",
              isCapturing && "opacity-50 grayscale cursor-not-allowed"
            )}
          >
            <div className="w-full h-full rounded-full bg-secondary flex items-center justify-center text-white group-hover:scale-95 transition-transform duration-500 shadow-2xl shadow-secondary/40">
              <Camera className="w-8 h-8" />
            </div>
            {/* Pulsing Ring when ready */}
            {!isCapturing && (
               <div className="absolute inset-[-6px] border-2 border-secondary/20 rounded-full animate-ping pointer-events-none" />
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleMirror}
            disabled={isCapturing}
            className={cn(
              "p-3 rounded-full transition-all shadow-sm disabled:opacity-20",
              isMirrored ? "text-secondary bg-secondary/10" : "text-[#24344D]/30 hover:text-secondary hover:bg-white"
            )}
          >
            <FlipHorizontal className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* Middle Column: Live Shot Preview Grid */}
      <div className="hidden xl:flex flex-col gap-6 pt-6">
        <div className="flex items-center gap-3">
          <Sparkles size={16} className="text-[#AFCDF5]" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#24344D]/40">Live Feed</span>
        </div>
        <div 
          className="grid gap-2"
          style={{ 
            gridTemplateColumns: `repeat(${selectedLayout.cols}, minmax(0, 1fr))`,
            width: selectedLayout.cols * 80 + 'px'
          }}
        >
          {Array.from({ length: totalShots }).map((_, i) => (
            <div 
              key={i} 
              className={cn(
                "aspect-[3/4] bg-white rounded-lg border-2 overflow-hidden transition-all duration-500",
                capturedPhotos[i] ? "border-secondary/40 shadow-lg" : "border-dashed border-[#24344D]/10 bg-[#FAF8F4]/50"
              )}
              style={{ width: '80px' }}
            >
              {capturedPhotos[i] ? (
                <motion.img 
                  initial={{ scale: 1.2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  src={capturedPhotos[i]} 
                  className={cn("w-full h-full object-cover", activeFilter.class)}
                  alt={`Shot ${i + 1}`}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-[10px] font-black text-[#24344D]/10">{i + 1}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Right Column: Immersive Tools */}
      <div className="w-full lg:w-72 space-y-10 pt-6">
        {/* Layout Switcher */}
        <div className="space-y-5">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <LayoutIcon size={16} className="text-secondary" />
                 <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#24344D]/40">Layout Grid</span>
              </div>
           </div>
           <div className="grid grid-cols-3 gap-2.5">
              {layouts.map((l) => (
                <button
                  key={l.id}
                  disabled={isCapturing}
                  onClick={() => onLayoutChange(l)}
                  className={cn(
                    "aspect-square rounded-xl border-2 flex flex-col items-center justify-center gap-1.5 transition-all duration-500",
                    selectedLayout.id === l.id 
                      ? "border-secondary bg-white text-secondary shadow-xl shadow-secondary/10 scale-105" 
                      : "border-transparent bg-white/40 text-[#24344D]/30 hover:bg-white/60"
                  )}
                >
                  <div className="w-4 h-6 border-[1.5px] border-current opacity-40 rounded-[1px]" />
                  <span className="text-[9px] font-black">{l.id}</span>
                </button>
              ))}
           </div>
        </div>

        {/* Cinematic Filters */}
        <div className="space-y-5">
           <div className="flex items-center gap-3">
              <Filter size={16} className="text-secondary" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#24344D]/40">Studio Filters</span>
           </div>
           <div className="grid grid-cols-2 gap-2.5">
              {filters.map((f) => (
                <button
                  key={f.id}
                  disabled={isCapturing}
                  onClick={() => setActiveFilter(f)}
                  className={cn(
                    "px-3 py-3.5 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all duration-300 text-center",
                    activeFilter.id === f.id 
                      ? "bg-secondary text-white shadow-xl shadow-secondary/20" 
                      : "bg-white/40 text-[#24344D]/50 hover:bg-white/80"
                  )}
                >
                  {f.name}
                </button>
              ))}
           </div>
        </div>

        {/* Aesthetic Effects */}
        <div className="space-y-5">
           <div className="flex items-center gap-3">
              <Wand2 size={16} className="text-secondary" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#24344D]/40">Enhancements</span>
           </div>
           <div className="flex flex-col gap-2.5">
              {['Retro Grain', 'Date Stamp'].map((effect) => (
                <div 
                  key={effect}
                  className="flex items-center justify-between p-4 bg-white/40 rounded-xl border border-white/60 hover:bg-white transition-all cursor-pointer group"
                >
                  <span className="text-[9px] font-black uppercase tracking-widest text-[#24344D]/60">{effect}</span>
                  <div className={cn(
                    "w-8 h-4 rounded-full relative transition-colors duration-500",
                    effect === 'Date Stamp' ? "bg-secondary/20" : "bg-[#24344D]/5"
                  )}>
                    <div className={cn(
                      "absolute top-0.5 w-3 h-3 rounded-full transition-all duration-500",
                      effect === 'Date Stamp' ? "right-0.5 bg-secondary shadow-lg" : "left-0.5 bg-[#24344D]/20"
                    )} />
                  </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
