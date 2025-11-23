import React, { useState } from 'react';
import { CanvasConfig, FONTS } from '../types';
import { generateCreativePhrases } from '../services/geminiService';
import { Sparkles, Loader2, Video, StopCircle, Type, ALargeSmall, AlignJustify, Palette } from 'lucide-react';

interface ControlsProps {
  config: CanvasConfig;
  setConfig: React.Dispatch<React.SetStateAction<CanvasConfig>>;
  onStartRecording: () => void;
  onStopRecording: () => void;
  isRecording: boolean;
}

const Controls: React.FC<ControlsProps> = ({ config, setConfig, onStartRecording, onStopRecording, isRecording }) => {
  const [aiTopic, setAiTopic] = useState('');
  const [aiMood, setAiMood] = useState('Cyberpunk');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAi, setShowAi] = useState(false);

  const handleChange = <K extends keyof CanvasConfig>(key: K, value: CanvasConfig[K]) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleAiGenerate = async () => {
    if (!aiTopic) return;
    setIsGenerating(true);
    const phrases = await generateCreativePhrases(aiTopic, aiMood);
    setIsGenerating(false);
    if (phrases.length > 0) {
      handleChange('text', phrases[0]); 
    }
  };

  return (
    <div className="w-full h-full bg-slate-800/90 backdrop-blur-md p-6 overflow-y-auto border-r border-slate-700 flex flex-col gap-6 shadow-2xl">
      <div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-2">
          Infinity Loop
        </h1>
        <p className="text-slate-400 text-sm">Create hypnotic text streams.</p>
      </div>

      {/* Main Text Input */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase text-slate-400 tracking-wider flex items-center gap-2">
            <Type size={12}/> Content
        </label>
        <textarea
          value={config.text}
          onChange={(e) => handleChange('text', e.target.value)}
          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none resize-none h-24 font-mono text-sm"
          placeholder="Type something..."
        />
        <button 
          onClick={() => setShowAi(!showAi)}
          className="text-xs flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          <Sparkles size={12} />
          {showAi ? 'Hide AI Assistant' : 'AI Magic Writer'}
        </button>
      </div>

      {/* AI Assistant Panel */}
      {showAi && (
        <div className="bg-slate-900/50 p-4 rounded-lg border border-cyan-900/30 space-y-3 animate-in fade-in slide-in-from-top-2">
            <div className="space-y-1">
                <label className="text-xs text-slate-400">Topic</label>
                <input 
                    type="text" 
                    value={aiTopic}
                    onChange={(e) => setAiTopic(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-sm text-white"
                    placeholder="e.g. Future, Coffee, coding"
                />
            </div>
            <div className="space-y-1">
                <label className="text-xs text-slate-400">Mood</label>
                <select 
                    value={aiMood}
                    onChange={(e) => setAiMood(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-sm text-white"
                >
                    <option>Cyberpunk</option>
                    <option>Retro</option>
                    <option>Minimalist</option>
                    <option>Aggressive</option>
                    <option>Calm</option>
                </select>
            </div>
            <button 
                onClick={handleAiGenerate}
                disabled={isGenerating || !aiTopic}
                className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2 rounded text-sm font-medium flex items-center justify-center gap-2 transition-all"
            >
                {isGenerating ? <Loader2 className="animate-spin" size={16}/> : <Sparkles size={16}/>}
                Generate
            </button>
        </div>
      )}

      {/* Typography */}
      <div className="space-y-5 border-t border-slate-700 pt-4">
        <label className="text-xs font-semibold uppercase text-slate-400 tracking-wider flex items-center gap-2">
            <ALargeSmall size={12}/> Typography
        </label>
        
        <div className="grid grid-cols-1 gap-3">
             <select
                value={config.fontFamily}
                onChange={(e) => handleChange('fontFamily', e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm text-white"
             >
                {FONTS.map(f => (
                    <option key={f.name} value={f.value}>{f.name}</option>
                ))}
             </select>
        </div>

        <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-700">
            {['none', 'uppercase', 'lowercase'].map((t) => (
                <button
                    key={t}
                    onClick={() => handleChange('textTransform', t as any)}
                    className={`flex-1 py-1 text-xs rounded capitalize ${config.textTransform === t ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                    {t}
                </button>
            ))}
        </div>

        <div className="space-y-3">
             <div className="space-y-1">
                 <div className="flex justify-between text-xs text-slate-400">
                    <span>Size</span>
                    <span>{config.fontSize}px</span>
                 </div>
                 <input
                    type="range"
                    min="20"
                    max="400"
                    value={config.fontSize}
                    onChange={(e) => handleChange('fontSize', Number(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                 />
             </div>

             <div className="space-y-1">
                 <div className="flex justify-between text-xs text-slate-400">
                    <span>Letter Spacing</span>
                    <span>{config.letterSpacing}px</span>
                 </div>
                 <input
                    type="range"
                    min="-20"
                    max="100"
                    value={config.letterSpacing}
                    onChange={(e) => handleChange('letterSpacing', Number(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                 />
             </div>

             <div className="space-y-1">
                 <div className="flex justify-between text-xs text-slate-400">
                    <span>Line Height</span>
                    <span>{config.lineHeight}x</span>
                 </div>
                 <input
                    type="range"
                    min="0.5"
                    max="3"
                    step="0.1"
                    value={config.lineHeight}
                    onChange={(e) => handleChange('lineHeight', Number(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                 />
             </div>
        </div>
        
        <div className="flex items-center justify-between">
            <label className="text-sm text-slate-300">Outline Mode</label>
            <input 
                type="checkbox"
                checked={config.isOutline}
                onChange={(e) => handleChange('isOutline', e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500"
            />
        </div>
      </div>

       {/* Appearance (Colors & Shadows) */}
       <div className="space-y-4 border-t border-slate-700 pt-4">
        <label className="text-xs font-semibold uppercase text-slate-400 tracking-wider flex items-center gap-2">
             <Palette size={12}/> Appearance
        </label>
        
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
                <label className="text-xs text-slate-400 block">Text Color</label>
                <div className="flex items-center gap-2">
                    <input 
                        type="color"
                        value={config.textColor}
                        onChange={(e) => handleChange('textColor', e.target.value)}
                        className="w-8 h-8 rounded cursor-pointer bg-transparent border-0 p-0"
                    />
                    <span className="text-xs text-slate-500 font-mono">{config.textColor}</span>
                </div>
            </div>
            <div className="space-y-1">
                <label className="text-xs text-slate-400 block">Bg Color</label>
                <div className="flex items-center gap-2">
                    <input 
                        type="color"
                        value={config.bgColor}
                        onChange={(e) => handleChange('bgColor', e.target.value)}
                        className="w-8 h-8 rounded cursor-pointer bg-transparent border-0 p-0"
                    />
                    <span className="text-xs text-slate-500 font-mono">{config.bgColor}</span>
                </div>
            </div>
        </div>

        <div className="space-y-3 bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
            <div className="flex justify-between items-center">
                <label className="text-xs text-slate-400 font-bold">Shadow</label>
                <input 
                    type="color"
                    value={config.shadowColor}
                    onChange={(e) => handleChange('shadowColor', e.target.value)}
                    className="w-6 h-6 rounded cursor-pointer bg-transparent border-0 p-0"
                />
            </div>
            
            <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                    <label className="text-[10px] text-slate-500">Blur</label>
                    <input
                        type="range"
                        min="0"
                        max="50"
                        value={config.shadowBlur}
                        onChange={(e) => handleChange('shadowBlur', Number(e.target.value))}
                        className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] text-slate-500">X Offset</label>
                    <input
                        type="range"
                        min="-50"
                        max="50"
                        value={config.shadowOffsetX}
                        onChange={(e) => handleChange('shadowOffsetX', Number(e.target.value))}
                        className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    />
                </div>
                <div className="space-y-1 col-span-2">
                    <label className="text-[10px] text-slate-500">Y Offset</label>
                    <input
                        type="range"
                        min="-50"
                        max="50"
                        value={config.shadowOffsetY}
                        onChange={(e) => handleChange('shadowOffsetY', Number(e.target.value))}
                        className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    />
                </div>
            </div>
        </div>
      </div>

      {/* Animation */}
      <div className="space-y-4 border-t border-slate-700 pt-4">
        <label className="text-xs font-semibold uppercase text-slate-400 tracking-wider flex items-center gap-2">
            <AlignJustify size={12} className="rotate-90"/> Animation
        </label>
        
        <div className="space-y-1">
             <div className="flex justify-between text-xs text-slate-400">
                <span>Speed</span>
                <span>{config.speed}</span>
             </div>
             <input
                type="range"
                min="0"
                max="50"
                step="0.5"
                value={config.speed}
                onChange={(e) => handleChange('speed', Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
             />
        </div>

        <div className="flex gap-2">
            <button 
                onClick={() => handleChange('direction', 'left')}
                className={`flex-1 py-2 text-xs font-bold rounded ${config.direction === 'left' ? 'bg-slate-600 text-white' : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'}`}
            >
                LEFT
            </button>
            <button 
                onClick={() => handleChange('direction', 'right')}
                className={`flex-1 py-2 text-xs font-bold rounded ${config.direction === 'right' ? 'bg-slate-600 text-white' : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'}`}
            >
                RIGHT
            </button>
        </div>
      </div>

      {/* Export */}
      <div className="border-t border-slate-700 pt-6 mt-auto">
        <button
            onClick={isRecording ? onStopRecording : onStartRecording}
            className={`w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all shadow-lg ${
                isRecording 
                ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500'
            }`}
        >
            {isRecording ? <StopCircle className="fill-current" /> : <Video />}
            {isRecording ? 'STOP RECORDING' : 'EXPORT MP4/WEBM'}
        </button>
        {isRecording && <p className="text-center text-xs text-red-400 mt-2">Recording... Click stop to save.</p>}
      </div>

    </div>
  );
};

export default Controls;