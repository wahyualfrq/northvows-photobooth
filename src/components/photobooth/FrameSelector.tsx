'use client';

import { motion } from 'framer-motion';
import { frames } from '@/data/frames';
import { Frame } from '@/types';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface FrameSelectorProps {
  selectedFrame: Frame;
  onSelect: (frame: Frame) => void;
}

export default function FrameSelector({ selectedFrame, onSelect }: FrameSelectorProps) {
  return (
    <div className="w-full flex flex-col gap-4">
      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-widest px-1">
        Select Frame
      </h3>
      <div className="flex gap-4 overflow-x-auto pb-4 snap-x hide-scrollbar">
        {frames.map((frame) => (
          <motion.button
            key={frame.id}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(frame)}
            className={cn(
              "flex-shrink-0 w-32 aspect-[3/4] rounded-xl border-2 transition-all relative overflow-hidden snap-start",
              selectedFrame.id === frame.id 
                ? "border-primary shadow-md" 
                : "border-border hover:border-muted-foreground/30"
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={frame.url} 
              alt={frame.name}
              className="w-full h-full object-cover"
            />
            {selectedFrame.id === frame.id && (
              <motion.div 
                layoutId="active-frame"
                className="absolute inset-0 bg-primary/5 pointer-events-none"
              />
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
