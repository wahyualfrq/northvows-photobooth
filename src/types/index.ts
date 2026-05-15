export interface Slot {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Frame {
  id: string;
  name: string;
  url?: string;
  overlayImage?: string; // For frames like newspaper.webp
  theme: 'light' | 'dark';
  category?: string;
  type: 'color' | 'overlay';
  layoutId?: string; // Optional: specific to a layout (e.g., '2x3')
  slots?: Slot[]; // Automatically detected or manually defined
}

export interface Layout {
  id: string;
  name: string;
  rows: number;
  cols: number;
  description: string;
}
