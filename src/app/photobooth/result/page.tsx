'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { frames } from '@/data/frames';
import { layouts } from '@/data/layouts';
import { Frame, Layout } from '@/types';
import PhotoStripPreview from '@/components/photobooth/PhotoStripPreview';
import FrameSelector from '@/components/photobooth/FrameSelector';
import { 
  ArrowLeft, Download, Sparkle, Star, Loader2, Undo2, Redo2, RefreshCcw, 
  Smile, Heart as HeartIcon, Flower, Sun, Cloud, 
  Scissors, Move, Maximize2, RotateCcw, Plus, Minus
} from 'lucide-react';
import { toPng } from 'html-to-image';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface StickerInstance {
  id: string;
  type: string;
  content: any;
  x: number;
  y: number;
  rotation: number;
  scale: number;
}

const STAMP_CATEGORIES = ['All', 'Tape', 'Stickers', 'Doodles', 'Text', 'Date'];

const TAPE_ITEMS = [
  { id: 'tape-1', type: 'tape', content: '#AFCDF5', label: 'Sky Blue Tape' },
  { id: 'tape-2', type: 'tape', content: '#F6F0E8', label: 'Cream Tape' },
  { id: 'tape-3', type: 'tape', content: '#5A7FB2', label: 'Denim Tape' },
  { id: 'tape-4', type: 'tape', content: 'grid', label: 'Grid Tape' },
];

const STICKER_ITEMS = [
  { id: 'stick-1', type: 'sticker', content: '😊', label: 'Happy' },
  { id: 'stick-2', type: 'sticker', content: '🧸', label: 'Teddy' },
  { id: 'stick-3', type: 'sticker', content: '🌸', label: 'Flower' },
  { id: 'stick-4', type: 'sticker', content: '📷', label: 'Camera' },
  { id: 'stick-5', type: 'sticker', content: '🤍', label: 'Heart' },
];

const DOODLE_ITEMS = [
  { id: 'doodle-1', type: 'doodle', content: Cloud, label: 'Cloud' },
  { id: 'doodle-2', type: 'doodle', content: Sparkle, label: 'Sparkle' },
  { id: 'doodle-3', type: 'doodle', content: Star, label: 'Star' },
  { id: 'doodle-4', type: 'doodle', content: HeartIcon, label: 'Heart' },
];

const TEXT_STAMPS = [
  { id: 'text-1', type: 'text', content: 'good times together' },
  { id: 'text-2', type: 'text', content: "memories don't fade" },
  { id: 'text-3', type: 'text', content: 'Our moment, forever' },
];

