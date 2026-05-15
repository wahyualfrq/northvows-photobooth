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
  { id: 'stick-jam', type: 'sticker', content: '/images/stample/jam1.webp', label: 'Clock' },
  { id: 'stick-kupu', type: 'sticker', content: '/images/stample/kupu2.webp', label: 'Butterfly' },
  { id: 'stick-star', type: 'sticker', content: '/images/stample/starstample.webp', label: 'Star Stamp' },
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

function DraggableSticker({ sticker, updateStickerNoHistory, pushToHistory, setStickers, stickers, isGenerating }: { 
  sticker: StickerInstance, 
  updateStickerNoHistory: (id: string, updates: Partial<StickerInstance>) => void,
  pushToHistory: (stickers: StickerInstance[]) => void,
  setStickers: React.Dispatch<React.SetStateAction<StickerInstance[]>>,
  stickers: StickerInstance[],
  isGenerating: boolean
}) {
  return (
    <motion.div
      drag
      dragMomentum={false}
      onDragEnd={(_, info) => {
        const newX = sticker.x + (info.offset.x / window.innerWidth) * 100;
        const newY = sticker.y + (info.offset.y / window.innerHeight) * 100;
        const newStickers = stickers.map(s => s.id === sticker.id ? { ...s, x: newX, y: newY } : s);
        pushToHistory(newStickers);
      }}
      initial={{ scale: 0, rotate: sticker.rotation }}
      animate={{ scale: sticker.scale, rotate: sticker.rotation }}
      exit={{ scale: 0 }}
      style={{ 
         touchAction: 'none', 
         position: 'absolute', 
         left: `${sticker.x}%`, 
         top: `${sticker.y}%`,
         cursor: 'grab',
         zIndex: 100
      }}
      className="group/sticker"
    >
      <div className="cursor-grab active:cursor-grabbing">
        {sticker.type === 'sticker' && (
          <>
            {typeof sticker.content === 'string' && sticker.content.startsWith('/images/') ? (
              <img src={sticker.content} alt="Sticker" className="w-20 h-auto filter drop-shadow-2xl select-none pointer-events-none" />
            ) : (
              <span className="text-5xl filter drop-shadow-2xl select-none pointer-events-none">{sticker.content}</span>
            )}
          </>
        )}
        {sticker.type === 'tape' && (
          <div className={cn(
            "w-24 h-8 border shadow-md flex items-center justify-center opacity-90 pointer-events-none",
            sticker.content === 'grid' ? "bg-white bg-[radial-gradient(#00000022_1px,transparent_1px)] bg-[size:6px_6px]" : ""
          )} style={{ backgroundColor: sticker.content !== 'grid' ? sticker.content : 'transparent' }}>
             <div className="w-full h-px bg-white/20" />
          </div>
        )}
        {sticker.type === 'doodle' && (
          <div className="pointer-events-none">
            <sticker.content size={36} className="text-[#5A7FB2] filter drop-shadow-md" />
          </div>
        )}
        {sticker.type === 'text' && (
          <div className="bg-[#F6F0E8]/95 backdrop-blur-md px-5 py-2 border border-black/10 rounded shadow-lg pointer-events-none">
             <p className="text-[11px] font-serif italic text-[#24344D] whitespace-nowrap">{sticker.content}</p>
          </div>
        )}
      </div>

      {!isGenerating && (
        <div className="absolute -inset-4 border-2 border-[#AFCDF5]/50 opacity-100 lg:opacity-0 lg:group-hover/sticker:opacity-100 transition-opacity pointer-events-none rounded-sm">
          <div className="absolute inset-0 pointer-events-auto">
            {/* Scale Handle */}
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
              className="absolute -bottom-2 -right-2 w-6 h-6 bg-white border-2 border-[#AFCDF5] rounded-full cursor-nwse-resize z-[80] shadow-md" 
            />
            
            {/* Rotate Handle */}
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
              className="absolute -bottom-14 left-1/2 -translate-x-1/2 w-10 h-10 bg-white rounded-full shadow-2xl border-2 border-[#AFCDF5] flex items-center justify-center cursor-pointer z-[80]"
            >
               <RotateCcw size={16} className="text-[#5A7FB2]" />
            </motion.div>

            {/* Delete Button */}
            <button 
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => { 
                e.stopPropagation(); 
                const filtered = stickers.filter(s => s.id !== sticker.id);
                pushToHistory(filtered);
                setStickers(filtered);
              }}
              className="absolute -top-12 left-1/2 -translate-x-1/2 w-8 h-8 bg-white rounded-full shadow-lg border-2 border-red-100 flex items-center justify-center cursor-pointer hover:bg-red-50 text-red-500 z-[80]"
            >
               <Scissors size={14} />
            </button>
          </div>
        </div>
      )}
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
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationStep, setGenerationStep] = useState(0);
  const [mounted, setMounted] = useState(false);

  const generationSteps = [
    "Rendering your photos...",
    "Generating animated GIF...",
    "Preparing QR memory access...",
    "Saving digital memoir..."
  ];

  const handleStartGeneration = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);
    setGenerationStep(0);

    // Give a short delay to ensure React has rendered the UI without handles
    await new Promise(resolve => setTimeout(resolve, 100));

    // Capture the final memoir "Truly" - This bakes everything into one image
    const element = document.getElementById('photo-strip-preview-wrapper');
    if (element) {
      try {
        const isOverlay = selectedFrame.type === 'overlay';
        const dataUrl = await toPng(element, { 
          pixelRatio: isOverlay ? 1 : 2.5, // 1:1 if we use fixed dimensions, else high density
          canvasWidth: isOverlay ? 1200 : undefined,
          canvasHeight: isOverlay ? 1800 : undefined,
          backgroundColor: 'transparent',
          style: {
            transform: 'none',
            boxShadow: 'none',
            margin: '0',
            padding: '0'
          },
          cacheBust: true
        });
        localStorage.setItem('northvows_final_memoir', dataUrl);
      } catch (err) {
        console.error('Failed to capture memoir:', err);
      }
    }

    // Save state for fallback
    if (typeof window !== 'undefined') {
      localStorage.setItem('northvows_stickers', JSON.stringify(stickers));
      localStorage.setItem('northvows_selected_frame', JSON.stringify(selectedFrame));
      localStorage.setItem('northvows_selected_layout', JSON.stringify(selectedLayout));
    }

    // Simulated generation process - Exactly 7 seconds total
    for (let i = 0; i <= 100; i += 2) {
      setGenerationProgress(i);
      if (i === 25) setGenerationStep(1);
      if (i === 50) setGenerationStep(2);
      if (i === 75) setGenerationStep(3);
      await new Promise(resolve => setTimeout(resolve, 140)); // 140ms * 50 steps = 7000ms
    }

    // Smooth transition to preview page
    setTimeout(() => {
      router.push('/photobooth/preview');
    }, 500);
  };

  const handleDownload = async () => {
    // Keep this for actual download action if needed later
    const element = document.getElementById('scrapbook-workspace-content');
    if (!element) return;
    
    setIsGenerating(true);
    try {
      const dataUrl = await toPng(element, { 
        quality: 1,
        pixelRatio: 2,
        backgroundColor: '#FAF8F4'
      });
      const link = document.createElement('a');
      link.download = `northvows-memoir-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('northvows_selected_frame', selectedFrame.id);
      localStorage.setItem('northvows_selected_layout', JSON.stringify(selectedLayout));
    }
  }, [selectedFrame, selectedLayout]);

  useEffect(() => {
    setMounted(true);
    try {
      const savedPhotos = localStorage.getItem('northvows_captured_photos');
      const savedLayout = localStorage.getItem('northvows_selected_layout');
      
      if (savedPhotos) {
        const photos = JSON.parse(savedPhotos);
        setCapturedPhotos(photos);
        if (photos.length === 0) router.replace('/photobooth');
      } else {
        router.replace('/photobooth');
      }

      if (savedLayout) {
        try {
          const parsed = JSON.parse(savedLayout);
          const id = typeof parsed === 'string' ? parsed : parsed.id;
          const layout = layouts.find(l => l.id === id);
          if (layout) setSelectedLayout(layout);
        } catch (e) {
          const layout = layouts.find(l => l.id === savedLayout);
          if (layout) setSelectedLayout(layout);
        }
      }
    } catch (err) {
      router.replace('/photobooth');
    }
  }, [router]);
  
  if (!mounted) return null;

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


  if (capturedPhotos.length === 0) return null;

  return (
    <main className="h-screen bg-[#F8FBFF] flex flex-col relative lg:overflow-hidden pt-0 overflow-y-auto lg:overflow-y-hidden">
      {/* Dreamy Sky Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#AFCDF5]/10 to-transparent" />
        <div className="absolute top-[10%] -left-[10%] w-[50%] h-[50%] bg-[#AFCDF5]/15 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')]" />
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
                                  {typeof item.content === 'string' && item.content.startsWith('/images/') ? (
                                    <img src={item.content} alt={item.label} className="w-12 h-12 object-contain" />
                                  ) : (
                                    item.content
                                  )}
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
              
              <div id="final-memoir-capture" className="relative group lg:scale-[1.25] origin-center transition-transform duration-500">
                 <div id="photo-strip-preview-wrapper" className="relative shadow-[0_40px_100px_-15px_rgba(36,52,77,0.35)]">
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
                        setStickers={setStickers}
                        stickers={stickers}
                        isGenerating={isGenerating}
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
                      onSelect={(frame) => {
                        setSelectedFrame(frame);
                        if (frame.layoutId) {
                          const matchingLayout = layouts.find(l => l.id === frame.layoutId);
                          if (matchingLayout) setSelectedLayout(matchingLayout);
                        }
                      }}
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
                  onClick={handleStartGeneration}
                  disabled={isGenerating}
                  className={cn(
                    "flex items-center gap-2 px-6 py-3 bg-gradient-to-br from-[#AFCDF5] to-[#5A7FB2] text-white rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-lg transition-all relative overflow-hidden",
                    isGenerating && "opacity-90 cursor-wait"
                  )}
                >
                  {isGenerating ? (
                    <>
                       <div className="absolute inset-0 bg-white/20 animate-shimmer" />
                       <Loader2 size={12} className="animate-spin relative z-10" />
                       <span className="relative z-10">Preparing...</span>
                    </>
                  ) : (
                    <>
                       <Download size={12} />
                       Save Changes
                    </>
                  )}
                </motion.button>
            </div>
         </div>
      </div>

      {/* Cinematic Generation Overlay - Polaroid Printing Style */}
      <AnimatePresence>
        {isGenerating && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#FAF8F4] overflow-hidden"
          >
            {/* Aesthetic Background Atmosphere - Dreamy Denim Sky */}
            <div className="absolute inset-0 pointer-events-none">
               {/* Base Image Background & Layered Gradients */}
               <div className="absolute inset-0">
                  <img src="/images/bg.webp" alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-br from-[#BFD7F6]/30 via-transparent to-[#DCEBFA]/20 mix-blend-soft-light" />
               </div>
               
               
               {/* Denim-Inspired & Paper Texture Overlays */}
               <div className="absolute inset-0 opacity-[0.05] mix-blend-multiply bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')]" />
               <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

               {/* Soft Cloud Lighting / Haze */}
               <div className="absolute inset-0 bg-gradient-to-t from-[#FAF8F4] via-transparent to-transparent opacity-60" />

               {/* Floating Aesthetic Decorative Elements */}
               <div className="absolute inset-0 overflow-hidden">
                  {/* Atmospheric Clouds */}
                  <motion.div 
                     animate={{ x: [0, 20, 0], y: [0, -10, 0] }} 
                     transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                     className="absolute top-[15%] left-[10%] text-[#5A7FB2]/10"
                  >
                     <Cloud size={120} fill="currentColor" />
                  </motion.div>
                  <motion.div 
                     animate={{ x: [0, -15, 0], y: [0, 15, 0] }} 
                     transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                     className="absolute bottom-[10%] right-[15%] text-[#BFD7F6]/20"
                  >
                     <Cloud size={160} fill="currentColor" />
                  </motion.div>

                  {/* Scrapbook Tape & Icons */}
                  <div className="absolute top-[12%] right-[20%] w-16 h-5 bg-[#BFD7F6]/20 -rotate-12 border border-white/30 shadow-sm" />
                  <div className="absolute bottom-[20%] left-[10%] w-12 h-12 border border-[#5A7FB2]/10 rounded-full flex items-center justify-center -rotate-6">
                     <Smile size={24} className="text-[#5A7FB2]/20" />
                  </div>
                  <div className="absolute top-[40%] left-[5%] text-[#BFD7F6]/30">
                     <HeartIcon size={20} fill="currentColor" />
                  </div>
                  {/* Cinematic Drifting Particles */}
                  {[...Array(25)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ 
                        x: Math.random() * 100 + "%", 
                        y: Math.random() * 100 + "%",
                        scale: 0,
                        opacity: 0
                      }}
                      animate={{ 
                        y: [null, "-25%"],
                        scale: [0, 1, 0],
                        opacity: [0, 0.4, 0]
                      }}
                      transition={{ 
                        duration: Math.random() * 6 + 6,
                        repeat: Infinity,
                        delay: Math.random() * 5
                      }}
                      className="absolute w-1 h-1 bg-[#AFCDF5] rounded-full blur-[0.5px]"
                    />
                  ))}
               </div>
            </div>

            {/* Content Section */}
            {/* Content Section - Adjusted for notch clearance & higher position */}
            <div className="relative z-20 flex flex-col items-center w-full max-w-4xl -translate-y-20 sm:-translate-y-28 pt-12 sm:pt-0">
               {/* Header Text */}
               <motion.div 
                 initial={{ opacity: 0, y: -20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.3 }}
                 className="text-center space-y-3 mb-0"
               >
                  <h2 className="text-3xl sm:text-4xl font-black text-[#FAF8F4] tracking-tighter uppercase leading-none drop-shadow-md">
                    GENERATING <br /> <span className="serif-italic font-normal text-[#DCEBFA] lowercase">your</span> MEMORY
                  </h2>
                  <p className="text-[10px] sm:text-[11px] font-bold text-[#FAF8F4]/90 uppercase tracking-[0.3em] leading-relaxed max-w-[280px] mx-auto drop-shadow-sm">
                    Please wait while we prepare your nostalgic moment.
                  </p>
               </motion.div>

               {/* MAIN VISUAL: Polaroid Machine & Printing Animation */}
               <div className="relative flex flex-col items-center justify-center w-full h-[480px] -mt-20">
                  
                  {/* The Polaroid Assets - Printing from below */}
                  <div className="absolute top-[200px] flex flex-col items-center pointer-events-none">
                     {/* Frame 1 */}
                     <motion.div
                        initial={{ y: -80, opacity: 0, rotate: 0 }}
                        animate={{ y: 140, opacity: 1, rotate: -2 }}
                        transition={{ 
                           delay: 1.0,
                           duration: 3,
                           ease: [0.22, 1, 0.36, 1]
                        }}
                        className="absolute w-40 sm:w-52 aspect-[3/4] bg-white p-2 sm:p-3 pb-8 sm:pb-12 rounded-sm shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-white/50"
                     >
                        <div className="w-full h-full bg-[#FAF8F4] overflow-hidden rounded-[1px] shadow-inner">
                           <img src={capturedPhotos[0]} className="w-full h-full object-cover grayscale-[0.2] brightness-110" />
                        </div>
                     </motion.div>

                     {/* Frame 2 */}
                     <motion.div
                        initial={{ y: -80, opacity: 0, rotate: 0 }}
                        animate={{ y: 90, opacity: 1, rotate: 1 }}
                        transition={{ 
                           delay: 3.0,
                           duration: 3,
                           ease: [0.22, 1, 0.36, 1]
                        }}
                        className="absolute w-40 sm:w-52 aspect-[3/4] bg-white p-2 sm:p-3 pb-8 sm:pb-12 rounded-sm shadow-[0_10px_30px_rgba(0,0,0,0.1)] border border-white/50"
                     >
                        <div className="w-full h-full bg-[#FAF8F4] overflow-hidden rounded-[1px] shadow-inner">
                           <img src={capturedPhotos[1] || capturedPhotos[0]} className="w-full h-full object-cover grayscale-[0.2] brightness-110" />
                        </div>
                     </motion.div>

                     {/* Frame 3 */}
                     <motion.div
                        initial={{ y: -80, opacity: 0, rotate: 0 }}
                        animate={{ y: 40, opacity: 1, rotate: -1 }}
                        transition={{ 
                           delay: 5.0,
                           duration: 3,
                           ease: [0.22, 1, 0.36, 1]
                        }}
                        className="absolute w-40 sm:w-52 aspect-[3/4] bg-white p-2 sm:p-3 pb-8 sm:pb-12 rounded-sm shadow-[0_15px_40px_rgba(0,0,0,0.12)] border border-white/50"
                     >
                        <div className="w-full h-full bg-[#FAF8F4] overflow-hidden rounded-[1px] shadow-inner">
                           <img src={capturedPhotos[2] || capturedPhotos[0]} className="w-full h-full object-cover grayscale-[0.2] brightness-110" />
                        </div>
                     </motion.div>
                  </div>

                  {/* The Camera Asset - CENTER & TOP LAYER */}
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative z-50 w-80 sm:w-[480px] h-80 sm:h-[480px] flex items-center justify-center"
                  >
                     <img 
                        src="/images/polaroid.webp" 
                        alt="Polaroid Machine" 
                        className="w-full h-full object-contain filter drop-shadow-[0_20px_50px_rgba(0,0,0,0.1)]"
                     />
                  </motion.div>
               </div>

            </div>

            {/* Soft Ambient Vignette */}
            <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_150px_rgba(0,0,0,0.03)]" />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
