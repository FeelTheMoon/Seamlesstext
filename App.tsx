import React, { useState, useRef } from 'react';
import CarouselCanvas, { CarouselCanvasHandle } from './components/CarouselCanvas';
import Controls from './components/Controls';
import { CanvasConfig, FONTS } from './types';
import { Menu, X } from 'lucide-react';

const DEFAULT_CONFIG: CanvasConfig = {
  text: 'INFINITE LOOP ',
  fontFamily: FONTS[0].value,
  fontSize: 120,
  textColor: '#ffffff',
  bgColor: '#000000',
  speed: 2,
  direction: 'left',
  isOutline: false,
  opacity: 1,
  letterSpacing: 0,
  lineHeight: 1.2,
  textTransform: 'none',
  shadowColor: '#000000',
  shadowBlur: 0,
  shadowOffsetX: 4,
  shadowOffsetY: 4
};

export default function App() {
  const [config, setConfig] = useState<CanvasConfig>(DEFAULT_CONFIG);
  const canvasRef = useRef<CarouselCanvasHandle>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const handleStartRecording = () => {
    canvasRef.current?.startRecording();
  };

  const handleStopRecording = () => {
    canvasRef.current?.stopRecording();
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-black text-white relative">
      
      {/* Mobile Toggle */}
      <button 
        className="absolute top-4 left-4 z-50 md:hidden bg-slate-800 p-2 rounded-md text-white border border-slate-600"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar Controls */}
      <div 
        className={`fixed md:relative z-40 h-full w-80 md:w-96 transform transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:ml-0'
        } bg-slate-900 shadow-2xl`}
      >
        <Controls 
          config={config} 
          setConfig={setConfig} 
          onStartRecording={handleStartRecording}
          onStopRecording={handleStopRecording}
          isRecording={canvasRef.current?.isRecording || false}
        />
      </div>

      {/* Main Canvas Area */}
      <main className="flex-1 relative h-full bg-checkered">
        {/* Helper pattern for transparency indication if needed, though we default black bg */}
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" 
             style={{ 
                 backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)', 
                 backgroundSize: '20px 20px' 
             }}>
        </div>

        <CarouselCanvas ref={canvasRef} config={config} />
        
        {/* Overlay info */}
        <div className="absolute bottom-6 right-6 pointer-events-none opacity-50 text-xs font-mono text-white text-right">
             RES: AUTO (DEVICE PIXEL RATIO)<br/>
             FPS: 60 (VSYNC)<br/>
             RENDER: CANVAS 2D
        </div>
      </main>
    </div>
  );
}