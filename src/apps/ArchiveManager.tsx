import { useState } from 'react';
import { FileArchive, Plus, Download, Trash2, FolderOpen } from 'lucide-react';

interface ArchiveEntry {
  name: string;
  type: 'file' | 'folder';
  size: number;
  compressed: number;
  date: string;
}

const sampleEntries: ArchiveEntry[] = [
  { name: 'documents/', type: 'folder', size: 0, compressed: 0, date: '2024-01-15' },
  { name: 'documents/readme.txt', type: 'file', size: 128, compressed: 64, date: '2024-01-15' },
  { name: 'documents/license.md', type: 'file', size: 2048, compressed: 1024, date: '2024-01-14' },
  { name: 'src/', type: 'folder', size: 0, compressed: 0, date: '2024-01-13' },
  { name: 'src/main.js', type: 'file', size: 5120, compressed: 1843, date: '2024-01-13' },
  { name: 'src/utils.js', type: 'file', size: 2048, compressed: 892, date: '2024-01-12' },
  { name: 'src/style.css', type: 'file', size: 1024, compressed: 445, date: '2024-01-12' },
  { name: 'assets/', type: 'folder', size: 0, compressed: 0, date: '2024-01-10' },
  { name: 'assets/logo.png', type: 'file', size: 15360, compressed: 12450, date: '2024-01-10' },
  { name: 'assets/icon.ico', type: 'file', size: 4096, compressed: 3800, date: '2024-01-09' },
  { name: 'package.json', type: 'file', size: 512, compressed: 230, date: '2024-01-15' },
];

export default function ArchiveManager() {
  const [entries, setEntries] = useState<ArchiveEntry[]>(sampleEntries);
  const [archiveName, setArchiveName] = useState('project-v1.0.zip');

  const totalSize = entries.filter(e => e.type === 'file').reduce((s, e) => s + e.size, 0);
  const totalCompressed = entries.filter(e => e.type === 'file').reduce((s, e) => s + e.compressed, 0);
  const ratio = totalSize > 0 ? ((1 - totalCompressed / totalSize) * 100).toFixed(1) : '0';

  const formatSize = (bytes: number) => bytes < 1024 ? `${bytes}B` : `${(bytes / 1024).toFixed(1)}KB`;

  return (
    <div className="flex flex-col h-full bg-[#2d2d2d]">
      <div className="flex items-center gap-3 px-4 py-3 bg-[#252526] border-b border-[#333]">
        <FileArchive size={16} className="text-[#ff9800]" />
        <input value={archiveName} onChange={e => setArchiveName(e.target.value)} className="flex-1 bg-transparent text-white text-sm outline-none" />
        <div className="flex gap-1">
          <button className="p-1.5 text-white/40 hover:text-white"><Plus size={14} /></button>
          <button className="p-1.5 text-white/40 hover:text-white"><Download size={14} /></button>
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-4 px-4 py-2 bg-[#252526] border-b border-[#333]">
        <div className="text-center"><span className="text-white/40 text-[10px] block">Size</span><span className="text-white text-xs">{formatSize(totalSize)}</span></div>
        <div className="text-center"><span className="text-white/40 text-[10px] block">Compressed</span><span className="text-[#4ecdc4] text-xs">{formatSize(totalCompressed)}</span></div>
        <div className="text-center"><span className="text-white/40 text-[10px] block">Ratio</span><span className="text-[#ff9800] text-xs">{ratio}% saved</span></div>
        <div className="text-center"><span className="text-white/40 text-[10px] block">Files</span><span className="text-white text-xs">{entries.filter(e => e.type === 'file').length}</span></div>
      </div>

      {/* Entries */}
      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-[1fr_60px_60px_80px_30px] gap-2 text-[10px] text-white/30 px-4 py-1.5 border-b border-white/5">
          <span>Name</span><span>Size</span><span>Compressed</span><span>Date</span><span></span>
        </div>
        {entries.map((entry, i) => (
          <div key={i} className="grid grid-cols-[1fr_60px_60px_80px_30px] gap-2 text-xs px-4 py-1.5 text-white/70 hover:bg-white/5 transition-colors border-b border-white/5">
            <span className="flex items-center gap-1.5 truncate">
              {entry.type === 'folder' ? <FolderOpen size={10} className="text-[#4a9eff]" /> : <FileArchive size={10} className="text-[#ff9800]" />}
              {entry.name}
            </span>
            <span className="text-white/40">{entry.type === 'file' ? formatSize(entry.size) : '--'}</span>
            <span className="text-[#4ecdc4]">{entry.type === 'file' ? formatSize(entry.compressed) : '--'}</span>
            <span className="text-white/30">{entry.date}</span>
            <button onClick={() => setEntries(prev => prev.filter((_, j) => j !== i))} className="text-white/20 hover:text-red-400"><Trash2 size={10} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}
