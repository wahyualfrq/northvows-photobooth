'use client';

import { motion } from 'framer-motion';
import { frames } from '@/data/frames';
import { Frame } from '@/types';
import { cn } from '@/lib/utils';

interface FrameSelectorProps {
  selectedFrame: Frame;
  onSelect: (frame: Frame) => void;
}

export default function FrameSelector({ selectedFrame, onSelect }: FrameSelectorProps) {
  return (
    <div className="w-full flex flex-col gap-8">
      <div className="flex items-end justify-between border-b border-border pb-4">
        <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.5em]">
          Layout Collection
        </h3>
        <span className="serif-italic text-sm text-foreground/40">
          Select your studio style
        </span>
      </div>
      
      <div className="flex gap-8 overflow-x-auto pb-8 pt-2 snap-x hide-scrollbar">
        {frames.map((frame) => (
          <motion.button
            key={frame.id}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(frame)}
            className={cn(
              "flex-shrink-0 w-40 aspect-[3/4] soft-transition relative snap-start group text-left",
              selectedFrame.id === frame.id ? "opacity-100" : "opacity-60 hover:opacity-100"
            )}
          >
            <div className={cn(
              "w-full h-full editorial-card p-1 transition-all duration-500 rounded-sm",
              selectedFrame.id === frame.id ? "border-primary ring-4 ring-primary/5" : "border-transparent"
            )}>
              <div className="w-full h-full overflow-hidden bg-muted/20 relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={frame.url} 
                  alt={frame.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-1">
               <span className="text-[9px] font-black uppercase tracking-widest text-primary/40">{frame.id}</span>
               <span className="text-xs font-bold text-foreground tracking-tight">{frame.name}</span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
