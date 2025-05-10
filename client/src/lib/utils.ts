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

/**
 * Formats a number as Tunisian Dinars (TND)
 * @param amount The amount to format
 * @param includeSymbol Whether to include the TND symbol
 * @returns Formatted price string
 */
export function formatPrice(amount: number | null | undefined, includeSymbol: boolean = true): string {
  if (amount === null || amount === undefined) return '';
  
  // Format with 3 decimal places which is standard for Tunisian Dinar
  const formattedAmount = amount.toFixed(3);
  
  // Return with TND symbol if requested
  return includeSymbol ? `${formattedAmount} TND` : formattedAmount;
}

/**
 * Formats a date for display
 * @param date The date to format
 * @returns Formatted date string in local format
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('default', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}
