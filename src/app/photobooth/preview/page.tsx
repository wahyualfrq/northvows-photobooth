'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Download, Share2, QrCode, Sparkles, Heart, 
  Star, Cloud, Sun, Flower, RefreshCcw, Home, Smartphone,
  CheckCircle2, Sparkle
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { frames } from '@/data/frames';
import { layouts } from '@/data/layouts';

export default function PreviewPage() {
  const [photos, setPhotos] = useState<string[]>([]);
  const [selectedFrame, setSelectedFrame] = useState(frames[0]);
  const [selectedLayout, setSelectedLayout] = useState(layouts[0]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  useEffect(() => {
    if (photos.length > 0) {
      const interval = setInterval(() => {
        setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
      }, 800); // GIF-like speed
      return () => clearInterval(interval);
    }
  }, [photos]);

  useEffect(() => {
    // Load state from localStorage
    const savedPhotos = localStorage.getItem('northvows_captured_photos');
    const savedFrameId = localStorage.getItem('northvows_selected_frame');
    const savedLayoutId = localStorage.getItem('northvows_selected_layout');

    if (savedPhotos) setPhotos(JSON.parse(savedPhotos));
    if (savedFrameId) {
      const frame = frames.find(f => f.id === savedFrameId);
      if (frame) setSelectedFrame(frame);
    }
    if (savedLayoutId) {
      const layout = layouts.find(l => l.id === savedLayoutId);
      if (layout) setSelectedLayout(layout);
    }

    // Trigger entrance animation
    setTimeout(() => setIsLoaded(true), 300);
  }, []);

  return (
    <main className="min-h-screen bg-[#FAF8F4] overflow-x-hidden selection:bg-[#AFCDF5]/30">
      {/* Cinematic Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#AFCDF5]/10 rounded-full blur-[120px] animate-pulse" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#5A7FB2]/10 rounded-full blur-[120px] animate-pulse delay-700" />
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 max-w-[1400px] mx-auto px-6 py-8 flex justify-between items-center">
         <Link href="/photobooth/result">
            <motion.button 
              whileHover={{ x: -4 }}
              className="flex items-center gap-2 text-[10px] font-black text-[#24344D]/40 uppercase tracking-[0.4em] hover:text-[#24344D] transition-colors"
            >
               <ArrowLeft size={12} /> Back to Editor
            </motion.button>
         </Link>
         
         <div className="flex items-center gap-4">
            <div className="px-4 py-1.5 bg-white/80 backdrop-blur-md rounded-full border border-white shadow-sm flex items-center gap-2">
               <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
               <span className="text-[9px] font-bold text-[#24344D] uppercase tracking-widest">Memoir Ready</span>
            </div>
         </div>
      </nav>

      {/* Header Section */}
      <div className="max-w-[1400px] mx-auto px-6 pt-4 pb-12 text-center space-y-4">
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
      <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start pb-32">
         
         {/* LEFT: Animated GIF / Photo Strip Preview */}
         <div className="lg:col-span-7 flex justify-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
               {/* Aesthetic Decorative Elements */}
               <div className="absolute -top-12 -left-12 pointer-events-none opacity-20">
                  <Sparkle size={48} className="text-[#AFCDF5] animate-spin-slow" />
               </div>
               <div className="absolute -bottom-8 -right-8 pointer-events-none opacity-20">
                  <Heart size={40} className="text-[#5A7FB2] animate-bounce" />
               </div>

                  <div className="flex flex-col items-center w-full">
                     {/* Minimalist GIF Header */}
                     <h3 className="text-sm font-black text-[#24344D]/30 uppercase tracking-[0.5em] mb-4">GIF</h3>

                     {/* Raw 1x1 GIF Preview (No container/shadow) */}
                     <div className="relative aspect-[4/3] w-full max-w-[400px] overflow-hidden rounded-2xl">
                        <img 
                           src={photos[currentPhotoIndex]} 
                           alt="Memory GIF"
                           className="w-full h-full object-cover" 
                        />
                     </div>
                  </div>
            </motion.div>
         </div>

         {/* RIGHT: QR Memory Card */}
         <div className="lg:col-span-5 flex flex-col gap-8">
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={isLoaded ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white rounded-[40px] p-8 sm:p-10 shadow-[0_30px_80px_-15px_rgba(0,0,0,0.08)] border border-white relative overflow-hidden"
            >
               {/* QR Pattern Background */}
               <div className="absolute top-0 right-0 w-32 h-32 bg-[#AFCDF5]/5 rounded-bl-[100px] -z-10" />
               
               <div className="space-y-8">
                  <div className="flex items-start justify-between">
                     <div className="space-y-1">
                        <p className="text-[10px] font-black text-[#5A7FB2] uppercase tracking-[0.4em]">Digital Access</p>
                        <h3 className="text-2xl font-black text-[#24344D] uppercase tracking-tighter">QR MEMORY CARD</h3>
                     </div>
                     <div className="w-12 h-12 bg-[#FAF8F4] rounded-2xl flex items-center justify-center text-[#5A7FB2] shadow-inner">
                        <QrCode size={24} />
                     </div>
                  </div>

                  <div className="p-8 bg-[#FAF8F4] rounded-[32px] border border-[#24344D]/5 flex flex-col items-center gap-6 shadow-inner group">
                     <div className="relative">
                        {/* Placeholder QR Code */}
                        <div className="w-40 h-40 bg-white p-4 rounded-3xl shadow-lg border border-[#24344D]/5 flex items-center justify-center relative overflow-hidden">
                           <div className="w-full h-full bg-[url('https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=https://northvows-photobooth.vercel.app')] bg-contain opacity-80" />
                           <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 backdrop-blur-sm">
                              <Smartphone className="text-[#5A7FB2] animate-bounce" />
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

                  <div className="space-y-4">
                     <div className="flex items-center gap-3 p-4 bg-[#AFCDF5]/5 rounded-2xl border border-[#AFCDF5]/10">
                        <CheckCircle2 size={16} className="text-[#5A7FB2]" />
                        <div>
                           <p className="text-[10px] font-black text-[#24344D] uppercase tracking-widest">High Quality Ready</p>
                           <p className="text-[9px] text-[#5A7FB2]/60">Your photo strip is processed in 4K resolution.</p>
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
               <button className="w-full py-5 bg-[#24344D] text-white rounded-[24px] flex items-center justify-center gap-3 shadow-xl hover:bg-[#24344D]/90 transition-all group overflow-hidden relative">
                  <motion.div 
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '200%' }}
                    className="absolute inset-0 bg-white/10 -skew-x-12 transition-all duration-700"
                  />
                  <Download size={18} />
                  <span className="text-xs font-black uppercase tracking-[0.3em] relative z-10">Download Photo Strip</span>
               </button>

               <div className="grid grid-cols-2 gap-4">
                  <button className="py-4 bg-white text-[#24344D] border border-[#24344D]/5 rounded-[24px] flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all">
                     <Share2 size={16} />
                     <span className="text-[10px] font-black uppercase tracking-widest">Share</span>
                  </button>
                  <Link href="/photobooth" className="w-full">
                     <button className="w-full py-4 bg-white text-[#5A7FB2] border border-[#AFCDF5]/20 rounded-[24px] flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all">
                        <RefreshCcw size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest">New Session</span>
                     </button>
                  </Link>
               </div>
            </motion.div>
         </div>
      </div>

      {/* Floating Home Button */}
      <div className="fixed bottom-8 right-8 z-[100]">
         <Link href="/">
            <motion.button
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              className="w-14 h-14 bg-white text-[#24344D] rounded-full shadow-2xl flex items-center justify-center border border-[#24344D]/5 backdrop-blur-md"
            >
               <Home size={20} />
            </motion.button>
         </Link>
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
