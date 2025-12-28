/**
 * Custom Frame Types
 * TypeScript definitions for custom frame orders with image crop support
 */

export type ImageOrientation = "portrait" | "landscape" | "square";

export type FrameSize = "A4" | "12x18" | "18x24" | "24x36";

export type FrameStyle = "Black" | "White" | "Wooden";

export interface CropData {
  x: number;
  y: number;
  width: number;
  height: number;
  zoom?: number;
}

export interface UploadedImage {
  originalUrl: string;
  croppedUrl?: string;
  width: number;
  height: number;
  orientation: ImageOrientation;
  isCropped: boolean;
  cropData?: CropData;
}

export interface CustomFrameData {
  uploadedImage: UploadedImage;
  frameSize: FrameSize;
  frameStyle: FrameStyle;
  customerNotes?: string;
  occasion?: "custom" | "birthday" | "wedding";
  occasionMetadata?: {
    // Birthday-specific
    name?: string;
    age?: string;
    date?: string;
    message?: string;
    // Wedding-specific
    brideName?: string;
    groomName?: string;
    weddingDate?: string;
    quote?: string;
  };
}

export interface AspectRatioDimensions {
  width: number;
  height: number;
}
