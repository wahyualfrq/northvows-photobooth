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
    <div className="w-full flex flex-col gap-6">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-[0.3em]">
          Memory Layouts
        </h3>
        <span className="text-[10px] text-brown font-medium px-2 py-0.5 rounded-md bg-accent/50">
          {frames.length} Designs
        </span>
      </div>
      
      <div className="flex gap-5 overflow-x-auto pb-6 pt-2 snap-x hide-scrollbar">
        {frames.map((frame, index) => (
          <motion.button
            key={frame.id}
            whileHover={{ y: -6, rotate: 1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(frame)}
            className={cn(
              "flex-shrink-0 w-36 aspect-[3/4] rounded-2xl border-2 soft-transition relative overflow-hidden snap-start scrapbook-card p-2 group",
              selectedFrame.id === frame.id 
                ? "border-primary ring-4 ring-primary/5 shadow-xl" 
                : "border-transparent hover:border-accent hover:shadow-md"
            )}
          >
            {/* Tiny Tape on each card for flavor */}
            <div className={cn(
              "absolute -top-1 left-4 w-8 h-4 bg-primary/10 rotate-[-15deg] transition-opacity",
              selectedFrame.id === frame.id ? "opacity-100" : "opacity-0"
            )} />

            <div className="w-full h-full rounded-xl overflow-hidden bg-accent/30 relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={frame.url} 
                alt={frame.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              
              {selectedFrame.id === frame.id && (
                <div className="absolute inset-0 bg-primary/5 flex items-center justify-center">
                  <motion.div 
                    layoutId="active-dot"
                    className="w-2 h-2 rounded-full bg-primary"
                  />
                </div>
              )}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
