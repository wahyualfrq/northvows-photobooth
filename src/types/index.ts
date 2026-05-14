export interface Frame {
  id: string;
  name: string;
  url: string;
  theme: 'light' | 'dark';
  category?: string;
}

export interface Layout {
  id: string;
  name: string;
  rows: number;
  cols: number;
  description: string;
}
