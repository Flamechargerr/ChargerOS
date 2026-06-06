import { useState, useRef, useCallback, useEffect } from 'react';
import { FunctionSquare, Play } from 'lucide-react';

export default function SciCalc() {
  const [expression, setExpression] = useState('x*x');
  const [xMin, setXMin] = useState(-10);
  const [xMax, setXMax] = useState(10);
  const [history, setHistory] = useState<string[]>(['x*x', 'Math.sin(x)', 'Math.cos(x)', 'Math.abs(x)']);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const plot = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;

    ctx.fillStyle = '#1e1e1e';
    ctx.fillRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    const cx = w / 2, cy = h / 2;
    const scaleX = w / (xMax - xMin);
    const offsetX = -xMin * scaleX;

    ctx.beginPath();
    for (let x = 0; x < w; x += 40) { ctx.moveTo(x, 0); ctx.lineTo(x, h); }
    for (let y = 0; y < h; y += 40) { ctx.moveTo(0, y); ctx.lineTo(w, y); }
    ctx.stroke();

    // Axes
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, cy); ctx.lineTo(w, cy);
    ctx.moveTo(cx, 0); ctx.lineTo(cx, h);
    ctx.stroke();

    // Plot
    ctx.strokeStyle = '#4a9eff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    let first = true;
    for (let px = 0; px < w; px += 2) {
      const x = (px - offsetX) / scaleX;
      try {
        const y = eval(expression.replace(/\bx\b/g, `(${x})`));
        if (typeof y === 'number' && !isNaN(y) && isFinite(y)) {
          const py = cy - y * (h / (xMax - xMin)) * 0.8;
          if (first) { ctx.moveTo(px, py); first = false; }
          else ctx.lineTo(px, py);
        }
      } catch { /* skip invalid points */ }
    }
    ctx.stroke();
  }, [expression, xMin, xMax]);

  useEffect(() => { plot(); }, [plot]);

  const applyPreset = (expr: string) => {
    setExpression(expr);
    if (!history.includes(expr)) setHistory(prev => [expr, ...prev].slice(0, 10));
  };

  return (
    <div className="flex flex-col h-full bg-[#2d2d2d]">
      <div className="flex items-center gap-2 px-4 py-2 bg-[#252526] border-b border-[#333]">
        <FunctionSquare size={16} className="text-[#4a9eff]" />
        <span className="text-white text-sm">Graphing Calculator</span>
      </div>

      <div className="p-3 space-y-2">
        <div className="flex gap-2">
          <span className="text-[#ff9800] text-sm self-center">f(x) =</span>
          <input
            type="text"
            value={expression}
            onChange={e => setExpression(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && plot()}
            className="flex-1 bg-white/10 border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm font-mono outline-none"
          />
          <button onClick={plot} className="px-3 py-1.5 bg-[#4a9eff] text-white text-xs rounded hover:bg-[#3d8de6]"><Play size={12} /></button>
        </div>
        <div className="flex gap-2 items-center">
          <span className="text-white/40 text-xs">X range:</span>
          <input type="number" value={xMin} onChange={e => setXMin(parseFloat(e.target.value))} className="w-16 bg-white/10 text-white text-xs rounded px-2 py-1 outline-none" />
          <span className="text-white/20">to</span>
          <input type="number" value={xMax} onChange={e => setXMax(parseFloat(e.target.value))} className="w-16 bg-white/10 text-white text-xs rounded px-2 py-1 outline-none" />
        </div>
        <div className="flex gap-1 flex-wrap">
          {history.slice(0, 5).map((h, i) => (
            <button key={i} onClick={() => applyPreset(h)} className="px-2 py-0.5 bg-white/5 rounded text-white/40 text-[10px] hover:bg-white/10 hover:text-white font-mono">{h}</button>
          ))}
        </div>
      </div>

      <div className="flex-1 p-3 flex items-center justify-center">
        <canvas ref={canvasRef} width={500} height={300} className="rounded-lg border border-[#333]" />
      </div>
    </div>
  );
}
