'use client';

import { useEffect, useState } from 'react';

/**
 * Merges a captured image with a frame SVG/PNG using Canvas API.
 */
export async function mergeImageWithFrame(
  imageSrc: string, 
  frameUrl: string, 
  mirrorPhoto: boolean = true
): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      reject(new Error('Could not get canvas context'));
      return;
    }

    // Set output size (600x800 as per SVG frames)
    canvas.width = 600;
    canvas.height = 800;

    const img = new Image();
    const frame = new Image();

    let loadedCount = 0;
    const checkLoaded = () => {
      loadedCount++;
      if (loadedCount === 2) {
        // 1. Draw image first
        const cutoutX = 40;
        const cutoutY = 40;
        const cutoutW = 520;
        const cutoutH = 520;

        const imgRatio = img.width / img.height;
        const targetRatio = cutoutW / cutoutH;
        
        let drawW, drawH, drawX, drawY;

        if (imgRatio > targetRatio) {
          drawH = cutoutH;
          drawW = img.width * (cutoutH / img.height);
          drawX = cutoutX - (drawW - cutoutW) / 2;
          drawY = cutoutY;
        } else {
          drawW = cutoutW;
          drawH = img.height * (cutoutW / img.width);
          drawX = cutoutX;
          drawY = cutoutY - (drawH - cutoutH) / 2;
        }

        // Draw webcam image
        ctx.save();
        ctx.translate(cutoutX + cutoutW/2, cutoutY + cutoutH/2);
        
        if (mirrorPhoto) {
          ctx.scale(-1, 1); // Mirror horizontally
        }
        
        ctx.drawImage(
          img, 
          -drawW/2 + (cutoutX + cutoutW/2 - drawX), 
          -drawH/2 + (cutoutY + cutoutH/2 - drawY), 
          drawW, 
          drawH, 
          -cutoutW/2, 
          -cutoutH/2, 
          cutoutW, 
          cutoutH
        );
        ctx.restore();

        // 2. Draw frame on top
        ctx.drawImage(frame, 0, 0, 600, 800);

        resolve(canvas.toDataURL('image/png'));
      }
    };

    img.onload = checkLoaded;
    frame.onload = checkLoaded;
    img.onerror = reject;
    frame.onerror = reject;

    img.src = imageSrc;
    frame.src = frameUrl;
  });
}

/**
 * Flips an image horizontally using Canvas API.
 */
export async function flipImageHorizontally(imageSrc: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context failed'));
        return;
      }
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = reject;
    img.src = imageSrc;
  });
}
