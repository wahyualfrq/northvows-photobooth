import { Frame } from '@/types';

export const frames: Frame[] = [
  // Color-based frames
  { id: 'vintage-blue', name: 'Vintage Blue', theme: 'light', category: 'Vintage', type: 'color' },
  { id: 'denim-memories', name: 'Denim Memories', theme: 'dark', category: 'Classic', type: 'color' },
  { id: 'soft-cloud', name: 'Soft Cloud', theme: 'light', category: 'Korean Mood', type: 'color' },
  { id: 'school-memoir', name: 'School Memoir', theme: 'light', category: 'Vintage', type: 'color' },
  { id: 'night-sky', name: 'Night Sky', theme: 'dark', category: 'Korean Mood', type: 'color' },
  { id: 'cream-diary', name: 'Cream Diary', theme: 'light', category: 'Minimal', type: 'color' },
  { id: 'bestie', name: 'Bestie', theme: 'light', category: 'Couple', type: 'color' },
  { id: 'playful-stars', name: 'Playful Stars', theme: 'light', category: 'Playful', type: 'color' },
  
  // Image Overlay-based frames (NEW CLEAN ARCHITECTURE)
  { 
    id: 'vintage-newspaper', 
    name: 'Newspaper', 
    overlayImage: '/images/frame/2x3/newspaper.webp', 
    theme: 'light', 
    category: 'Vintage', 
    type: 'overlay',
    layoutId: '2x3'
  },
];