function DraggableSticker({ sticker, updateStickerNoHistory, pushToHistory, stickers }: { 
  sticker: StickerInstance, 
  updateStickerNoHistory: (id: string, updates: Partial<StickerInstance>) => void,
  pushToHistory: (stickers: StickerInstance[]) => void,
  stickers: StickerInstance[]
}) {
  const controls = useDragControls();

  return (
    <motion.div
      drag
      dragControls={controls}
      dragListener={false}
      dragMomentum={false}
      onDragEnd={() => pushToHistory(stickers)}
      initial={{ scale: 0, rotate: sticker.rotation }}
      animate={{ scale: sticker.scale, rotate: sticker.rotation }}
      exit={{ scale: 0 }}
      style={{ 
         touchAction: 'none', 
         position: 'absolute', 
         left: `${sticker.x}%`, 
         top: `${sticker.y}%`,
         cursor: 'grab',
         zIndex: 50
      }}
      className="group/sticker"
    >
      <div 
        onPointerDown={(e) => controls.start(e)}
        className="cursor-grab active:cursor-grabbing"
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
          <span className="text-5xl filter drop-shadow-2xl select-none">{sticker.content}</span>
        )}
        {sticker.type === 'doodle' && (
          <sticker.content size={36} className="text-[#5A7FB2] filter drop-shadow-md" />
        )}
        {sticker.type === 'text' && (
          <div className="bg-[#F6F0E8]/95 backdrop-blur-md px-5 py-2 border border-black/10 rounded shadow-lg">
             <p className="text-[11px] font-serif italic text-[#24344D] whitespace-nowrap">{sticker.content}</p>
          </div>
        )}
      </div>

      {/* Bounding Box Transformation UI - Only visible on hover */}
      <div className="absolute -inset-2 border-2 border-[#AFCDF5] opacity-100 lg:opacity-0 lg:group-hover/sticker:opacity-100 transition-opacity pointer-events-none rounded-sm">
         {/* Corner Resize Handles */}
         <motion.div 
           drag
           dragMomentum={false}
           dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
           dragElastic={0}
           onPointerDown={(e) => e.stopPropagation()}
           onDrag={(e, info) => {
              const sensitivity = 0.02;
              updateStickerNoHistory(sticker.id, { scale: Math.max(0.2, sticker.scale + (info.delta.x + info.delta.y) * sensitivity) });
           }}
           onDragEnd={() => pushToHistory(stickers)}
           className="absolute -bottom-2 -right-2 w-6 h-6 bg-white border-2 border-[#AFCDF5] rounded-full cursor-nwse-resize pointer-events-auto z-[80] shadow-md active:scale-125 transition-transform" 
         />
         <div className="absolute -top-2 -right-2 w-4 h-4 bg-white border-2 border-[#AFCDF5] rounded-full pointer-events-none opacity-50" />
         <div className="absolute -top-2 -left-2 w-4 h-4 bg-white border-2 border-[#AFCDF5] rounded-full pointer-events-none opacity-50" />
         <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-white border-2 border-[#AFCDF5] rounded-full pointer-events-none opacity-50" />

         {/* Rotation Handle - Bottom Center */}
         <motion.div 
           drag
           dragMomentum={false}
           dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
           dragElastic={0}
           onPointerDown={(e) => e.stopPropagation()}
           onDrag={(e, info) => {
              const sensitivity = 1.8;
              updateStickerNoHistory(sticker.id, { rotation: sticker.rotation - info.delta.x * sensitivity });
           }}
           onDragEnd={() => pushToHistory(stickers)}
           className="absolute -bottom-14 left-1/2 -translate-x-1/2 w-10 h-10 bg-white rounded-full shadow-2xl border-2 border-[#AFCDF5] flex items-center justify-center cursor-pointer pointer-events-auto active:scale-110 z-[80]"
         >
            <RotateCcw size={16} className="text-[#5A7FB2]" />
         </motion.div>

         {/* Delete Button - Top Center or Floating */}
         <button 
           onPointerDown={(e) => e.stopPropagation()}
           onClick={(e) => { e.stopPropagation(); pushToHistory(stickers.filter(s => s.id !== sticker.id)); }}
           className="absolute -top-12 left-1/2 -translate-x-1/2 w-8 h-8 bg-white rounded-full shadow-lg border-2 border-red-100 flex items-center justify-center cursor-pointer pointer-events-auto hover:bg-red-50 text-red-500 transition-colors z-[80]"
         >
            <Scissors size={14} />
         </button>
      </div>
    </motion.div>
  );
}

