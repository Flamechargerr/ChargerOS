import { useRef, useState, useEffect } from 'react';
import { Paintbrush, Eraser, Square, Circle as CircleIcon, Minus, Download, Undo } from 'lucide-react';

type Tool = 'pencil' | 'eraser' | 'line' | 'rect' | 'circle' | 'text';

export default function Paint() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tool, setTool] = useState<Tool>('pencil');
  const [color, setColor] = useState('#4a9eff');
  const [brushSize, setBrushSize] = useState(3);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const snapshot = useRef<ImageData | null>(null);

  const colors = ['#000000', '#ffffff', '#f44336', '#ff9800', '#ffeb3b', '#4caf50', '#2196f3', '#9c27b0', '#ff5722', '#795548', '#607d8b', '#4a9eff'];

  const getPos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return { x: (e.clientX - rect.left) * (canvas.width / rect.width), y: (e.clientY - rect.top) * (canvas.height / rect.height) };
  };

  const startDraw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const pos = getPos(e);
    setIsDrawing(true);
    setStartPos(pos);
    snapshot.current = ctx.getImageData(0, 0, canvas.width, canvas.height);

    if (tool === 'pencil' || tool === 'eraser') {
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
      ctx.strokeStyle = tool === 'eraser' ? '#2d2d2d' : color;
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current || !snapshot.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    const pos = getPos(e);

    if (tool === 'pencil' || tool === 'eraser') {
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    } else {
      ctx.putImageData(snapshot.current, 0, 0);
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      ctx.beginPath();
      if (tool === 'line') {
        ctx.moveTo(startPos.x, startPos.y);
        ctx.lineTo(pos.x, pos.y);
      } else if (tool === 'rect') {
        ctx.rect(startPos.x, startPos.y, pos.x - startPos.x, pos.y - startPos.y);
      } else if (tool === 'circle') {
        const radius = Math.sqrt(Math.pow(pos.x - startPos.x, 2) + Math.pow(pos.y - startPos.y, 2));
        ctx.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);
      }
      ctx.stroke();
    }
  };

  const endDraw = () => {
    setIsDrawing(false);
    snapshot.current = null;
  };

  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#2d2d2d';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#2d2d2d';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const tools: { id: Tool; icon: any }[] = [
    { id: 'pencil', icon: Paintbrush },
    { id: 'eraser', icon: Eraser },
    { id: 'line', icon: Minus },
    { id: 'rect', icon: Square },
    { id: 'circle', icon: CircleIcon },
  ];

  return (
    <div className="flex flex-col h-full bg-[#2d2d2d]">
      <div className="flex items-center gap-2 px-3 py-2 bg-[#252526] border-b border-[#333]">
        {tools.map(t => (
          <button key={t.id} onClick={() => setTool(t.id)} className={`p-1.5 rounded ${tool === t.id ? 'bg-[#4a9eff]/20 text-[#4a9eff]' : 'text-white/60 hover:bg-white/10'}`}>
            <t.icon size={14} />
          </button>
        ))}
        <div className="w-px h-4 bg-white/10 mx-1" />
        <div className="flex gap-1">
          {colors.map(c => (
            <button key={c} onClick={() => setColor(c)} className={`w-4 h-4 rounded-sm ${color === c ? 'ring-1 ring-white' : ''}`} style={{ backgroundColor: c }} />
          ))}
        </div>
        <div className="w-px h-4 bg-white/10 mx-1" />
        <input type="range" min={1} max={20} value={brushSize} onChange={e => setBrushSize(parseInt(e.target.value))} className="w-16" />
        <button onClick={clear} className="ml-auto p-1.5 rounded text-white/60 hover:bg-white/10"><Undo size={14} /></button>
        <button onClick={() => {
          const canvas = canvasRef.current;
          if (!canvas) return;
          const link = document.createElement('a');
          link.download = 'drawing.png';
          link.href = canvas.toDataURL();
          link.click();
        }} className="p-1.5 rounded text-white/60 hover:bg-white/10"><Download size={14} /></button>
      </div>
      <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-[#1e1e1e]">
        <canvas
          ref={canvasRef}
          width={700}
          height={450}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={endDraw}
          onMouseLeave={endDraw}
          className="rounded shadow-lg cursor-crosshair"
          style={{ maxWidth: '100%', maxHeight: '100%' }}
        />
      </div>
    </div>
  );
}
