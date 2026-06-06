import { useState, useRef, useCallback } from 'react';
import { Camera, Monitor, Crop, Download } from 'lucide-react';

export default function Screenshot() {
  const [mode, setMode] = useState<'full' | 'area'>('full');
  const [captured, setCaptured] = useState<string | null>(null);
  const [capturing, setCapturing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const capture = useCallback(() => {
    setCapturing(true);
    setTimeout(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      canvas.width = 640;
      canvas.height = 360;
      // Draw simulated desktop
      const gradient = ctx.createLinearGradient(0, 0, 640, 360);
      gradient.addColorStop(0, '#2c1e4a');
      gradient.addColorStop(0.5, '#6b2d5b');
      gradient.addColorStop(1, '#c75b39');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 640, 360);
      // Panel
      ctx.fillStyle = '#1e1e1e';
      ctx.fillRect(0, 0, 640, 24);
      // Taskbar
      ctx.fillRect(0, 336, 640, 24);
      // Icons
      ctx.fillStyle = '#ffffff30';
      for (let i = 0; i < 6; i++) {
        ctx.fillRect(20, 50 + i * 50, 40, 40);
      }
      // Windows
      ctx.fillStyle = '#2d2d2d';
      ctx.strokeStyle = '#4a9eff';
      ctx.lineWidth = 2;
      ctx.fillRect(120, 60, 300, 200);
      ctx.strokeRect(120, 60, 300, 200);
      ctx.fillStyle = '#3e3e3e';
      ctx.fillRect(120, 60, 300, 28);
      ctx.fillStyle = '#ccc';
      ctx.font = '12px sans-serif';
      ctx.fillText('Terminal', 140, 78);
      ctx.fillStyle = '#4af626';
      ctx.font = '10px monospace';
      ctx.fillText('user@chargeros:~$ ls -la', 130, 110);
      ctx.fillText('Documents  Downloads  Music  Pictures', 130, 125);
      ctx.fillText('user@chargeros:~$ neofetch', 130, 150);
      ctx.fillStyle = '#4a9eff';
      ctx.fillText('ChargerOS', 130, 170);

      setCaptured(canvas.toDataURL());
      setCapturing(false);
    }, 500);
  }, []);

  const download = () => {
    if (!captured) return;
    const a = document.createElement('a');
    a.href = captured;
    a.download = `screenshot-${new Date().toISOString().slice(0, 10)}.png`;
    a.click();
  };

  return (
    <div className="flex flex-col h-full bg-[#2d2d2d]">
      <div className="flex items-center gap-2 px-4 py-3 bg-[#252526] border-b border-[#333]">
        <button onClick={() => setMode('full')} className={`px-3 py-1.5 text-xs rounded-lg flex items-center gap-1 transition-colors ${mode === 'full' ? 'bg-[#4a9eff]/20 text-[#4a9eff]' : 'text-white/60 hover:bg-white/10'}`}><Monitor size={12} /> Full Screen</button>
        <button onClick={() => setMode('area')} className={`px-3 py-1.5 text-xs rounded-lg flex items-center gap-1 transition-colors ${mode === 'area' ? 'bg-[#4a9eff]/20 text-[#4a9eff]' : 'text-white/60 hover:bg-white/10'}`}><Crop size={12} /> Area</button>
        <div className="ml-auto flex gap-2">
          {captured && (
            <button onClick={download} className="px-3 py-1.5 bg-[#333] text-white text-xs rounded-lg hover:bg-[#444] flex items-center gap-1"><Download size={12} /> Save</button>
          )}
          <button onClick={capture} disabled={capturing} className="px-4 py-1.5 bg-[#4a9eff] text-white text-xs rounded-lg hover:bg-[#3d8de6] disabled:opacity-50 flex items-center gap-1">
            <Camera size={12} /> {capturing ? 'Capturing...' : 'Capture'}
          </button>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-4 bg-[#1a1a1a]">
        {captured ? (
          <img src={captured} alt="Screenshot" className="max-w-full max-h-full rounded-lg shadow-xl border border-[#444]" />
        ) : (
          <div className="text-center">
            <Camera size={48} className="text-white/10 mx-auto mb-3" />
            <p className="text-white/30 text-sm">{capturing ? 'Capturing screen...' : 'Click Capture to take a screenshot'}</p>
          </div>
        )}
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
