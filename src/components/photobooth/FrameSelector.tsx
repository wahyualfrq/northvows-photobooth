'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { layouts } from '@/data/layouts';
import { frames } from '@/data/frames';
import { Frame, Layout } from '@/types';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface FrameSelectorProps {
  selectedFrame: Frame;
  onSelect: (frame: Frame) => void;
  selectedLayout: Layout;
  activeCategory: string;
  layoutMode?: 'horizontal' | 'grid';
}

export default function FrameSelector({ 
  selectedFrame, 
  onSelect, 
  selectedLayout, 
  activeCategory,
  layoutMode = 'horizontal'
}: FrameSelectorProps) {
  const filteredFrames = activeCategory === 'All Styles' 
    ? frames 
    : frames.filter(f => f.category === activeCategory);

  return (
    <div className="w-full">
      <div className={cn(
        "flex gap-6 sm:gap-10 pb-12 pt-6 hide-scrollbar px-4",
        layoutMode === 'horizontal' ? "overflow-x-auto flex-nowrap snap-x" : "flex-wrap justify-center overflow-y-auto"
      )}>
        <AnimatePresence mode="popLayout">
          {filteredFrames.map((frame, index) => (
            <motion.button
              key={frame.id}
              layout
              initial={{ opacity: 0, scale: 0.9, rotate: index % 2 === 0 ? -1 : 1 }}
              animate={{ opacity: 1, scale: 1, rotate: index % 2 === 0 ? -1 : 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ y: -8, rotate: 0, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(frame)}
              className={cn(
                "flex-shrink-0 relative soft-transition group",
                selectedLayout.cols > selectedLayout.rows ? "w-56" : "w-32 sm:w-40"
              )}
            >
              {/* Scrapbook Tape Detail */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-10 h-3 bg-white/40 backdrop-blur-sm border border-white/60 rotate-2" />
              </div>

              <div className={cn(
                "w-full scrapbook-card p-2 sm:p-3 transition-all duration-500 rounded-sm relative overflow-hidden",
                selectedFrame.id === frame.id 
                  ? "ring-2 ring-[#5A7FB2] shadow-2xl shadow-[#5A7FB2]/10" 
                  : "hover:shadow-xl border border-white/60"
              )}
              style={{
                 aspectRatio: `${selectedLayout.cols} / ${selectedLayout.rows + 0.5}`
              }}
              >
                {/* Layout Visualization Overlay on Frame */}
                <div className="w-full h-full flex flex-col gap-2">
                  <div 
                    className="grid gap-1.5 w-full flex-1"
                    style={{
                      gridTemplateRows: `repeat(${selectedLayout.rows}, minmax(0, 1fr))`,
                      gridTemplateColumns: `repeat(${selectedLayout.cols}, minmax(0, 1fr))`,
                    }}
                  >
                    {Array.from({ length: selectedLayout.rows * selectedLayout.cols }).map((_, i) => (
                      <div 
                        key={i} 
                        className={cn(
                          "transition-colors duration-500 rounded-[1px]",
                          frame.theme === 'dark' ? "bg-[#24344D]/10" : "bg-white/60"
                        )}
                        style={{
                          backgroundColor: frame.id === 'denim-memories' ? 'rgba(90, 127, 178, 0.1)' : undefined
                        }}
                      />
                    ))}
                  </div>
                  
                  {/* Frame Branding Detail */}
                  <div className="flex items-center justify-center pt-2">
                     <span className={cn(
                       "text-[7px] font-black tracking-[0.3em] uppercase opacity-40",
                       frame.theme === 'dark' ? "text-[#24344D]" : "text-secondary"
                     )}>
                       {frame.name} Collection
                     </span>
                  </div>
                </div>

                {/* Selected State Overlay */}
                {selectedFrame.id === frame.id && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-[#5A7FB2] rounded-full flex items-center justify-center text-white shadow-lg">
                    <Check size={14} strokeWidth={4} />
                  </div>
                )}
              </div>

              <div className="mt-6 flex flex-col items-center gap-1.5">
                 <span className="text-sm font-black text-[#24344D] tracking-tight group-hover:text-secondary transition-colors">
                   {frame.name}
                 </span>
                 <span className="text-[9px] font-bold text-[#24344D]/30 uppercase tracking-[0.2em] text-center">
                   {frame.category === 'Vintage' ? 'Timeless & dreamy' : 
                    frame.category === 'Classic' ? 'Classic & nostalgic' : 
                    frame.category === 'Korean Mood' ? 'Light & airy' : 
                    frame.category === 'Minimal' ? 'Warm & minimal' : 
                    'Aesthetic Collection'}
                 </span>
              </div>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
      
      <div className="flex items-center justify-center gap-4 mt-2">
        <div className="px-3 py-1 bg-secondary/10 rounded-full border border-secondary/5">
          <span className="text-[8px] font-black uppercase tracking-widest text-secondary flex items-center gap-2">
            Compatible with: <span className="text-foreground">{selectedLayout.name}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
