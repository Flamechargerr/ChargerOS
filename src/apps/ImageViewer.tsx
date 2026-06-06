import { useState } from 'react';
import { Image, ZoomIn, ZoomOut, RotateCw, Download, ChevronLeft, ChevronRight } from 'lucide-react';

const sampleImages = [
  { name: 'mountain.jpg', color: '#4a6fa5' },
  { name: 'sunset.jpg', color: '#c75b39' },
  { name: 'forest.jpg', color: '#2d5a3d' },
  { name: 'ocean.jpg', color: '#1a5f7a' },
];

export default function ImageViewer() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const img = sampleImages[currentIdx];

  return (
    <div className="flex flex-col h-full bg-[#1a1a1a]">
      <div className="flex items-center justify-between px-4 py-2 bg-[#252526] border-b border-[#333]">
        <span className="text-white/60 text-sm">{img.name}</span>
        <div className="flex items-center gap-1">
          <button onClick={() => setZoom(z => Math.max(50, z - 10))} className="p-1.5 rounded hover:bg-white/10 text-white/60"><ZoomOut size={14} /></button>
          <span className="text-white/40 text-xs w-10 text-center">{zoom}%</span>
          <button onClick={() => setZoom(z => Math.min(300, z + 10))} className="p-1.5 rounded hover:bg-white/10 text-white/60"><ZoomIn size={14} /></button>
          <button onClick={() => setRotation(r => r + 90)} className="p-1.5 rounded hover:bg-white/10 text-white/60"><RotateCw size={14} /></button>
          <button className="p-1.5 rounded hover:bg-white/10 text-white/60"><Download size={14} /></button>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center overflow-hidden relative">
        <button onClick={() => setCurrentIdx(i => (i - 1 + sampleImages.length) % sampleImages.length)} className="absolute left-4 text-white/30 hover:text-white z-10"><ChevronLeft size={32} /></button>
        <div
          className="w-[500px] h-[350px] rounded-lg shadow-xl flex items-center justify-center"
          style={{ backgroundColor: img.color, transform: `scale(${zoom / 100}) rotate(${rotation}deg)`, transition: 'transform 0.3s' }}
        >
          <Image size={64} className="text-white/30" />
        </div>
        <button onClick={() => setCurrentIdx(i => (i + 1) % sampleImages.length)} className="absolute right-4 text-white/30 hover:text-white z-10"><ChevronRight size={32} /></button>
      </div>
      <div className="flex items-center justify-center gap-2 py-2 bg-[#252526]">
        {sampleImages.map((_, i) => (
          <button key={i} onClick={() => setCurrentIdx(i)} className={`w-2 h-2 rounded-full ${i === currentIdx ? 'bg-[#4a9eff]' : 'bg-white/20'}`} />
        ))}
      </div>
    </div>
  );
}
