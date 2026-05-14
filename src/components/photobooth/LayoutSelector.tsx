'use client';

import { motion } from 'framer-motion';
import { Layout } from '@/types';
import { layouts } from '@/data/layouts';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface LayoutSelectorProps {
  selectedLayout: Layout;
  onSelect: (layout: Layout) => void;
}

export default function LayoutSelector({ selectedLayout, onSelect }: LayoutSelectorProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
      {layouts.map((layout) => (
        <motion.button
          key={layout.id}
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(layout)}
          className={cn(
            "group relative flex flex-col gap-4 p-4 sm:p-6 rounded-2xl transition-all duration-500 text-left",
            selectedLayout.id === layout.id 
              ? "bg-white shadow-xl shadow-secondary/5 ring-1 ring-secondary/20" 
              : "bg-white/40 hover:bg-white/60 backdrop-blur-sm border border-white/60"
          )}
        >
          {/* Selected Indicator */}
          {selectedLayout.id === layout.id && (
            <motion.div 
              layoutId="layout-active"
              className="absolute top-3 right-3 w-5 h-5 bg-secondary rounded-full flex items-center justify-center text-white"
            >
              <Check size={12} strokeWidth={4} />
            </motion.div>
          )}

          {/* Layout Preview Visualization */}
          <div className="aspect-[3/4] w-full flex items-center justify-center">
            <div 
              className={cn(
                "grid gap-1 p-1.5 border-2 transition-colors duration-500 rounded-sm",
                selectedLayout.id === layout.id ? "border-secondary/40" : "border-foreground/10"
              )}
              style={{
                gridTemplateRows: `repeat(${layout.rows}, minmax(0, 1fr))`,
                gridTemplateColumns: `repeat(${layout.cols}, minmax(0, 1fr))`,
                width: layout.cols > layout.rows ? '100%' : 'auto',
                height: layout.rows > layout.cols ? '100%' : 'auto',
                maxWidth: '100%',
                maxHeight: '100%'
              }}
            >
              {Array.from({ length: layout.rows * layout.cols }).map((_, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "bg-secondary/5 border transition-colors duration-500",
                    selectedLayout.id === layout.id ? "border-secondary/20" : "border-foreground/5"
                  )} 
                />
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <h4 className="text-sm font-black text-foreground tracking-tight">{layout.name}</h4>
            <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest">{layout.description}</p>
          </div>
        </motion.button>
      ))}
    </div>
  );
}
