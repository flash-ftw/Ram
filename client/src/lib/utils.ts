import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getImageUrl(url: string): string {
  if (!url) return '';
  
  // Check if this is an external URL (starts with http or https)
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // If it's an SVG file, use our API endpoint
  if (url.endsWith('.svg')) {
    // Extract filename and type (products or brands) from the URL
    const parts = url.split('/');
    const filename = parts[parts.length - 1];
    const type = parts[parts.length - 2];
    
    // Use our new API endpoint for SVG files
    return `/api/image/${type}/${filename}`;
  }
  
  // For all other file types, return the original URL
  return url;
}
