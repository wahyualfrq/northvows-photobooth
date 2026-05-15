'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, RotateCcw, RotateCw } from 'lucide-react';
import { Frame, Layout, Slot } from '@/types';
import { cn } from '@/lib/utils';
import { detectFrameSlots } from '@/lib/frame-utils';

interface PhotoState {
  id: string;
  url: string;
  scale: number;
  rotation: number;
  x: number;
  y: number;
}

interface PhotoStripPreviewProps {
  photos: string[];
  frame: Frame;
  layout: Layout;
  onPhotosChange?: (photos: string[]) => void; // For reordering
}

export default function PhotoStripPreview({ photos, frame, layout, onPhotosChange }: PhotoStripPreviewProps) {
  const [detectedSlots, setDetectedSlots] = useState<Slot[]>([]);
  const [photoStates, setPhotoStates] = useState<PhotoState[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Initialize/Sync photo states
  useEffect(() => {
    const slotsCount = frame.type === 'overlay' && detectedSlots.length > 0 
      ? detectedSlots.length 
      : (layout.rows * layout.cols);
    
    const initialPhotos = photos.slice(0, slotsCount).map((url, i) => ({
      id: `photo-${i}-${url.slice(-10)}`,
      url,
      scale: 1,
      rotation: 0,
      x: 0,
      y: 0
    }));
    setPhotoStates(initialPhotos);
  }, [photos, layout, frame.type, detectedSlots.length]);

  // Automatic Slot Detection for Overlay Frames
  useEffect(() => {
    if (frame.type === 'overlay' && frame.overlayImage) {
      detectFrameSlots(frame.overlayImage).then(slots => {
        setDetectedSlots(slots);
      }).catch(err => console.error("Slot detection failed:", err));
    } else {
      setDetectedSlots([]);
    }
  }, [frame]);

  const updatePhoto = (id: string, updates: Partial<PhotoState>) => {
    setPhotoStates(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const swapPhotos = (id1: string, id2: string) => {
    const index1 = photoStates.findIndex(p => p.id === id1);
    const index2 = photoStates.findIndex(p => p.id === id2);
    if (index1 === -1 || index2 === -1) return;

    const newStates = [...photoStates];
    const tempUrl = newStates[index1].url;
    newStates[index1].url = newStates[index2].url;
    newStates[index2].url = tempUrl;
    setPhotoStates(newStates);
    
    if (onPhotosChange) {
      onPhotosChange(newStates.map(p => p.url));
    }
  };

  // Handle clicking outside to hide editing tools
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.photo-cell-container')) {
        setEditingId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function PhotoCell({ photo, index, isOverlay }: { photo: PhotoState, index: number, isOverlay: boolean }) {
    const [isDragging, setIsDragging] = useState(false);
    
    return (
      <div 
        className={cn(
          "relative group bg-[#FAF8F4]/10 select-none photo-cell-container h-full w-full",
          isOverlay ? "" : "rounded-sm shadow-inner border border-black/5 overflow-hidden",
          isDragging ? "z-50" : "z-10"
        )}
      >
        <motion.div
          drag
          dragSnapToOrigin
          onDragStart={() => setIsDragging(true)}
          onDragEnd={(_, info) => {
            setIsDragging(false);
            const elements = document.elementsFromPoint(info.point.x, info.point.y);
            const slotElement = elements.find(el => el.getAttribute('data-slot-index') !== null);
            
            if (slotElement) {
              const targetIndex = parseInt(slotElement.getAttribute('data-slot-index')!);
              if (targetIndex !== index && photoStates[targetIndex]) {
                swapPhotos(photo.id, photoStates[targetIndex].id);
              }
            }
          }}
          animate={{ 
            opacity: isDragging ? 0.8 : 1,
            scale: isDragging ? 1.05 : 1
          }}
          className="w-full h-full cursor-grab active:cursor-grabbing relative"
        >
          <img src={photo.url} alt={`Shot ${index + 1}`} className="w-full h-full object-cover pointer-events-none" />
          {isDragging && (
             <div className="absolute inset-0 bg-[#AFCDF5]/20 backdrop-blur-[2px] pointer-events-none" />
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative flex flex-col items-center"
      style={{
        width: frame.type === 'overlay' ? '320px' : 'auto',
        maxWidth: frame.type === 'overlay' ? '320px' : (layout.cols > layout.rows ? '420px' : '280px'),
      }}
    >
      {/* Scrapbook Tape Accent */}
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
        <div className="w-12 h-4 bg-white/40 backdrop-blur-sm border border-white/60 rotate-1 shadow-sm" />
      </div>

      <div 
        className={cn(
          "transition-all duration-700 relative overflow-hidden flex flex-col w-full",
          frame.type === 'color' && "scrapbook-card p-3 sm:p-4 gap-3 shadow-2xl",
          frame.theme === 'dark' ? "text-white" : "text-[#24344D]",
          frame.type === 'color' && (frame.theme === 'dark' ? "bg-[#24344D]" : "bg-white")
        )}
        style={{
          aspectRatio: frame.type === 'overlay' ? '2 / 3' : `${layout.cols} / ${layout.rows + 0.6}`,
          backgroundColor: frame.type === 'color' ? (
            frame.id === 'vintage-blue' ? '#AFCDF5' : 
            frame.id === 'denim-memories' ? '#5A7FB2' : 
            frame.id === 'soft-cloud' ? '#DCEBFA' : 
            frame.id === 'cream-diary' ? '#F2EEE7' : 
            frame.id === 'school-memoir' ? '#EAE0D5' :
            frame.id === 'night-sky' ? '#1A1A2E' :
            frame.id === 'bestie' ? '#FFD1DC' :
            frame.id === 'playful-stars' ? '#E0F2F1' : '#FFFFFF'
          ) : '#FFFFFF', // Base white for overlay frames
        }}
      >
        {/* AUTOMATIC SLOT RENDERER (For Overlays) */}
        {frame.type === 'overlay' && (
          <div className="absolute inset-0 z-10">
            {detectedSlots.length > 0 ? (
              detectedSlots.map((slot, i) => (
                <div 
                  key={`slot-${i}`}
                  data-slot-index={i}
                  className="absolute"
                  style={{
                    left: `${slot.x * 100}%`,
                    top: `${slot.y * 100}%`,
                    width: `${slot.width * 100}%`,
                    height: `${slot.height * 100}%`,
                  }}
                >
                  {photoStates[i] ? (
                    <PhotoCell photo={photoStates[i]} index={i} isOverlay={true} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-black/5 border border-dashed border-black/10">
                      <span className="text-[8px] font-black opacity-20 uppercase tracking-widest">Empty</span>
                    </div>
                  )}
                </div>
              ))
            ) : (
              // Fallback Grid while detecting or if detection fails
              <div 
                className="grid flex-1 relative z-10 px-[8%] pt-[18%] pb-[12%] gap-x-[6%] gap-y-[3%]"
                style={{
                  gridTemplateRows: `repeat(${layout.rows}, minmax(0, 1fr))`,
                  gridTemplateColumns: `repeat(${layout.cols}, minmax(0, 1fr))`,
                }}
              >
                {photoStates.map((photo, i) => (
                  <div key={photo.id} data-slot-index={i} className="w-full h-full">
                    <PhotoCell photo={photo} index={i} isOverlay={true} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TRADITIONAL GRID RENDERER (Fallback for color frames) */}
        {frame.type === 'color' && (
          <div 
            className="grid gap-2 flex-1 relative z-10"
            style={{
              gridTemplateRows: `repeat(${layout.rows}, minmax(0, 1fr))`,
              gridTemplateColumns: `repeat(${layout.cols}, minmax(0, 1fr))`,
            }}
          >
            {photoStates.map((photo, i) => (
              <div key={photo.id} data-slot-index={i} className="w-full h-full">
                <PhotoCell photo={photo} index={i} isOverlay={false} />
              </div>
            ))}
            
            {/* Fill empty slots if any */}
            {Array.from({ length: Math.max(0, (layout.rows * layout.cols) - photoStates.length) }).map((_, i) => (
              <div key={`empty-${i}`} className="w-full h-full bg-[#FAF8F4]/5 rounded-sm flex items-center justify-center border border-dashed border-white/20">
                 <span className="text-[10px] font-black opacity-20 uppercase tracking-widest">Empty Slot</span>
              </div>
            ))}
          </div>
        )}

        {/* The Frame Overlay - This sits ON TOP of everything */}
        {frame.type === 'overlay' && frame.overlayImage && (
          <img 
            src={frame.overlayImage}
            alt="Frame Overlay"
            className="absolute inset-0 w-full h-full z-20 pointer-events-none object-fill"
          />
        )}

        {/* Branding Area - Only show for standard color frames */}
        {frame.type === 'color' && (
          <div className="flex flex-col items-center justify-center gap-1.5 pt-2 pb-2">
             <div className="flex items-center gap-3 opacity-40">
                <div className="h-[1px] w-8 bg-current" />
                <span className="text-[8px] font-black uppercase tracking-[0.4em]">{frame.name} Memoir</span>
                <div className="h-[1px] w-8 bg-current" />
             </div>
             <span className="text-[7px] font-bold opacity-30 uppercase tracking-[0.2em]">NorthVows Studio • Seoul Session • 2026</span>
          </div>
        )}

        {/* Glossy Overlay Effect */}
        <div className="absolute inset-0 z-30 pointer-events-none bg-gradient-to-tr from-white/0 via-white/5 to-white/10 opacity-50" />
      </div>
    </motion.div>
  );
}
