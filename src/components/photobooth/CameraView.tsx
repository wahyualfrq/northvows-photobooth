import { useState, useCallback, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, RefreshCcw, Layout as LayoutIcon, Wand2, Filter, FlipHorizontal, Timer, Image, X, ArrowRight } from 'lucide-react';
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
  const [timerDuration, setTimerDuration] = useState(3);
  const [retroGrain, setRetroGrain] = useState(false);
  const [dateStamp, setDateStamp] = useState(true);
  
  const [isMirrored, setIsMirrored] = useState(true);
  
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [retakeIndex, setRetakeIndex] = useState<number | null>(null);
  const [showUploadPrompt, setShowUploadPrompt] = useState(false);
  const totalShots = selectedLayout.rows * selectedLayout.cols;

  const toggleMirror = () => {
    setIsMirrored(prev => !prev);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files);
    
    // 1. Validate Formats
    const validFormats = ['image/png', 'image/jpeg', 'image/jpg'];
    const hasInvalidFile = fileArray.some(file => !validFormats.includes(file.type));
    
    if (hasInvalidFile) {
      alert("Format file tidak didukung! Harap pilih gambar dengan format .png, .jpg, atau .jpeg");
      e.target.value = '';
      return;
    }

    // 2. Validate Count
    if (fileArray.length !== totalShots) {
      alert(`Jumlah gambar tidak sesuai! Anda harus memilih tepat ${totalShots} gambar untuk layout ini.`);
      e.target.value = '';
      return;
    }

    const readers = fileArray.map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then(images => {
      setCapturedPhotos(images);
      setIsReviewing(true);
    });
  };

  const takeNextShot = useCallback(async () => {
    setCountdown(timerDuration);
  }, [timerDuration]);

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
        setCapturedPhotos(prev => {
          if (retakeIndex !== null) {
            const next = [...prev];
            next[retakeIndex] = imageSrc;
            return next;
          }
          return [...prev, imageSrc];
        });
      }
      setCountdown(null);
      setRetakeIndex(null);
      if (retakeIndex !== null) setIsCapturing(false);
    }
  }, [countdown]);

  // Handle sequence logic
  useEffect(() => {
    if (isCapturing && capturedPhotos.length < totalShots && countdown === null && retakeIndex === null) {
      const delay = capturedPhotos.length === 0 ? 0 : 1500;
      const timer = setTimeout(() => takeNextShot(), delay);
      return () => clearTimeout(timer);
    }

    if (capturedPhotos.length === totalShots && isCapturing && retakeIndex === null) {
      setIsCapturing(false);
      setIsReviewing(true);
    }
  }, [isCapturing, capturedPhotos.length, totalShots, countdown, takeNextShot, onComplete, capturedPhotos, retakeIndex]);

  const handleRetake = (index: number) => {
    setRetakeIndex(index);
    setIsCapturing(true);
    takeNextShot();
  };

  const toggleCamera = () => {
    setFacingMode(prev => prev === "user" ? "environment" : "user");
  };

  const startSession = () => {
    setCapturedPhotos([]);
    setIsCapturing(true);
  };

  return (
    <div className="w-full flex flex-col lg:flex-row gap-16 items-start justify-start lg:pl-4">
      {/* Left Column: Cinematic Camera Preview */}
      <div className="w-full max-w-[600px] space-y-20 mt-16 lg:-ml-26">
        <div className="relative aspect-[4/4.2] w-full flex items-center justify-center">
          {/* Main Camera Body Frame */}
          <img 
            src="/images/CameraPict.webp" 
            alt="Vintage Camera Body" 
            className="absolute inset-0 w-full h-full object-contain z-10 pointer-events-none scale-[1.3]"
          />

          {/* LCD Screen Area (Webcam Feed) */}
          <div className="absolute top-[13%] left-[-2%] right-[17%] bottom-[11%] z-0 bg-black overflow-hidden shadow-inner">
            <div className="w-full h-full relative">
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/png"
                videoConstraints={{ width: 1080, height: 1440, facingMode }}
                mirrored={isMirrored}
                className={cn("w-full h-full object-cover transition-all duration-700", activeFilter.class)}
              />

              {/* Retro Grain Effect */}
              {retroGrain && (
                <div className="absolute inset-0 pointer-events-none opacity-40 mix-blend-overlay z-10 animate-grain" 
                     style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/natural-paper.png")' }} />
              )}

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

                 {/* Date Stamp Overlay */}
                 {dateStamp && (
                   <div className="flex flex-col items-end">
                      <span className="text-[10px] font-mono text-orange-500/80 drop-shadow-[0_0_2px_rgba(249,115,22,0.5)] font-bold tracking-widest">
                        {new Date().toLocaleDateString('en-US', { year: '2-digit', month: '2-digit', day: '2-digit' }).replace(/\//g, ' ')}
                      </span>
                   </div>
                 )}
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

        {/* Shutter & Basic Controls */}
        <div className="flex justify-center items-center gap-8 -mt-12 relative z-20">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowUploadPrompt(true)}
            disabled={isCapturing}
            className="p-3 rounded-full text-[#24344D]/30 hover:text-secondary hover:bg-white transition-all shadow-sm disabled:opacity-20"
          >
            <Image className="w-4 h-4" />
            <input 
              id="gallery-upload"
              type="file" 
              accept="image/*" 
              multiple 
              className="hidden" 
              onChange={handleUpload}
            />
          </motion.button>

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

      {/* Right side container for Live Feed, Tools and Filters */}
      <div className="flex-1 flex flex-col gap-12 lg:ml-16">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          {/* Middle Column: Live Shot Preview Grid */}
          <div className="hidden xl:flex flex-col gap-6 pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#24344D]/40">Live Feed</span>
              </div>
              {isReviewing && capturedPhotos.length === totalShots && (
                <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                   <span className="text-[8px] font-black uppercase text-green-600/70 tracking-widest">Reviewing</span>
                </div>
              )}
            </div>
            
            <div 
              className="grid gap-3"
              style={{ 
                gridTemplateColumns: `repeat(${selectedLayout.cols}, minmax(0, 1fr))`,
                width: selectedLayout.cols * 100 + 'px'
              }}
            >
              {Array.from({ length: totalShots }).map((_, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "aspect-[3/4] bg-white rounded-xl border-2 overflow-hidden relative group transition-all duration-500",
                    capturedPhotos[i] ? "border-white shadow-md" : "border-dashed border-[#24344D]/10 bg-[#FAF8F4]/50"
                  )}
                  style={{ width: '100px' }}
                >
                  {capturedPhotos[i] ? (
                    <>
                      <motion.img 
                        initial={{ scale: 1.2, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        src={capturedPhotos[i]} 
                        className={cn("w-full h-full object-cover", activeFilter.class)}
                        alt={`Shot ${i + 1}`}
                      />
                      
                      {/* Retake Overlay on Hover */}
                      {!isCapturing && (
                        <div className="absolute inset-0 bg-secondary/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center p-2">
                           <button
                             onClick={() => handleRetake(i)}
                             className="w-full py-2 bg-white text-secondary text-[8px] font-black uppercase tracking-widest rounded-lg shadow-xl transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 flex items-center justify-center gap-1.5"
                           >
                             <RefreshCcw size={10} />
                             Retake
                           </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      {isCapturing && i === (retakeIndex !== null ? retakeIndex : capturedPhotos.length) ? (
                        <div className="w-5 h-5 border-2 border-secondary/20 border-t-secondary rounded-full animate-spin" />
                      ) : (
                        <span className="text-[10px] font-black text-[#24344D]/10">{i + 1}</span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Confirm Action Button */}
            <AnimatePresence>
              {isReviewing && capturedPhotos.length === totalShots && !isCapturing && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="mt-2"
                >
                  <button
                    onClick={() => onComplete(capturedPhotos)}
                    className="w-full py-4 bg-secondary text-white rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] shadow-lg shadow-secondary/20 hover:scale-[1.02] active:scale-[0.98] transition-all group flex items-center justify-center gap-2"
                  >
                    Next Step
                    <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
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



        {/* Aesthetic Effects */}
        <div className="space-y-5">
           <div className="flex items-center gap-3">
              <Wand2 size={16} className="text-secondary" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#24344D]/40">Enhancements</span>
           </div>
           <div className="grid grid-cols-2 gap-2.5">
              {[
                { name: 'Retro Grain', active: retroGrain, set: setRetroGrain },
                { name: 'Date Stamp', active: dateStamp, set: setDateStamp }
              ].map((effect) => (
                <div 
                  key={effect.name}
                  onClick={() => effect.set(!effect.active)}
                  className="flex items-center justify-between p-3 bg-white/40 rounded-xl border border-white/60 hover:bg-white transition-all cursor-pointer group"
                >
                  <span className="text-[8px] font-black uppercase tracking-tighter text-[#24344D]/60">{effect.name}</span>
                  <div className={cn(
                    "w-6 h-3 rounded-full relative transition-colors duration-500 flex-shrink-0",
                    effect.active ? "bg-secondary/20" : "bg-[#24344D]/5"
                  )}>
                    <div className={cn(
                      "absolute top-0.5 w-2 h-2 rounded-full transition-all duration-500",
                      effect.active ? "right-0.5 bg-secondary shadow-lg" : "left-0.5 bg-[#24344D]/20"
                    )} />
                  </div>
                </div>
              ))}
           </div>
        </div>

        {/* Shutter Speed / Timer */}
        <div className="space-y-5">
           <div className="flex items-center gap-3">
              <Timer size={16} className="text-secondary" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#24344D]/40">Interval Timer</span>
           </div>
           <div className="grid grid-cols-4 gap-2.5">
              {[0, 3, 5, 10].map((t) => (
                <button
                  key={t}
                  disabled={isCapturing}
                  onClick={() => setTimerDuration(t)}
                  className={cn(
                    "py-3 rounded-xl text-[9px] font-black transition-all duration-300",
                    timerDuration === t 
                      ? "bg-secondary text-white shadow-lg" 
                      : "bg-white/40 text-[#24344D]/50 hover:bg-white/80"
                  )}
                >
                  {t === 0 ? 'None' : t + 's'}
                </button>
              ))}
           </div>
        </div>
      </div>
    </div>

        {/* Cinematic Filters - Horizontal Scroll */}
        <div className="space-y-5 w-full">
           <div className="flex items-center gap-3">
              <Filter size={16} className="text-secondary" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#24344D]/40">Studio Filters</span>
           </div>
           <div className="flex gap-4 overflow-x-auto py-4 hide-scrollbar -mx-2 px-2 max-w-[800px]">
              {filters.map((f) => (
                <button
                  key={f.id}
                  disabled={isCapturing}
                  onClick={() => setActiveFilter(f)}
                  className={cn(
                    "flex-shrink-0 w-24 group transition-all duration-300",
                    isCapturing && "opacity-50 grayscale"
                  )}
                >
                  <div className={cn(
                    "aspect-square rounded-lg border-2 mb-2 overflow-hidden transition-all duration-500 bg-[#FAF8F4]",
                    activeFilter.id === f.id ? "border-secondary shadow-lg scale-105" : "border-transparent"
                  )}>
                    <div className={cn("w-full h-full relative", f.class)}>
                       <Webcam
                          audio={false}
                          mirrored={isMirrored}
                          videoConstraints={{ width: 120, height: 160, facingMode }}
                          className="w-full h-full object-cover opacity-80"
                       />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>
                  </div>
                  <span className={cn(
                    "text-[9px] font-black uppercase tracking-tighter block text-center truncate",
                    activeFilter.id === f.id ? "text-secondary" : "text-[#24344D]/40"
                  )}>
                    {f.name}
                  </span>
                </button>
              ))}
           </div>
        </div>
      </div>

      {/* Aesthetic Upload Prompt Modal */}
      <AnimatePresence>
        {showUploadPrompt && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#24344D]/30 backdrop-blur-xl"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 30, opacity: 0 }}
              className="bg-white/90 rounded-[40px] p-12 max-w-md w-full shadow-[0_32px_64px_-16px_rgba(36,52,77,0.3)] border border-white relative overflow-hidden text-center"
            >
              {/* Decorative Background Element */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-accent/20 rounded-full blur-3xl" />
              
              {/* Top Gradient Bar */}
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-secondary to-accent opacity-80" />
              
              {/* Close Button */}
              <button 
                onClick={() => setShowUploadPrompt(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-black/5 text-[#24344D]/20 hover:text-secondary transition-all"
              >
                <X size={20} />
              </button>

              <div className="relative mb-10">
                <div className="w-24 h-24 bg-gradient-to-br from-white to-[#FAF8F4] rounded-[28px] flex items-center justify-center mx-auto shadow-sm border border-white">
                   <div className="w-20 h-20 bg-secondary/[0.03] rounded-[24px] flex items-center justify-center text-secondary/60">
                      <Image size={36} strokeWidth={1.5} />
                   </div>
                </div>
                {/* Badge */}
                <div className="absolute -bottom-2 right-[30%] bg-secondary text-white text-[8px] font-black px-3 py-1.5 rounded-full shadow-lg border-2 border-white uppercase tracking-tighter">
                  {totalShots} Slots
                </div>
              </div>

              <div className="space-y-2 mb-10">
                <h3 className="text-3xl font-serif italic text-secondary leading-tight">Gallery Selection</h3>
                <p className="text-[10px] text-[#24344D]/40 font-black uppercase tracking-[0.3em]">Moment to Memory</p>
              </div>

              <div className="bg-secondary/[0.02] border border-secondary/5 rounded-3xl p-6 mb-10">
                <p className="text-[11px] text-[#24344D]/70 leading-relaxed font-medium">
                  Harap pilih tepat <span className="text-secondary font-black text-sm px-1.5">{totalShots} foto</span> dari galeri Anda untuk melengkapi layout <span className="text-secondary font-black italic">{selectedLayout.id}</span>.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <button
                  onClick={() => {
                    setShowUploadPrompt(false);
                    setTimeout(() => document.getElementById('gallery-upload')?.click(), 400);
                  }}
                  className="w-full py-5 bg-secondary text-white rounded-[20px] text-[11px] font-black uppercase tracking-[0.25em] shadow-[0_12px_24px_-8px_rgba(79,109,145,0.4)] hover:shadow-[0_20px_32px_-8px_rgba(79,109,145,0.5)] hover:scale-[1.01] active:scale-[0.99] transition-all duration-300"
                >
                  Buka Galeri
                </button>
                <button
                  onClick={() => setShowUploadPrompt(false)}
                  className="text-[10px] font-black uppercase tracking-widest text-[#24344D]/25 hover:text-secondary transition-all"
                >
                  Kembali
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
