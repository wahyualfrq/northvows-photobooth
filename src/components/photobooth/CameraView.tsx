import { useState, useCallback, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, RefreshCcw, Layout as LayoutIcon, Wand2, Filter, FlipHorizontal, Timer, Image as ImageIcon, X, ArrowRight } from 'lucide-react';
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
  { id: 'none', name: 'Original', class: '', filter: 'none' },
  { id: 'cloudy', name: 'Cloudy Blue', class: 'brightness-[1.1] saturate-[0.8] hue-rotate-[10deg]', filter: 'brightness(1.1) saturate(0.8) hue-rotate(10deg)' },
  { id: 'vintage', name: 'Vintage Fade', class: 'sepia-[0.2] contrast-[0.9] brightness-[1.1]', filter: 'sepia(0.2) contrast(0.9) brightness(1.1)' },
  { id: 'film', name: 'Soft Film', class: 'contrast-[0.8] brightness-[1.05] saturate-[0.9]', filter: 'contrast(0.8) brightness(1.05) saturate(0.9)' },
  { id: 'denim', name: 'Cool Denim', class: 'saturate-[0.7] hue-rotate-[-10deg] brightness-[1.05]', filter: 'saturate(0.7) hue-rotate(-10deg) brightness(1.05)' },
  { id: 'diary', name: 'Warm Diary', class: 'sepia-[0.3] saturate-[1.2] brightness-[0.95]', filter: 'sepia(0.3) saturate(1.2) brightness(0.95)' },
  { id: 'bw', name: 'Noir Classic', class: 'grayscale brightness-[1.1] contrast-[1.1]', filter: 'grayscale(1) brightness(1.1) contrast(1.1)' },
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
  const [showTimerOptions, setShowTimerOptions] = useState(false);
  
  const [isMirrored, setIsMirrored] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [currentDate, setCurrentDate] = useState("");
  const [cameraError, setCameraError] = useState<string | null>(null);
  
  const [rawPhotos, setRawPhotos] = useState<string[]>([]);
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

  useEffect(() => {
    setMounted(true);
    const date = new Date().toLocaleDateString('en-US', { 
      year: '2-digit', month: '2-digit', day: '2-digit' 
    }).replace(/\//g, ' ');
    setCurrentDate(date);
  }, []);

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

      const rawImage = webcamRef.current?.getScreenshot();
      if (rawImage) {
        setRawPhotos(prev => {
          if (retakeIndex !== null) {
            const next = [...prev];
            next[retakeIndex] = rawImage;
            return next;
          }
          return [...prev, rawImage];
        });

        // Apply Filters & Overlays to the captured image
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            // 1. Apply Filter
            ctx.filter = activeFilter.filter || 'none';
            ctx.drawImage(img, 0, 0);

            // 2. Apply Grain Effect
            if (retroGrain) {
               ctx.filter = 'none';
               ctx.globalAlpha = 0.1;
               ctx.globalCompositeOperation = 'overlay';
               for (let i = 0; i < 50; i++) {
                 ctx.fillStyle = i % 2 === 0 ? '#fff' : '#000';
                 ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 2, 2);
               }
               ctx.globalCompositeOperation = 'source-over';
               ctx.globalAlpha = 1.0;
            }

            if (dateStamp) {
              ctx.filter = 'none';
              const dateStr = new Date().toLocaleDateString('en-US', { year: '2-digit', month: '2-digit', day: '2-digit' }).replace(/\//g, ' ');
              ctx.font = 'bold 14px monospace';
              ctx.fillStyle = 'rgba(249, 115, 22, 0.8)';
              ctx.textAlign = 'right';
              ctx.shadowColor = 'rgba(0,0,0,0.3)';
              ctx.shadowBlur = 4;
              ctx.fillText(dateStr, canvas.width - 40, canvas.height - 15);
            }

            const processedImage = canvas.toDataURL('image/png');
            
            setCapturedPhotos(prev => {
              if (retakeIndex !== null) {
                const next = [...prev];
                next[retakeIndex] = processedImage;
                return next;
              }
              return [...prev, processedImage];
            });
          }
        };
        img.src = rawImage;
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

  const processSinglePhoto = async (rawSrc: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.filter = activeFilter.filter || 'none';
          ctx.drawImage(img, 0, 0);
          if (retroGrain) {
            ctx.filter = 'none';
            ctx.globalAlpha = 0.1;
            ctx.globalCompositeOperation = 'overlay';
            for (let i = 0; i < 50; i++) {
              ctx.fillStyle = i % 2 === 0 ? '#fff' : '#000';
              ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 2, 2);
            }
            ctx.globalCompositeOperation = 'source-over';
            ctx.globalAlpha = 1.0;
          }
          if (dateStamp) {
            ctx.filter = 'none';
            const dateStr = new Date().toLocaleDateString('en-US', { year: '2-digit', month: '2-digit', day: '2-digit' }).replace(/\//g, ' ');
            ctx.font = 'bold 14px monospace';
            ctx.fillStyle = 'rgba(249, 115, 22, 0.8)';
            ctx.textAlign = 'right';
            ctx.shadowColor = 'rgba(0,0,0,0.3)';
            ctx.shadowBlur = 4;
            ctx.fillText(dateStr, canvas.width - 40, canvas.height - 15);
          }
          resolve(canvas.toDataURL('image/png'));
        } else {
          resolve(rawSrc);
        }
      };
      img.src = rawSrc;
    });
  };

  useEffect(() => {
    if (isReviewing && rawPhotos.length > 0) {
      const updateAll = async () => {
        const processed = await Promise.all(rawPhotos.map(p => processSinglePhoto(p)));
        setCapturedPhotos(processed);
      };
      updateAll();
    }
  }, [activeFilter, retroGrain, dateStamp, isReviewing]);

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
    <div className="w-full flex flex-col lg:flex-row gap-8 lg:gap-16 items-start justify-start lg:pl-4 px-2 sm:px-0">
      {/* Left Column: Cinematic Camera Preview */}
      <div className="w-full max-w-[600px] space-y-12 sm:space-y-20 mt-2 sm:mt-16 lg:-ml-26 mx-auto">
        <div className="relative aspect-[4/4.2] w-full flex items-center justify-center">
          {/* Main Camera Body Frame */}
          <img 
            src="/images/CameraPict.webp" 
            alt="Vintage Camera Body" 
            className="absolute inset-0 w-full h-full object-contain z-10 pointer-events-none scale-[1.15] sm:scale-[1.3]"
          />

          {/* LCD Screen Area (Webcam Feed) */}
          <div className="absolute top-[16.2%] sm:top-[13%] left-[-0.4%] sm:left-[-2%] right-[19.5%] sm:right-[17%] bottom-[15.8%] sm:bottom-[11%] z-0 bg-black overflow-hidden shadow-inner">
            <div className="w-full h-full relative">
               <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/png"
                videoConstraints={{ width: 1080, height: 1440, facingMode }}
                mirrored={isMirrored}
                onUserMediaError={() => setCameraError("Camera access denied")}
                className={cn("w-full h-full object-cover transition-all duration-700", activeFilter.class)}
              />

              {cameraError && (
                <div className="absolute inset-0 bg-[#24344D] flex flex-col items-center justify-center p-6 text-center z-50">
                  <Camera className="w-8 h-8 text-white/20 mb-4" />
                  <p className="text-[10px] font-black text-white uppercase tracking-widest mb-2">{cameraError}</p>
                  <p className="text-[8px] text-white/40 uppercase tracking-widest max-w-[150px]">Please enable camera access in your browser settings to continue.</p>
                </div>
              )}

              {/* Retro Grain Effect */}
              {retroGrain && (
                <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay z-10 animate-grain" 
                     style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
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

                  {/* Date Stamp */}
                  {dateStamp && mounted && (
                    <div className="flex flex-col items-end">
                       <span className="text-[6px] font-mono text-orange-500/80 drop-shadow-[0_0_2px_rgba(249,115,22,0.5)] font-bold tracking-widest">
                         {currentDate}
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
        <div className="flex justify-center items-center gap-4 sm:gap-8 -mt-6 sm:-mt-12 relative z-20">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowUploadPrompt(true)}
            disabled={isCapturing}
            className="p-3 rounded-full text-[#24344D]/30 hover:text-secondary hover:bg-white transition-all shadow-sm disabled:opacity-20"
          >
            <ImageIcon className="w-4 h-4" />
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
              <Camera className="w-6 h-6 sm:w-8 sm:h-8" />
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

          {/* Mobile-Only Timer Toggle */}
          <div className="relative lg:hidden">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowTimerOptions(!showTimerOptions)}
              disabled={isCapturing}
              className={cn(
                "p-3 rounded-full transition-all shadow-sm disabled:opacity-20",
                timerDuration > 0 ? "text-secondary bg-secondary/10" : "text-[#24344D]/30 hover:text-secondary hover:bg-white"
              )}
            >
              <Timer className="w-4 h-4" />
            </motion.button>

            <AnimatePresence>
              {showTimerOptions && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 10 }}
                  className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-xl border border-white p-2 rounded-2xl shadow-2xl flex flex-col gap-1 z-[100]"
                >
                  {[0, 3, 5, 10].map((t) => (
                    <button
                      key={t}
                      onClick={() => {
                        setTimerDuration(t);
                        setShowTimerOptions(false);
                      }}
                      className={cn(
                        "px-4 py-2 rounded-xl text-[9px] font-black whitespace-nowrap transition-all",
                        timerDuration === t ? "bg-secondary text-white" : "hover:bg-secondary/10 text-secondary"
                      )}
                    >
                      {t === 0 ? 'Off' : t + 's'}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Right side container for Live Feed, Tools and Filters */}
      <div className="flex-1 w-full flex flex-col gap-8 lg:gap-12 lg:ml-16">
        {/* Cinematic Filters - Horizontal Scroll - TOP on Mobile */}
        <div className="order-1 lg:order-2 space-y-5 w-full">
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

        {/* Live Feed & Tools - BOTTOM on Mobile */}
        <div className="order-2 lg:order-1 flex flex-col lg:flex-row gap-8 lg:gap-16 items-start">
          {/* Middle Column: Live Shot Preview Grid */}
          <div className="flex xl:flex flex-col gap-6 pt-6 w-full xl:w-auto">
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
              className="grid gap-3 mx-auto xl:mx-0"
              style={{ 
                gridTemplateColumns: `repeat(${selectedLayout.cols}, minmax(0, 1fr))`,
                width: 'fit-content'
              }}
            >
              {Array.from({ length: totalShots }).map((_, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "aspect-[3/4] bg-white rounded-xl border-2 overflow-hidden relative group transition-all duration-500",
                    capturedPhotos[i] ? "border-white shadow-md" : "border-dashed border-[#24344D]/10 bg-[#FAF8F4]/50"
                  )}
                  style={{ width: '80px', height: '106px' }}
                >
                  {capturedPhotos[i] ? (
                    <>
                      <motion.img 
                        initial={{ scale: 1.2, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        src={capturedPhotos[i]} 
                        className="w-full h-full object-cover"
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

        {/* Shutter Speed / Timer - Hidden on Mobile */}
        <div className="hidden lg:block space-y-5">
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
              initial={{ scale: 0.9, rotate: -2, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0.9, rotate: 2, opacity: 0 }}
              className="relative max-w-sm w-full group"
            >
              {/* Decorative Stacked Photos Effect */}
              <div className="absolute inset-0 bg-white shadow-lg rounded-sm -rotate-2 translate-x-1 translate-y-1 opacity-40" />
              <div className="absolute inset-0 bg-white shadow-md rounded-sm rotate-1 -translate-x-1 translate-y-2 opacity-60" />
              
              {/* Main Polaroid Frame */}
              <div className="relative bg-[#F5F5F3] p-4 sm:p-5 pt-10 sm:pt-12 pb-8 sm:pb-10 rounded-sm shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/50 flex flex-col items-center">
                
                {/* Scrapbook Tape Detail */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
                  <div className="w-24 h-8 bg-white/40 backdrop-blur-[2px] border border-white/20 rotate-[-2deg] shadow-sm flex items-center justify-center">
                     <div className="w-full h-px bg-white/10" />
                  </div>
                </div>

                {/* Close Button */}
                <button 
                  onClick={() => setShowUploadPrompt(false)}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/5 text-[#24344D]/20 hover:text-secondary transition-all z-40"
                >
                  <X size={18} />
                </button>

                {/* Photo Area (Placeholder/Preview) */}
                <div className="w-full aspect-[4/5] bg-[#1a1a1a] rounded-[1px] relative overflow-hidden mb-8 shadow-inner group/photo transition-transform duration-700">
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center space-y-4">
                     <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-white/20 group-hover/photo:scale-110 group-hover/photo:text-secondary transition-all duration-500">
                        <ImageIcon size={32} strokeWidth={1} />
                     </div>
                     <div className="space-y-1">
                        <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Select {totalShots} Photos</p>
                        <p className="text-[8px] text-white/15 uppercase tracking-widest font-bold">PNG, JPG, or JPEG</p>
                     </div>
                  </div>
                  
                  {/* Subtle Grain Texture Over Photo Area */}
                  <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')]" />
                  
                  {/* Inner Shadow Glow */}
                  <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_40px_rgba(0,0,0,0.4)]" />
                </div>

                {/* Text Content Area */}
                <div className="w-full text-center space-y-4 mb-8">
                  <div className="relative">
                    <h3 className="text-2xl sm:text-3xl font-serif italic text-[#5D79A6] leading-tight">Gallery Selection</h3>
                    <div className="absolute -right-2 -top-1">
                       <div className="bg-[#5D79A6] text-white text-[7px] font-black px-2 py-1 rounded-full shadow-lg border-2 border-white uppercase tracking-tighter">
                         {totalShots} Slots
                       </div>
                    </div>
                  </div>
                  <p className="text-[9px] text-[#8EA3C0] font-black uppercase tracking-[0.4em]">Memory to Memoir</p>
                  
                  <div className="h-px w-12 bg-[#D9E1EC] mx-auto mt-2" />
                </div>

                {/* Action Buttons */}
                <div className="w-full space-y-4 px-2">
                  <button
                    onClick={() => {
                      setShowUploadPrompt(false);
                      setTimeout(() => document.getElementById('gallery-upload')?.click(), 400);
                    }}
                    className="w-full py-4 bg-[#5D79A6] text-white rounded-full text-[10px] font-black uppercase tracking-[0.25em] shadow-[0_10px_20px_rgba(93,121,166,0.2)] hover:shadow-[0_15px_25px_rgba(93,121,166,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                  >
                    Buka Galeri
                  </button>
                  <button
                    onClick={() => setShowUploadPrompt(false)}
                    className="w-full text-[9px] font-black uppercase tracking-widest text-[#24344D]/25 hover:text-[#5D79A6] transition-all"
                  >
                    Kembali Ke Studio
                  </button>
                </div>

                {/* Subtle Paper Grain Global */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')]" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
