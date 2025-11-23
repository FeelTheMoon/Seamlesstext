import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { CanvasConfig } from '../types';

interface CarouselCanvasProps {
  config: CanvasConfig;
}

export interface CarouselCanvasHandle {
  startRecording: () => void;
  stopRecording: () => void;
  isRecording: boolean;
}

const CarouselCanvas = forwardRef<CarouselCanvasHandle, CarouselCanvasProps>(({ config }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>();
  const offsetRef = useRef<number>(0);
  
  // Recording State
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [isRecording, setIsRecording] = useState(false);

  useImperativeHandle(ref, () => ({
    startRecording: () => {
      if (!canvasRef.current) return;
      
      const stream = canvasRef.current.captureStream(60); // 60 FPS
      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9') 
        ? 'video/webm;codecs=vp9' 
        : 'video/webm'; // Fallback

      const recorder = new MediaRecorder(stream, { mimeType });
      
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        chunksRef.current = [];
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `infinity-loop-${Date.now()}.webm`;
        a.click();
        URL.revokeObjectURL(url);
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    },
    stopRecording: () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
      }
    },
    isRecording
  }));

  const draw = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const { 
      text, fontFamily, fontSize, textColor, bgColor, 
      speed, direction, isOutline, opacity,
      letterSpacing, lineHeight, textTransform,
      shadowColor, shadowBlur, shadowOffsetX, shadowOffsetY
    } = config;
    const dpr = window.devicePixelRatio || 1;
    
    // Clear background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width / dpr, canvas.height / dpr);

    // Context Setup
    ctx.font = `bold ${fontSize}px ${fontFamily}`;
    ctx.textBaseline = 'middle';
    
    // Apply Letter Spacing (Note: standard Canvas API support varies, manual fallback is complex, but modern browsers support this property)
    // @ts-ignore - TS definition might be missing for letterSpacing on some versions
    ctx.letterSpacing = `${letterSpacing}px`;

    // Style
    if (isOutline) {
      ctx.strokeStyle = textColor;
      ctx.lineWidth = 2;
      ctx.fillStyle = 'transparent';
    } else {
      ctx.fillStyle = textColor;
    }
    
    // Shadow
    ctx.shadowColor = shadowColor;
    ctx.shadowBlur = shadowBlur;
    ctx.shadowOffsetX = shadowOffsetX;
    ctx.shadowOffsetY = shadowOffsetY;
    
    ctx.globalAlpha = opacity;

    // Handle Text Transformation and Multiline
    const lines = text.split('\n');
    const transformedLines = lines.map(line => {
      if (textTransform === 'uppercase') return line.toUpperCase();
      if (textTransform === 'lowercase') return line.toLowerCase();
      return line;
    });

    // Measure Loop Width (widest line)
    let maxWidth = 0;
    transformedLines.forEach(line => {
      const metrics = ctx.measureText(line + " "); // Add space for loop gap
      if (metrics.width > maxWidth) maxWidth = metrics.width;
    });

    // Avoid infinite loop if width is 0
    if (maxWidth === 0) maxWidth = 100;

    const canvasWidth = canvas.width / dpr;
    const canvasHeight = canvas.height / dpr;
    
    // Calculate Block Dimensions for Multiline
    const lineHeightPx = fontSize * lineHeight;
    const totalBlockHeight = lineHeightPx * transformedLines.length;
    // Start Y to center the block vertically
    const startY = (canvasHeight - totalBlockHeight) / 2 + (lineHeightPx / 2);

    // Calculate how many repetitions we need to cover the screen width + buffer
    const repetitions = Math.ceil(canvasWidth / maxWidth) + 2;

    // Update Offset
    if (direction === 'left') {
      offsetRef.current -= speed;
      if (offsetRef.current <= -maxWidth) {
        offsetRef.current += maxWidth;
      }
    } else {
      offsetRef.current += speed;
      if (offsetRef.current >= 0) {
        offsetRef.current -= maxWidth;
      }
    }

    // Draw Loop
    for (let i = 0; i < repetitions; i++) {
        const blockX = offsetRef.current + (i * maxWidth);
        
        // Optimization: Only draw if visible
        if (blockX + maxWidth > 0 && blockX < canvasWidth) {
           transformedLines.forEach((line, lineIndex) => {
             const lineY = startY + (lineIndex * lineHeightPx);
             
             if (isOutline) {
               ctx.strokeText(line, blockX, lineY);
             } else {
               ctx.fillText(line, blockX, lineY);
             }
           });
        }
    }
    
    // Reset context for next frame potentially (though we clear it)
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1.0;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    // We want the internal resolution to match the display size * dpr
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    // Scale context to match
    ctx.scale(dpr, dpr);

    const animate = () => {
      draw(ctx, canvas);
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [config]); 

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full block touch-none"
      style={{ width: '100%', height: '100%' }}
    />
  );
});

export default CarouselCanvas;