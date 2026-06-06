import { useState } from 'react';
import { Disc, Plus, Flame, File, Trash2 } from 'lucide-react';

interface DiscFile {
  id: string;
  name: string;
  size: number;
}

const DISC_CAPACITY = 700 * 1024; // 700MB in KB

export default function CDBurner() {
  const [files, setFiles] = useState<DiscFile[]>([]);
  const [burning, setBurning] = useState(false);
  const [progress, setProgress] = useState(0);

  const usedSpace = files.reduce((s, f) => s + f.size, 0);
  const usagePercent = (usedSpace / DISC_CAPACITY) * 100;

  const addFiles = () => {
    const mockFiles: DiscFile[] = [
      { id: Date.now().toString(), name: `file_${files.length + 1}.txt`, size: Math.floor(Math.random() * 50000) + 1000 },
      { id: (Date.now() + 1).toString(), name: `image_${files.length + 1}.jpg`, size: Math.floor(Math.random() * 200000) + 50000 },
      { id: (Date.now() + 2).toString(), name: `data_${files.length + 1}.zip`, size: Math.floor(Math.random() * 100000) + 10000 },
    ];
    setFiles(prev => [...prev, ...mockFiles.slice(0, 3)]);
  };

  const burn = () => {
    if (files.length === 0) return;
    setBurning(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setBurning(false);
          return 100;
        }
        return p + 2;
      });
    }, 100);
  };

  const formatSize = (kb: number) => kb < 1024 ? `${kb}KB` : `${(kb / 1024).toFixed(1)}MB`;

  return (
    <div className="flex flex-col h-full bg-[#2d2d2d] p-4">
      <div className="text-center mb-4">
        <Disc size={48} className="text-[#ccc] mx-auto mb-2" />
        <h2 className="text-white font-medium">CD Burner</h2>
        <p className="text-white/40 text-xs">Capacity: 700MB</p>
      </div>

      {/* Capacity bar */}
      <div className="mb-4">
        <div className="w-full h-4 bg-[#333] rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#4a9eff] to-[#4ecdc4] rounded-full transition-all" style={{ width: `${Math.min(usagePercent, 100)}%` }} />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-white/40 text-xs">{formatSize(usedSpace)} used</span>
          <span className="text-white/40 text-xs">{formatSize(DISC_CAPACITY)} total</span>
        </div>
      </div>

      {/* File list */}
      <div className="flex-1 overflow-auto bg-[#252526] rounded-lg mb-4">
        {files.map(f => (
          <div key={f.id} className="flex items-center justify-between px-3 py-2 border-b border-white/5">
            <div className="flex items-center gap-2">
              <File size={12} className="text-[#4a9eff]" />
              <span className="text-white/80 text-xs">{f.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white/30 text-xs">{formatSize(f.size)}</span>
              <button onClick={() => setFiles(prev => prev.filter(x => x.id !== f.id))} className="text-white/20 hover:text-red-400"><Trash2 size={10} /></button>
            </div>
          </div>
        ))}
        {files.length === 0 && <div className="text-center text-white/20 text-xs py-8">No files added</div>}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button onClick={addFiles} className="flex-1 py-2 bg-[#333] text-white text-sm rounded-lg hover:bg-[#444] flex items-center justify-center gap-1"><Plus size={14} /> Add Files</button>
        <button onClick={burn} disabled={burning || files.length === 0} className="flex-1 py-2 bg-[#ff9800] text-white text-sm rounded-lg hover:bg-[#e68900] disabled:opacity-50 flex items-center justify-center gap-1">
          <Flame size={14} /> {burning ? `${progress}%` : 'Burn'}
        </button>
      </div>

      {burning && (
        <div className="mt-2 text-center text-[#ff9800] text-xs animate-pulse">Burning disc... {progress}%</div>
      )}
    </div>
  );
}
