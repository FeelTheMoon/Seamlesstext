export interface CanvasConfig {
  text: string;
  fontFamily: string;
  fontSize: number;
  textColor: string;
  bgColor: string;
  speed: number; // pixels per frame
  direction: 'left' | 'right';
  isOutline: boolean;
  opacity: number;
  // New text properties
  letterSpacing: number;
  lineHeight: number;
  textTransform: 'none' | 'uppercase' | 'lowercase';
  // Shadow properties
  shadowColor: string;
  shadowBlur: number;
  shadowOffsetX: number;
  shadowOffsetY: number;
}

export const FONTS = [
  { name: 'Inter', value: '"Inter", sans-serif' },
  { name: 'Bebas Neue', value: '"Bebas Neue", sans-serif' },
  { name: 'Anton', value: '"Anton", sans-serif' },
  { name: 'Lobster', value: '"Lobster", cursive' },
  { name: 'Montserrat', value: '"Montserrat", sans-serif' },
  { name: 'Playfair Display', value: '"Playfair Display", serif' },
  { name: 'Roboto Mono', value: '"Roboto Mono", monospace' },
];

export interface AISuggestionRequest {
  topic: string;
  mood: string;
}