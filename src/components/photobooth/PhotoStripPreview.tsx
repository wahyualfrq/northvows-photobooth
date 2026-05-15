'use client';

import { motion } from 'framer-motion';
import { Frame, Layout } from '@/types';
import { cn } from '@/lib/utils';

interface PhotoStripPreviewProps {
  photos: string[];
  frame: Frame;
  layout: Layout;
}

export default function PhotoStripPreview({ photos, frame, layout }: PhotoStripPreviewProps) {
  // We might have more photos than slots if the user switched layout mid-session, 
  // but usually it matches. We'll take what fits.
  const displayPhotos = photos.slice(0, layout.rows * layout.cols);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative flex flex-col items-center"
    >
      {/* Scrapbook Tape Accent */}
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
        <div className="w-12 h-4 bg-white/40 backdrop-blur-sm border border-white/60 rotate-1 shadow-sm" />
      </div>

      <div 
        className={cn(
          "scrapbook-card p-3 sm:p-4 transition-all duration-700 relative overflow-hidden flex flex-col gap-3 shadow-2xl",
          frame.theme === 'dark' ? "bg-[#24344D] text-white" : "bg-white text-[#24344D]"
        )}
        style={{
          width: '100%',
          maxWidth: layout.cols > layout.rows ? '420px' : '280px',
          aspectRatio: `${layout.cols} / ${layout.rows + 0.6}`,
          backgroundColor: frame.id === 'vintage-blue' ? '#AFCDF5' : 
                           frame.id === 'denim-memories' ? '#5A7FB2' : 
                           frame.id === 'soft-cloud' ? '#DCEBFA' : 
                           frame.id === 'cream-diary' ? '#F2EEE7' : undefined
        }}
      >
        {/* Photo Grid */}
        <div 
          className="grid gap-2 flex-1"
          style={{
            gridTemplateRows: `repeat(${layout.rows}, minmax(0, 1fr))`,
            gridTemplateColumns: `repeat(${layout.cols}, minmax(0, 1fr))`,
          }}
        >
          {displayPhotos.map((photo, i) => (
            <div key={i} className="relative w-full h-full bg-[#FAF8F4]/10 rounded-sm overflow-hidden shadow-inner border border-black/5">
               <img src={photo} alt={`Shot ${i+1}`} className="w-full h-full object-cover" />
            </div>
          ))}
          
          {/* Fill empty slots if any */}
          {Array.from({ length: Math.max(0, (layout.rows * layout.cols) - displayPhotos.length) }).map((_, i) => (
            <div key={`empty-${i}`} className="w-full h-full bg-[#FAF8F4]/5 rounded-sm flex items-center justify-center border border-dashed border-white/20">
               <span className="text-[10px] font-black opacity-20 uppercase tracking-widest">Empty Slot</span>
            </div>
          ))}
        </div>

        {/* Branding Area */}
        <div className="flex flex-col items-center justify-center gap-1.5 pt-2 pb-2">
           <div className="flex items-center gap-3 opacity-40">
              <div className="h-[1px] w-8 bg-current" />
              <span className="text-[8px] font-black uppercase tracking-[0.4em]">{frame.name} Memoir</span>
              <div className="h-[1px] w-8 bg-current" />
           </div>
           <span className="text-[7px] font-bold opacity-30 uppercase tracking-[0.2em]">NorthVows Studio • Seoul Session • 2026</span>
        </div>

        {/* Glossy Overlay Effect */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/0 via-white/5 to-white/10 opacity-50" />
      </div>
    </motion.div>
  );
}
