'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { frames } from '@/data/frames';
import { layouts } from '@/data/layouts';
import { Frame, Layout } from '@/types';
import FrameSelector from '@/components/photobooth/FrameSelector';
import PhotoStripPreview from '@/components/photobooth/PhotoStripPreview';
import { ArrowLeft, Download, Sparkle, Star, Loader2 } from 'lucide-react';
import { toPng } from 'html-to-image';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function ResultPage() {
  const router = useRouter();
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [selectedLayout, setSelectedLayout] = useState<Layout>(layouts[2]);
  const [selectedFrame, setSelectedFrame] = useState<Frame>(frames[0]);
  const [activeCategory, setActiveCategory] = useState('All Styles');
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const savedPhotos = localStorage.getItem('northvows_captured_photos');
    const savedLayout = localStorage.getItem('northvows_selected_layout');
    
    if (savedPhotos) setCapturedPhotos(JSON.parse(savedPhotos));
    if (savedLayout) setSelectedLayout(JSON.parse(savedLayout));
    
    // Redirect if no photos
    if (!savedPhotos) {
       router.replace('/photobooth');
    }
  }, [router]);

  const handleDownload = async () => {
    const element = document.getElementById('photo-strip-element');
    if (!element) return;

    try {
      setIsDownloading(true);
      
      // Add a small delay to ensure high quality and CSS animations are settled
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const dataUrl = await toPng(element, {
        quality: 1,
        pixelRatio: 3, // High resolution
        cacheBust: true,
      });

      const link = document.createElement('a');
      link.download = `northvows-memoir-${new Date().getTime()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Download failed:', err);
      alert('Gagal mengunduh gambar. Silakan coba lagi.');
    } finally {
      setIsDownloading(false);
    }
  };

  if (capturedPhotos.length === 0) return null;

  return (
    <main className="min-h-screen bg-[#FAF8F4] flex flex-col relative overflow-hidden pt-20">
      <div className="photobooth-sky-bg" />

      {/* Sub-Nav */}
      <div className="max-w-7xl mx-auto w-full px-6 sm:px-12 py-6 flex items-center justify-between z-10">
        <Link href="/photobooth">
          <motion.button
            whileHover={{ x: -4 }}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-[#24344D]/30 hover:text-[#24344D] transition-colors"
          >
            <ArrowLeft size={12} /> RETAKE
          </motion.button>
        </Link>
        <div className="flex items-center gap-3">
           <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#24344D]/60">STEP 02</span>
           <div className="w-8 h-[1px] bg-[#24344D]/10" />
           <span className="serif-italic text-xs text-[#24344D]/30 italic font-medium">Style Your Memory</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center p-6 sm:px-12 max-w-7xl mx-auto w-full z-10 pb-20">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left/Center: Photo Strip Preview */}
          <div className="lg:col-span-7 flex flex-col items-center gap-10">
            <div className="text-center space-y-3">
              <h1 className="text-4xl sm:text-5xl font-black text-[#24344D] tracking-tighter uppercase leading-none">
                STYLE <span className="serif-italic font-normal text-[#AFCDF5] lowercase px-2">your</span> MEMOIR.
              </h1>
              <p className="text-[9px] font-black text-[#5A7FB2] uppercase tracking-[0.4em]">Decorate your captured moments</p>
            </div>

            <PhotoStripPreview 
              photos={capturedPhotos} 
              frame={selectedFrame} 
              layout={selectedLayout} 
            />

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDownload}
              disabled={isDownloading}
              className={cn(
                "flex items-center gap-4 px-12 py-6 bg-gradient-to-br from-[#AFCDF5] via-[#5A7FB2] to-[#24344D] text-white rounded-full text-sm font-black uppercase tracking-[0.3em] shadow-2xl shadow-[#5A7FB2]/30 transition-all",
                isDownloading && "opacity-80 cursor-wait"
              )}
            >
              {isDownloading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Download size={18} />
                  Save this memoir
                </>
              )}
            </motion.button>
          </div>

          {/* Right: Frame Selection Section */}
          <div className="lg:col-span-5 space-y-12 bg-white/40 backdrop-blur-xl p-8 rounded-[40px] border border-white/60 shadow-xl">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-[#5A7FB2] uppercase tracking-[0.4em]">Choose Theme</p>
                  <h3 className="text-xl font-black text-[#24344D] uppercase">Frame Aesthetic</h3>
                </div>
              </div>

              {/* Category Filters Integrated */}
              <div className="flex flex-wrap items-center gap-2">
                {['All Styles', 'Vintage', 'Korean Mood', 'Minimal', 'Playful'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 rounded-full text-[8px] font-bold uppercase tracking-widest transition-all ${
                      activeCategory === cat 
                        ? "bg-[#5A7FB2] text-white" 
                        : "bg-white/60 text-[#5A7FB2]/60 border border-[#5A7FB2]/5"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-[450px] overflow-y-auto pr-4 hide-scrollbar">
              <FrameSelector 
                selectedFrame={selectedFrame}
                onSelect={setSelectedFrame}
                selectedLayout={selectedLayout}
                activeCategory={activeCategory}
                layoutMode="grid"
              />
            </div>

            <div className="pt-6 border-t border-[#24344D]/5">
               <p className="text-[9px] font-bold text-[#24344D]/30 leading-relaxed uppercase tracking-widest">
                 Your story, your frame. <br />
                 Select a theme that matches the mood of your memories.
               </p>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-[20%] right-[5%] text-[#AFCDF5] opacity-20 pointer-events-none">
        <Sparkle size={24} fill="currentColor" />
      </div>
      <div className="absolute bottom-[10%] left-[5%] text-[#AFCDF5] opacity-10 pointer-events-none rotate-12">
        <Star size={32} fill="currentColor" />
      </div>
    </main>
  );
}
