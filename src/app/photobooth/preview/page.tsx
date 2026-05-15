'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Download, Share2, Sparkles, Heart, 
  Star, Cloud, Sun, Flower, RefreshCcw, Smartphone,
  CheckCircle2, QrCode
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { frames } from '@/data/frames';
import { layouts } from '@/data/layouts';
import PhotoStripPreview from '@/components/photobooth/PhotoStripPreview';
import { toPng } from 'html-to-image';

interface StickerInstance {
  id: string;
  type: string;
  content: any;
  x: number;
  y: number;
  rotation: number;
  scale: number;
}

export default function PreviewPage() {
  const [photos, setPhotos] = useState<string[]>([]);
  const [selectedFrame, setSelectedFrame] = useState(frames[0]);
  const [selectedLayout, setSelectedLayout] = useState(layouts[0]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [stickers, setStickers] = useState<StickerInstance[]>([]);

  useEffect(() => {
    if (photos.length > 0) {
      const interval = setInterval(() => {
        setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
      }, 800); // GIF-like speed
      return () => clearInterval(interval);
    }
  }, [photos]);

  useEffect(() => {
    setMounted(true);
    // Load state from localStorage
    try {
      const savedPhotos = localStorage.getItem('northvows_captured_photos');
      const savedFrameId = localStorage.getItem('northvows_selected_frame');
      const savedLayoutId = localStorage.getItem('northvows_selected_layout');

      if (savedPhotos) setPhotos(JSON.parse(savedPhotos));
      
      if (savedFrameId) {
        try {
          const parsed = JSON.parse(savedFrameId);
          const id = typeof parsed === 'string' ? parsed : parsed.id;
          const frame = frames.find(f => f.id === id);
          if (frame) setSelectedFrame(frame);
        } catch (e) {
          const frame = frames.find(f => f.id === savedFrameId);
          if (frame) setSelectedFrame(frame);
        }
      }
      
      if (savedLayoutId) {
        try {
          const parsed = JSON.parse(savedLayoutId);
          const id = typeof parsed === 'string' ? parsed : parsed.id;
          const layout = layouts.find(l => l.id === id);
          if (layout) setSelectedLayout(layout);
        } catch (e) {
          const layout = layouts.find(l => l.id === savedLayoutId);
          if (layout) setSelectedLayout(layout);
        }
      }

      const savedStickers = localStorage.getItem('northvows_stickers');
      if (savedStickers) setStickers(JSON.parse(savedStickers));
    } catch (err) {
      // Silently handle localStorage errors in production
    }
    
    const timer = setTimeout(() => setIsLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleDownload = async () => {
    const element = document.getElementById('photo-strip-element');
    if (!element) return;

    try {
      setIsDownloading(true);
      const dataUrl = await toPng(element, {
        pixelRatio: 3, // High quality
        cacheBust: true,
        backgroundColor: '#fff'
      });

      const link = document.createElement('a');
      link.download = `northvows-memoir-${new Date().getTime()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-[#FAF8F4] overflow-x-hidden selection:bg-[#AFCDF5]/30">
      {/* Cinematic Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#AFCDF5]/10 rounded-full blur-[120px] animate-pulse" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#5A7FB2]/10 rounded-full blur-[120px] animate-pulse delay-700" />
         <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')] opacity-[0.05] mix-blend-overlay" />
      </div>

      {/* Floating Navigation */}
      <div className="absolute top-6 left-6 sm:top-8 sm:left-12 z-50">
         <Link href="/photobooth/result">
            <motion.button 
              whileHover={{ x: -4 }}
              className="flex items-center gap-2 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.4em] text-[#24344D]/60 hover:text-[#24344D] transition-colors"
            >
               <ArrowLeft size={12} /> BACK TO EDITOR
            </motion.button>
         </Link>
      </div>

      <div className="absolute top-6 right-6 sm:top-8 sm:right-12 z-50">
         <div className="px-4 py-1.5 bg-white/80 backdrop-blur-md rounded-full border border-white shadow-sm flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            <span className="text-[9px] font-bold text-[#24344D] uppercase tracking-widest">Memoir Ready</span>
         </div>
      </div>

      {/* Header Section */}
      <div className="max-w-[1400px] mx-auto px-6 pt-20 pb-6 text-center space-y-2">
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.2 }}
         >
            <h1 className="text-4xl sm:text-6xl font-black text-[#24344D] tracking-tighter uppercase leading-none">
               YOUR MEMORY <br /> <span className="serif-italic font-normal text-[#5A7FB2] lowercase italic px-2">is</span> READY
            </h1>
            <p className="mt-4 text-[10px] sm:text-[12px] font-bold text-[#5A7FB2]/60 uppercase tracking-[0.4em] max-w-xl mx-auto leading-relaxed">
               A nostalgic moment captured forever <br className="sm:hidden" /> and beautifully prepared for you.
            </p>
         </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start pb-12">
         
         {/* LEFT: Photo Strip & GIF Comparison */}
         <div className="lg:col-span-8 flex justify-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="w-full"
            >
               <div className="flex flex-col sm:flex-row items-center sm:items-start justify-center gap-8 sm:gap-12">
                  
                  {/* Photo Strip (The Static Memoir) */}
                  <div className="flex flex-col items-center w-full max-w-[280px]">
                     <h3 className="text-[10px] font-black text-[#24344D]/30 uppercase tracking-[0.5em] mb-6">Printed Strip</h3>
                     <div id="photo-strip-element" className="relative bg-white sm:bg-transparent p-4 sm:p-0 flex flex-col items-center">
                       <div className="relative w-fit">
                         <PhotoStripPreview 
                            photos={photos} 
                            frame={selectedFrame} 
                            layout={selectedLayout} 
                         />
                         {/* Static Stickers for Preview - Relative to the strip itself */}
                        {stickers.map((sticker) => (
                          <div
                            key={sticker.id}
                            style={{ 
                              position: 'absolute', 
                              left: `${sticker.x}%`, 
                              top: `${sticker.y}%`,
                              transform: `translate(-50%, -50%) rotate(${sticker.rotation}deg) scale(${sticker.scale})`,
                              zIndex: 50,
                              pointerEvents: 'none'
                            }}
                          >
                            {sticker.type === 'tape' && (
                              <div className={cn(
                                "w-24 h-8 border shadow-md flex items-center justify-center opacity-90",
                                sticker.content === 'grid' ? "bg-white bg-[radial-gradient(#00000022_1px,transparent_1px)] bg-[size:6px_6px]" : ""
                              )} style={{ backgroundColor: sticker.content !== 'grid' ? sticker.content : 'transparent' }}>
                                 <div className="w-full h-px bg-white/20" />
                              </div>
                            )}
                            {sticker.type === 'sticker' && (
                              <span className="text-5xl filter drop-shadow-2xl">{sticker.content}</span>
                            )}
                            {sticker.type === 'doodle' && (
                              <div className="text-[#5A7FB2] filter drop-shadow-md">
                                 {sticker.content === 'Cloud' || sticker.content?.name === 'Cloud' ? <Cloud size={36} fill="currentColor" /> :
                                  sticker.content === 'Sparkle' || sticker.content?.name === 'Sparkle' ? <Sparkles size={36} fill="currentColor" /> :
                                  sticker.content === 'Star' || sticker.content?.name === 'Star' ? <Star size={36} fill="currentColor" /> :
                                  sticker.content === 'Heart' || sticker.content?.name === 'Heart' ? <Heart size={36} fill="currentColor" /> :
                                  <Star size={36} fill="currentColor" />}
                              </div>
                            )}
                            {sticker.type === 'text' && (
                              <div className="bg-[#F6F0E8]/95 backdrop-blur-md px-5 py-2 border border-black/10 rounded shadow-lg">
                                 <p className="text-[11px] font-serif italic text-[#24344D] whitespace-nowrap">{sticker.content}</p>
                              </div>
                            )}
                          </div>
                        ))}
                       </div>
                     </div>
                  </div>

                  {/* Vertical Divider */}
                  <div className="hidden sm:block w-px h-[400px] bg-gradient-to-b from-transparent via-[#24344D]/5 to-transparent self-center" />

                  {/* Animated GIF (The Dynamic Moment) */}
                  <div className="flex flex-col items-center w-full max-w-[400px]">
                     <h3 className="text-[10px] font-black text-[#24344D]/30 uppercase tracking-[0.5em] mb-6">GIF Moment</h3>
                     
                     <div className="relative w-full aspect-[4/3] overflow-hidden rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-white">
                        <img 
                           src={photos[currentPhotoIndex]} 
                           alt="Memory GIF"
                           className="w-full h-full object-cover grayscale-[0.05] brightness-105" 
                        />
                        {/* Aesthetic Overlays */}
                        <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/0 via-white/5 to-white/10 opacity-30" />
                     </div>

                     {/* Sub-label */}
                     <div className="mt-6 flex items-center gap-3 opacity-20">
                        <div className="h-px w-6 bg-[#24344D]" />
                        <span className="text-[9px] font-bold text-[#24344D] uppercase tracking-[0.2em]">Northvows Memories</span>
                        <div className="h-px w-6 bg-[#24344D]" />
                     </div>
                  </div>
               </div>
            </motion.div>
         </div>

         {/* RIGHT: QR Memory Card */}
         <div className="lg:col-span-4 flex flex-col gap-6">
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={isLoaded ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white rounded-[32px] p-6 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.06)] border border-white relative overflow-hidden"
            >
               {/* QR Pattern Background */}
               <div className="absolute top-0 right-0 w-24 h-24 bg-[#AFCDF5]/5 rounded-bl-[80px] -z-10" />
               
               <div className="space-y-5">
                  <div className="flex items-start justify-between">
                     <div className="space-y-0.5">
                        <p className="text-[10px] font-black text-[#5A7FB2] uppercase tracking-[0.4em]">Digital Access</p>
                        <h3 className="text-2xl font-black text-[#24344D] uppercase tracking-tighter">QR MEMORY CARD</h3>
                     </div>
                     <div className="w-12 h-12 bg-[#FAF8F4] rounded-2xl flex items-center justify-center text-[#5A7FB2] shadow-inner">
                        <QrCode size={24} />
                     </div>
                  </div>

                  <div className="p-5 bg-[#FAF8F4] rounded-[24px] border border-[#24344D]/5 flex flex-col items-center gap-4 shadow-inner group">
                     <div className="relative">
                        {/* Placeholder QR Code */}
                        <div className="w-32 h-32 bg-white p-3 rounded-2xl shadow-lg border border-[#24344D]/5 flex items-center justify-center relative overflow-hidden">
                           <img 
                             src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent('https://northvows-photobooth.vercel.app')}`} 
                             className="w-full h-full object-contain opacity-80" 
                             alt="Memory QR"
                           />
                           <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 backdrop-blur-sm">
                              <Smartphone size={20} className="text-[#5A7FB2] animate-bounce" />
                           </div>
                        </div>
                        {/* Decorative corners */}
                        <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-[#AFCDF5] rounded-tl-lg" />
                        <div className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-[#AFCDF5] rounded-tr-lg" />
                        <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-[#AFCDF5] rounded-bl-lg" />
                        <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-[#AFCDF5] rounded-br-lg" />
                     </div>
                     
                     <div className="text-center space-y-2">
                        <p className="text-[11px] font-black text-[#24344D] uppercase tracking-[0.3em]">Scan to download GIF</p>
                        <p className="text-[10px] font-medium text-[#5A7FB2]/70 leading-relaxed max-w-[200px]">Scan this code with your phone to save the animated version of your memoir.</p>
                     </div>
                  </div>

                  <div className="space-y-3">
                     <div className="flex items-center gap-2.5 p-3 bg-[#AFCDF5]/5 rounded-xl border border-[#AFCDF5]/10">
                        <CheckCircle2 size={14} className="text-[#5A7FB2]" />
                        <div>
                           <p className="text-[9px] font-black text-[#24344D] uppercase tracking-widest">High Quality Ready</p>
                           <p className="text-[8px] text-[#5A7FB2]/60">Processed in 4K resolution.</p>
                        </div>
                     </div>
                  </div>
               </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.6 }}
              className="flex flex-col gap-4"
            >
               <button 
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="w-full py-3.5 bg-[#24344D] text-white rounded-[18px] flex items-center justify-center gap-3 shadow-xl hover:bg-[#24344D]/90 transition-all group overflow-hidden relative disabled:opacity-50"
               >
                  <motion.div 
                    initial={{ x: '-100%' }}
                    whileHover={!isDownloading ? { x: '200%' } : {}}
                    className="absolute inset-0 bg-white/10 -skew-x-12 transition-all duration-700"
                  />
                  {isDownloading ? (
                    <RefreshCcw size={16} className="animate-spin" />
                  ) : (
                    <Download size={16} />
                  )}
                  <span className="text-[11px] font-black uppercase tracking-[0.3em] relative z-10">
                    {isDownloading ? 'Downloading...' : 'Download Photo Strip'}
                  </span>
               </button>

               <div className="grid grid-cols-2 gap-3">
                  <button className="py-2.5 bg-white text-[#24344D] border border-[#24344D]/5 rounded-[18px] flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all text-[9px] font-black uppercase tracking-widest">
                     <Share2 size={14} />
                     Share
                  </button>
                  <Link href="/photobooth" className="w-full">
                     <button className="w-full py-2.5 bg-white text-[#5A7FB2] border border-[#AFCDF5]/20 rounded-[18px] flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all text-[9px] font-black uppercase tracking-widest">
                        <RefreshCcw size={14} />
                        New Session
                     </button>
                  </Link>
               </div>
            </motion.div>
         </div>
      </div>


      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100;300;400;500;700;900&family=Playfair+Display:ital,wght@1,400;1,700&display=swap');
        
        .serif-italic {
          font-family: 'Playfair Display', serif;
        }

        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }

        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </main>
  );
}
