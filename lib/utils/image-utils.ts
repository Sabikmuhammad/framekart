/**
 * Image Utilities
 * Helper functions for image processing and orientation detection
 */

import { ImageOrientation, AspectRatioDimensions, FrameSize } from "@/lib/types/custom-frame";

/**
 * Detects the orientation of an image based on its dimensions
 */
export function detectImageOrientation(
  width: number,
  height: number
): ImageOrientation {
  if (height > width) return "portrait";
  if (width > height) return "landscape";
  return "square";
}

/**
 * Loads an image and returns its dimensions
 */
export function loadImage(src: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Gets the aspect ratio dimensions for a frame size
 */
export function getFrameDimensions(size: FrameSize): AspectRatioDimensions {
  const ratios: Record<FrameSize, AspectRatioDimensions> = {
    A4: { width: 210, height: 297 }, // A4 in mm
    "12x18": { width: 12, height: 18 },
    "18x24": { width: 18, height: 24 },
    "24x36": { width: 24, height: 36 },
  };
  return ratios[size];
}

/**
 * Calculates the aspect ratio from dimensions
 */
export function calculateAspectRatio(dimensions: AspectRatioDimensions): number {
  return dimensions.height / dimensions.width;
}

/**
 * Creates a cropped image from canvas
 */
export function createCroppedImage(
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number }
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    
    image.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      
      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;
      
      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Canvas is empty'));
          }
        },
        'image/jpeg',
        0.95
      );
    };
    
    image.onerror = () => reject(new Error('Failed to load image'));
    image.src = imageSrc;
  });
}

/**
 * Converts a blob to a data URL
 */
export function blobToDataURL(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
