import { Slot } from '@/types';

/**
 * Automatically detects transparent rectangular slots in a PNG/WebP frame.
 * Uses pixel-level alpha channel analysis to find contiguous transparent areas.
 */
export async function detectFrameSlots(imageUrl: string): Promise<Slot[]> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return reject('Could not get canvas context');

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const { data, width, height } = imageData;
      
      const visited = new Uint8Array(width * height);
      const slots: Slot[] = [];

      // Thresholds to filter noise
      const minWidth = width * 0.05; // 5% of width
      const minHeight = height * 0.05; // 5% of height

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const idx = (y * width + x);
          const alphaIdx = idx * 4 + 3;

          // If transparent and not visited
          if (data[alphaIdx] < 10 && !visited[idx]) {
            // Found a potential slot, let's find its bounds
            const bounds = findRegionBounds(data, visited, x, y, width, height);
            
            if (bounds.width >= minWidth && bounds.height >= minHeight) {
              // Normalize coordinates (0 to 1) for responsiveness
              slots.push({
                x: bounds.x / width,
                y: bounds.y / height,
                width: bounds.width / width,
                height: bounds.height / height
              });
            }
          }
        }
      }

      // Sort slots top-to-bottom, left-to-right
      slots.sort((a, b) => {
        if (Math.abs(a.y - b.y) < 0.05) return a.x - b.x;
        return a.y - b.y;
      });

      resolve(slots);
    };
    img.onerror = reject;
    img.src = imageUrl;
  });
}

function findRegionBounds(
  data: Uint8ClampedArray, 
  visited: Uint8Array, 
  startX: number, 
  startY: number, 
  width: number, 
  height: number
) {
  let minX = startX;
  let maxX = startX;
  let minY = startY;
  let maxY = startY;

  const stack = [[startX, startY]];
  visited[startY * width + startX] = 1;

  while (stack.length > 0) {
    const [x, y] = stack.pop()!;
    
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;

    // Check 4 neighbors
    const neighbors = [
      [x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]
    ];

    for (const [nx, ny] of neighbors) {
      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        const nIdx = ny * width + nx;
        const nAlphaIdx = nIdx * 4 + 3;
        
        if (data[nAlphaIdx] < 10 && !visited[nIdx]) {
          visited[nIdx] = 1;
          stack.push([nx, ny]);
        }
      }
    }
  }

  return {
    x: minX,
    y: minY,
    width: maxX - minX + 1,
    height: maxY - minY + 1
  };
}
