import { useState, useRef, useCallback } from 'react';
import { Copy, Plus, Trash2 } from 'lucide-react';

export default function ColorPicker() {
  const [hue, setHue] = useState(210);
  const [sat, setSat] = useState(0.5);
  const [val, setVal] = useState(0.5);
  const [savedPalettes, setSavedPalettes] = useState<{ name: string; color: string }[]>(() => {
    try { return JSON.parse(localStorage.getItem('chargeros_palettes') || '[]'); }
    catch { return []; }
  });
  const areaRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  const hsvToRgb = (h: number, s: number, v: number) => {
    const c = v * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = v - c;
    let r = 0, g = 0, b = 0;
    if (h < 60) { r = c; g = x; }
    else if (h < 120) { r = x; g = c; }
    else if (h < 180) { g = c; b = x; }
    else if (h < 240) { g = x; b = c; }
    else if (h < 300) { r = x; b = c; }
    else { r = c; b = x; }
    return { r: Math.round((r + m) * 255), g: Math.round((g + m) * 255), b: Math.round((b + m) * 255) };
  };

  const rgb = hsvToRgb(hue, sat, val);
  const hex = `#${[rgb.r, rgb.g, rgb.b].map(v => v.toString(16).padStart(2, '0')).join('')}`;

  const handleAreaMouse = useCallback((e: React.MouseEvent) => {
    if (!areaRef.current) return;
    const rect = areaRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    setSat(x);
    setVal(1 - y);
  }, []);

  const copyHex = () => navigator.clipboard.writeText(hex);
  const copyRgb = () => navigator.clipboard.writeText(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`);

  const saveColor = () => {
    const newPalette = [...savedPalettes, { name: hex, color: hex }];
    setSavedPalettes(newPalette);
    localStorage.setItem('chargeros_palettes', JSON.stringify(newPalette));
  };

  return (
    <div className="flex flex-col h-full bg-[#2d2d2d] p-4">
      {/* Color preview */}
      <div className="flex gap-4 mb-4">
        <div className="w-20 h-20 rounded-xl shadow-lg" style={{ backgroundColor: hex }} />
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-white/60 text-xs">HEX</span>
            <button onClick={copyHex} className="text-white/40 hover:text-white"><Copy size={12} /></button>
          </div>
          <div className="bg-white/10 rounded px-2 py-1 text-white text-sm font-mono">{hex}</div>
          <div className="flex items-center justify-between">
            <span className="text-white/60 text-xs">RGB</span>
            <button onClick={copyRgb} className="text-white/40 hover:text-white"><Copy size={12} /></button>
          </div>
          <div className="bg-white/10 rounded px-2 py-1 text-white text-sm font-mono">{rgb.r}, {rgb.g}, {rgb.b}</div>
        </div>
      </div>

      {/* Saturation/Value area */}
      <div
        ref={areaRef}
        className="w-full h-32 rounded-lg cursor-crosshair mb-3 relative"
        style={{ background: `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, hsl(${hue}, 100%, 50%))` }}
        onMouseDown={(e) => { setDragging(true); handleAreaMouse(e); }}
        onMouseMove={(e) => { if (dragging) handleAreaMouse(e); }}
        onMouseUp={() => setDragging(false)}
        onMouseLeave={() => setDragging(false)}
      >
        <div className="w-3 h-3 rounded-full border-2 border-white absolute -translate-x-1/2 -translate-y-1/2 shadow" style={{ left: `${sat * 100}%`, top: `${(1 - val) * 100}%` }} />
      </div>

      {/* Hue slider */}
      <div className="mb-4">
        <input
          type="range"
          min={0}
          max={360}
          value={hue}
          onChange={e => setHue(parseInt(e.target.value))}
          className="w-full h-3 rounded-full appearance-none cursor-pointer"
          style={{ background: 'linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)' }}
        />
      </div>

      {/* Saved palettes */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-white/60 text-xs">Saved Colors</span>
        <button onClick={saveColor} className="text-[#4a9eff] hover:text-[#3d8de6]"><Plus size={14} /></button>
      </div>
      <div className="flex flex-wrap gap-2">
        {savedPalettes.map((p, i) => (
          <div key={i} className="group relative">
            <button onClick={() => {
              // Parse hex back to hsv
            }} className="w-8 h-8 rounded-lg border border-white/10" style={{ backgroundColor: p.color }} />
            <button onClick={() => setSavedPalettes(prev => prev.filter((_, j) => j !== i))} className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-white text-[8px] flex items-center justify-center opacity-0 group-hover:opacity-100"><Trash2 size={8} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}