export default function ResultPage() {
  const router = useRouter();
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [selectedLayout, setSelectedLayout] = useState<Layout>(layouts[2]);
  const [selectedFrame, setSelectedFrame] = useState<Frame>(frames[0]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [activeFrameCategory, setActiveFrameCategory] = useState('All Styles');
  const [activeStickerCategory, setActiveStickerCategory] = useState('All');
  
  // Sticker State
  const [stickers, setStickers] = useState<StickerInstance[]>([]);
  const [history, setHistory] = useState<StickerInstance[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  useEffect(() => {
    const savedPhotos = localStorage.getItem('northvows_captured_photos');
    const savedLayout = localStorage.getItem('northvows_selected_layout');
    
    if (savedPhotos) setCapturedPhotos(JSON.parse(savedPhotos));
    if (savedLayout) setSelectedLayout(JSON.parse(savedLayout));
    
    if (!savedPhotos) {
       router.replace('/photobooth');
    }
  }, [router]);

  // History management
  const pushToHistory = (newStickers: StickerInstance[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push([...newStickers]);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setStickers(newStickers);
  };

  const undo = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setStickers(prev);
      setHistoryIndex(historyIndex - 1);
    } else if (historyIndex === 0) {
      setStickers([]);
      setHistoryIndex(-1);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setStickers(next);
      setHistoryIndex(historyIndex + 1);
    }
  };

  const resetStickers = () => {
    pushToHistory([]);
  };

  const updateSticker = (id: string, updates: Partial<StickerInstance>) => {
    const newStickers = stickers.map(s => s.id === id ? { ...s, ...updates } : s);
    pushToHistory(newStickers);
  };

  const updateStickerNoHistory = (id: string, updates: Partial<StickerInstance>) => {
    setStickers(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const addSticker = (item: any) => {
    const newSticker: StickerInstance = {
      id: `sticker-${Date.now()}`,
      type: item.type,
      content: item.content,
      x: 40 + Math.random() * 20,
      y: 40 + Math.random() * 20,
      rotation: (Math.random() - 0.5) * 20,
      scale: 1
    };
    pushToHistory([...stickers, newSticker]);
  };

  const handleDownload = async () => {
    const element = document.getElementById('scrapbook-workspace-content');
    if (!element) return;

    try {
      setIsDownloading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const dataUrl = await toPng(element, {
        quality: 1,
        pixelRatio: 3,
        cacheBust: true,
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

  if (capturedPhotos.length === 0) return null;

  return (
    <main className="h-screen bg-[#F8FBFF] flex flex-col relative lg:overflow-hidden pt-0 overflow-y-auto lg:overflow-y-hidden">
      {/* Dreamy Sky Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#AFCDF5]/10 to-transparent" />
        <div className="absolute top-[10%] -left-[10%] w-[50%] h-[50%] bg-[#AFCDF5]/15 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />
      </div>

      {/* Floating Retake Button - Matched with Studio Exit Position */}
      <div className="absolute top-6 left-6 sm:top-8 sm:left-12 z-50">
        <Link href="/photobooth">
          <motion.button
            whileHover={{ x: -4 }}
            className="flex items-center gap-2 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.4em] text-[#24344D]/60 hover:text-[#24344D] transition-colors"
          >
            <ArrowLeft size={12} /> RETAKE
          </motion.button>
        </Link>
      </div>

      {/* Floating Step Indicator - Aligned with Retake Position */}
      <div className="absolute top-6 right-6 sm:top-8 sm:right-12 z-50 hidden sm:block">
        <div className="flex items-center gap-3">
          <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.4em] text-[#24344D]/80">STEP 02</span>
          <div className="w-8 h-[1px] bg-[#24344D]/20" />
          <span className="serif-italic text-[11px] sm:text-[12px] text-[#5A7FB2] italic font-semibold">Style Your Memory</span>
        </div>
      </div>

      {/* Top Header - Compacted */}
      <div className="relative z-20 max-w-[1600px] mx-auto w-full px-6 sm:px-12 py-12 sm:py-4 flex flex-col items-center">
        <div className="w-full h-8 sm:h-8" /> {/* Spacer to account for floating buttons */}

        <div className="text-center space-y-1">
           <h1 className="text-3xl sm:text-4xl font-black text-[#24344D] tracking-tighter uppercase leading-none">
              STYLE <span className="serif-italic font-normal text-[#AFCDF5] lowercase px-1">your</span> MEMOIR.
           </h1>
           <p className="text-[8px] sm:text-[9px] font-bold text-[#5A7FB2]/60 uppercase tracking-[0.3em] leading-relaxed">
             Decorate your moments with love <br /> and nostalgic blue.
           </p>
        </div>
      </div>

      {/* Main 3-Column Workspace - Responsive stacking */}
      <div className="relative z-10 flex-1 max-w-[1800px] mx-auto w-full flex flex-col lg:flex-row gap-8 px-6 sm:px-10 pb-48 lg:pb-28 overflow-y-auto lg:overflow-hidden">
        
        {/* LEFT: Stamp / Customization Panel - Now on the LEFT for Desktop */}
        <aside className="hidden lg:flex lg:w-[460px] flex-col h-full py-2 lg:order-1">
           <motion.div 
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             className="bg-white/80 backdrop-blur-xl rounded-[32px] p-7 border border-white shadow-[0_8px_40px_rgb(0,0,0,0.08)] flex flex-col h-full overflow-hidden"
           >
              <div className="space-y-6 flex flex-col h-full lg:overflow-hidden">
                 <div className="flex items-center justify-between shrink-0">
                    <div className="space-y-1.5">
                       <p className="text-[11px] font-black text-[#5A7FB2] uppercase tracking-[0.4em]">Stample</p>
                       <h3 className="text-base font-black text-[#24344D] uppercase tracking-tight">Decoration Set</h3>
                    </div>
                    <div className="flex gap-2 p-1">
                       {STAMP_CATEGORIES.map(cat => (
                         <button
                           key={cat}
                           onClick={() => setActiveStickerCategory(cat)}
                           className={cn(
                             "px-3.5 py-2 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all whitespace-nowrap",
                             activeStickerCategory === cat ? "bg-[#24344D] text-white shadow-lg shadow-[#24344D]/20" : "bg-white/80 text-[#5A7FB2] border border-[#5A7FB2]/5 hover:bg-[#AFCDF5]/10"
                           )}
                         >
                           {cat}
                         </button>
                       ))}
                    </div>
                 </div>

                 <div className="flex-1 overflow-y-auto pr-2 hide-scrollbar space-y-8 pb-12">
                    {(activeStickerCategory === 'All' || activeStickerCategory === 'Tape') && (
                       <div className="space-y-5">
                          <p className="text-[10px] font-black text-[#24344D]/40 uppercase tracking-[0.2em]">Tape</p>
                          <div className="grid grid-cols-3 gap-4">
                             {TAPE_ITEMS.map(item => (
                               <button 
                                 key={item.id}
                                 onClick={() => addSticker(item)}
                                 className="group p-5 bg-white rounded-[24px] border border-black/5 hover:border-[#AFCDF5] hover:shadow-xl hover:-translate-y-0.5 transition-all flex flex-col items-center gap-3"
                               >
                                  <div className={cn(
                                    "w-16 h-5 border shadow-sm",
                                    item.content === 'grid' ? "bg-white bg-[radial-gradient(#00000011_1px,transparent_1px)] bg-[size:5px_5px]" : ""
                                  )} style={{ backgroundColor: item.content !== 'grid' ? item.content : 'transparent' }} />
                                  <span className="text-[10px] font-bold text-[#24344D]/60 uppercase tracking-tight">{item.label}</span>
                               </button>
                             ))}
                          </div>
                       </div>
                    )}

                    {(activeStickerCategory === 'All' || activeStickerCategory === 'Stickers') && (
                       <div className="space-y-5">
                          <p className="text-[10px] font-black text-[#24344D]/40 uppercase tracking-[0.2em]">Stickers</p>
                          <div className="grid grid-cols-5 gap-4">
                             {STICKER_ITEMS.map(item => (
                               <button 
                                 key={item.id}
                                 onClick={() => addSticker(item)}
                                 className="aspect-square bg-white rounded-[20px] border border-black/5 hover:border-[#AFCDF5] hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center text-3xl shadow-sm"
                               >
                                  {item.content}
                               </button>
                             ))}
                          </div>
                       </div>
                    )}

                    {(activeStickerCategory === 'All' || activeStickerCategory === 'Doodles') && (
                       <div className="space-y-5">
                          <p className="text-[10px] font-black text-[#24344D]/40 uppercase tracking-[0.2em]">Doodles</p>
                          <div className="grid grid-cols-5 gap-4">
                             {DOODLE_ITEMS.map(item => (
                               <button 
                                 key={item.id}
                                 onClick={() => addSticker(item)}
                                 className="aspect-square bg-white rounded-[20px] border border-black/5 hover:border-[#AFCDF5] hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center text-[#5A7FB2]/80 shadow-sm"
                               >
                                  <item.content size={28} />
                               </button>
                             ))}
                          </div>
                       </div>
                    )}

                    {(activeStickerCategory === 'All' || activeStickerCategory === 'Text') && (
                       <div className="space-y-5">
                          <p className="text-[10px] font-black text-[#24344D]/40 uppercase tracking-[0.2em]">Text Stamps</p>
                          <div className="grid grid-cols-2 gap-4">
                             {TEXT_STAMPS.map(item => (
                               <button 
                                 key={item.id}
                                 onClick={() => addSticker(item)}
                                 className="p-5 bg-white rounded-[24px] border border-black/5 hover:border-[#AFCDF5] hover:shadow-xl hover:-translate-y-0.5 transition-all text-left group shadow-sm"
                               >
                                  <span className="text-[11px] font-serif italic text-[#24344D]/70 group-hover:text-[#5A7FB2]">"{item.content}"</span>
                               </button>
                             ))}
                          </div>
                       </div>
                    )}
                 </div>

                 <div className="pt-5 border-t border-[#24344D]/10 flex justify-between items-center opacity-50 shrink-0 mb-1">
                    <p className="text-[9px] font-bold text-[#24344D] uppercase tracking-widest">NorthVows Studio</p>
                    <div className="flex gap-2.5">
                       <div className="w-2 h-2 bg-[#24344D] rounded-full" />
                       <div className="w-2 h-2 bg-[#AFCDF5] rounded-full" />
                    </div>
                 </div>
              </div>
           </motion.div>
        </aside>

        {/* CENTER: Main Editable Photostrip - Scrollable Canvas */}
        <div className="flex-1 flex flex-col items-center justify-start lg:justify-center py-6 lg:py-2 order-1 lg:order-2 overflow-visible lg:overflow-y-auto hide-scrollbar">
           <div id="scrapbook-workspace-content" className="relative p-12 sm:p-16 flex flex-col items-center scale-[0.75] sm:scale-90 lg:scale-100 origin-center">
              <div className="absolute top-12 left-1/2 -translate-x-1/2 w-40 h-12 bg-white/20 backdrop-blur-sm border border-white/10 rotate-[-1deg] -z-10 shadow-sm" />
              
              <div className="relative group lg:scale-[1.15] origin-center transition-transform duration-500">
                 <div className="relative shadow-[0_40px_80px_-15px_rgba(36,52,77,0.3)]">
                   <PhotoStripPreview 
                      photos={capturedPhotos} 
                      frame={selectedFrame} 
                      layout={selectedLayout} 
                   />
                 </div>

                 <AnimatePresence>
                    {stickers.map((sticker) => (
                      <DraggableSticker 
                        key={sticker.id}
                        sticker={sticker}
                        updateStickerNoHistory={updateStickerNoHistory}
                        pushToHistory={pushToHistory}
                        stickers={stickers}
                      />
                    ))}
                 </AnimatePresence>
              </div>
           </div>
        </div>

        {/* RIGHT: Frame & Layout Info - Now on the RIGHT for Desktop */}
        <aside className="w-full lg:w-[420px] flex flex-col h-[600px] lg:h-full py-2 order-2 lg:order-3">
           <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             className="bg-white/70 backdrop-blur-md rounded-[24px] sm:rounded-[32px] p-5 sm:p-7 border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col h-full overflow-hidden"
           >
              <div className="space-y-6 flex flex-col h-full lg:overflow-hidden">
                 {/* Mobile Quick Stamp Reel - with Titles & Categories */}
                 <div className="lg:hidden w-full pb-4 mb-2 border-b border-[#24344D]/5">
                    <div className="flex items-center justify-between mb-3 px-1">
                       <p className="text-[10px] font-black text-[#5A7FB2] uppercase tracking-[0.3em]">Decoration Stample</p>
                       <div className="w-8 h-px bg-[#24344D]/10" />
                    </div>
                    
                    <div className="flex gap-5 overflow-x-auto hide-scrollbar -mx-1 px-1 py-1">
                       {/* Tape Group */}
                       <div className="flex flex-col gap-2 shrink-0">
                          <span className="text-[8px] font-bold text-[#24344D]/30 uppercase tracking-widest px-0.5">Tape</span>
                          <div className="flex gap-2">
                             {TAPE_ITEMS.map(item => (
                               <button key={item.id} onClick={() => addSticker(item)} className="flex-shrink-0 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-xl border border-white shadow-sm flex items-center justify-center active:scale-95 transition-all">
                                  <div className="w-5 h-2 rounded-[1px]" style={{ backgroundColor: item.content !== 'grid' ? item.content : '#eee' }} />
                               </button>
                             ))}
                          </div>
                       </div>
                       
                       <div className="w-px h-10 bg-[#24344D]/5 shrink-0 mt-5" />

                       {/* Sticker Group */}
                       <div className="flex flex-col gap-2 shrink-0">
                          <span className="text-[8px] font-bold text-[#24344D]/30 uppercase tracking-widest px-0.5">Stickers</span>
                          <div className="flex gap-2">
                             {STICKER_ITEMS.map(item => (
                               <button key={item.id} onClick={() => addSticker(item)} className="flex-shrink-0 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-xl border border-white shadow-sm flex items-center justify-center text-xl active:scale-95 transition-all">
                                  {item.content}
                               </button>
                             ))}
                          </div>
                       </div>

                       <div className="w-px h-10 bg-[#24344D]/5 shrink-0 mt-5" />

                       {/* Doodle Group */}
                       <div className="flex flex-col gap-2 shrink-0">
                          <span className="text-[8px] font-bold text-[#24344D]/30 uppercase tracking-widest px-0.5">Doodles</span>
                          <div className="flex gap-2">
                             {DOODLE_ITEMS.map(item => (
                               <button key={item.id} onClick={() => addSticker(item)} className="flex-shrink-0 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-xl border border-white shadow-sm flex items-center justify-center text-[#5A7FB2]/80 active:scale-95 transition-all">
                                  <item.content size={18} />
                               </button>
                             ))}
                          </div>
                       </div>

                       <div className="w-px h-10 bg-[#24344D]/5 shrink-0 mt-5" />

                       {/* Text Group */}
                       <div className="flex flex-col gap-2 shrink-0">
                          <span className="text-[8px] font-bold text-[#24344D]/30 uppercase tracking-widest px-0.5">Text</span>
                          <div className="flex gap-2">
                             {TEXT_STAMPS.map(item => (
                               <button key={item.id} onClick={() => addSticker(item)} className="flex-shrink-0 px-3 h-10 bg-white/80 backdrop-blur-sm rounded-xl border border-white shadow-sm flex items-center justify-center active:scale-95 transition-all whitespace-nowrap">
                                  <span className="text-[9px] font-serif italic text-[#24344D]/80">"{item.content}"</span>
                               </button>
                             ))}
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
                    <div className="space-y-1.5">
                       <p className="text-[10px] sm:text-[11px] font-black text-[#5A7FB2] uppercase tracking-[0.3em]">Select Frame</p>
                       <h4 className="text-sm sm:text-base font-black text-[#24344D] uppercase tracking-tight">Aesthetic Themes</h4>
                    </div>
                    {/* Category Filters */}
                    <div className="flex gap-2 overflow-x-auto hide-scrollbar max-w-full sm:max-w-[240px] p-1">
                       {['All', 'Vintage', 'Korean', 'Minimal', 'Playful'].map(cat => (
                         <button
                           key={cat}
                           onClick={() => setActiveFrameCategory(cat === 'All' ? 'All Styles' : cat)}
                           className={cn(
                             "px-3.5 py-2 rounded-full text-[9px] font-bold uppercase tracking-wider transition-all whitespace-nowrap",
                             (activeFrameCategory === cat || (activeFrameCategory === 'All' && cat === 'All Styles'))
                               ? "bg-[#5A7FB2] text-white shadow-lg shadow-[#5A7FB2]/20" 
                               : "bg-white/80 text-[#5A7FB2] border border-[#5A7FB2]/10 hover:bg-[#AFCDF5]/10"
                           )}
                         >
                           {cat}
                         </button>
                       ))}
                    </div>
                 </div>

                 {/* Scrollable Frame List - Fixed padding to prevent clipping */}
                 <div className="flex-1 min-h-[300px] lg:min-h-0 overflow-y-auto pr-2 hide-scrollbar pb-12">
                    <FrameSelector 
                      selectedFrame={selectedFrame}
                      onSelect={setSelectedFrame}
                      selectedLayout={selectedLayout}
                      activeCategory={activeFrameCategory}
                      layoutMode="grid"
                    />
                 </div>

                 <div className="flex items-center gap-8 pt-6 border-t border-[#24344D]/10 shrink-0 mb-6 sm:mb-1">
                    <div className="space-y-1.5 min-w-[120px]">
                        <p className="text-[10px] font-black text-[#5A7FB2] uppercase tracking-[0.3em]">Active Layout</p>
                        <h4 className="text-sm font-black text-[#24344D] uppercase">{selectedLayout.id}</h4>
                    </div>
                    <div className="flex-1 grid grid-cols-8 gap-2 opacity-30">
                        {[...Array(selectedLayout.cols * selectedLayout.rows)].map((_, i) => (
                          <div key={i} className="aspect-square bg-[#24344D] rounded-[3px]" />
                        ))}
                    </div>
                 </div>
              </div>
           </motion.div>
        </aside>
      </div>

      {/* BOTTOM: Action Bar - Compact */}
      <div className="fixed bottom-0 left-0 w-full z-[100] p-4 sm:p-6 pointer-events-none">
         <div className="max-w-[1600px] mx-auto w-full flex items-center justify-center">
            <div className="flex items-center bg-white/80 backdrop-blur-2xl border border-white shadow-[0_10px_40px_rgba(0,0,0,0.1)] rounded-full pointer-events-auto overflow-hidden p-1">
               <div className="flex items-center mr-1">
                  <button onClick={undo} disabled={historyIndex < 0} className="p-2.5 text-[#24344D]/40 hover:text-[#5A7FB2] disabled:opacity-20 transition-all rounded-full" title="Undo">
                     <Undo2 size={14} />
                  </button>
                  <button onClick={redo} disabled={historyIndex >= history.length - 1} className="p-2.5 text-[#24344D]/40 hover:text-[#5A7FB2] disabled:opacity-20 transition-all rounded-full" title="Redo">
                     <Redo2 size={14} />
                  </button>
                  <button onClick={resetStickers} className="p-2.5 text-[#24344D]/40 hover:text-red-400 hover:bg-red-50/50 transition-all rounded-full" title="Reset All">
                     <RefreshCcw size={14} />
                  </button>
               </div>
               <motion.button
                 whileHover={{ scale: 1.02 }}
                 whileTap={{ scale: 0.98 }}
                 onClick={handleDownload}
                 disabled={isDownloading}
                 className={cn(
                   "flex items-center gap-2 px-6 py-3 bg-gradient-to-br from-[#AFCDF5] to-[#5A7FB2] text-white rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-lg transition-all",
                   isDownloading && "opacity-80 cursor-wait"
                 )}
               >
                 {isDownloading ? <Loader2 size={12} className="animate-spin" /> : <Download size={12} />}
                 Save Changes
               </motion.button>
            </div>
         </div>
      </div>
    </main>
  );
}
