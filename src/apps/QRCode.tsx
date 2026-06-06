import { useState, useRef, useEffect } from 'react';
import { QrCode, Download, RefreshCw } from 'lucide-react';

export default function QRCodeApp() {
  const [text, setText] = useState('https://chargeros.dev');
  const [size, setSize] = useState(200);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateQR = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = size;
    canvas.height = size;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, size, size);

    // Generate a pseudo-QR pattern based on text hash
    const cellSize = Math.floor(size / 25);
    const hash = text.split('').reduce((a, c) => ((a << 5) - a + c.charCodeAt(0)) | 0, 0);
    const rng = (seed: number) => {
      let s = seed;
      return () => { s = (s * 16807 + 0) % 2147483647; return (s - 1) / 2147483646; };
    };
    const rand = rng(Math.abs(hash));

    ctx.fillStyle = 'black';
    // Position detection patterns
    for (const [px, py] of [[0, 0], [17, 0], [0, 17]]) {
      ctx.fillRect(px * cellSize, py * cellSize, 7 * cellSize, 7 * cellSize);
      ctx.clearRect((px + 1) * cellSize, (py + 1) * cellSize, 5 * cellSize, 5 * cellSize);
      ctx.fillRect((px + 2) * cellSize, (py + 2) * cellSize, 3 * cellSize, 3 * cellSize);
    }

    // Data pattern
    for (let r = 0; r < 25; r++) {
      for (let c = 0; c < 25; c++) {
        if ((r < 7 && c < 7) || (r < 7 && c >= 18) || (r >= 18 && c < 7)) continue;
        if (rand() > 0.5) {
          ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
        }
      }
    }
  };

  useEffect(() => { generateQR(); }, [text, size]);

  return (
    <div className="flex flex-col h-full bg-[#2d2d2d] p-4 items-center">
      <div className="text-center mb-4">
        <QrCode size={32} className="text-[#4a9eff] mx-auto mb-2" />
        <h2 className="text-white font-medium">QR Code Generator</h2>
      </div>

      <input
        type="text"
        value={text}
        onChange={e => setText(e.target.value)}
        className="w-full max-w-xs bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none mb-3"
      />

      <div className="flex items-center gap-3 mb-4">
        <span className="text-white/40 text-xs">Size:</span>
        <input type="range" min={100} max={400} value={size} onChange={e => setSize(parseInt(e.target.value))} className="w-24" />
        <span className="text-white/60 text-xs">{size}px</span>
      </div>

      <div className="bg-white rounded-xl p-3 shadow-lg mb-4">
        <canvas ref={canvasRef} style={{ width: size, height: size }} className="max-w-[200px] max-h-[200px]" />
      </div>

      <div className="flex gap-2">
        <button onClick={generateQR} className="px-4 py-2 bg-[#333] text-white text-sm rounded-lg hover:bg-[#444] flex items-center gap-1"><RefreshCw size={14} /> Regenerate</button>
        <button onClick={() => {
          const canvas = canvasRef.current;
          if (!canvas) return;
          const a = document.createElement('a');
          a.href = canvas.toDataURL('image/png');
          a.download = 'qrcode.png';
          a.click();
        }} className="px-4 py-2 bg-[#4a9eff] text-white text-sm rounded-lg hover:bg-[#3d8de6] flex items-center gap-1"><Download size={14} /> Download</button>
      </div>
    </div>
  );
}
