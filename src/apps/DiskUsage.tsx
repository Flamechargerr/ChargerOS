import { useMemo } from 'react';
import { useFileSystem } from '@/contexts/FileSystemContext';
import { HardDrive, FolderOpen, File } from 'lucide-react';

export default function DiskUsage() {
  const { listDir, getSize } = useFileSystem();
  const homeItems = listDir('/home/user');

  const sizes = useMemo(() => {
    return homeItems.map(item => ({
      ...item,
      size: getSize(`/home/user/${item.name}`),
    })).sort((a, b) => b.size - a.size);
  }, [homeItems, getSize]);

  const totalSize = sizes.reduce((s, i) => s + i.size, 0);
  const maxSize = Math.max(...sizes.map(s => s.size), 1);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)}MB`;
  };

  const colors = ['#4a9eff', '#4ecdc4', '#f7b731', '#ff6b6b', '#5f27cd', '#ff9ff3', '#54a0ff', '#48dbfb'];

  return (
    <div className="flex flex-col h-full bg-[#2d2d2d] p-6">
      <div className="flex items-center gap-3 mb-6">
        <HardDrive size={24} className="text-[#4a9eff]" />
        <div>
          <h2 className="text-white font-medium">Disk Usage</h2>
          <p className="text-white/40 text-sm">{formatSize(totalSize)} total</p>
        </div>
      </div>

      {/* Ring chart */}
      <div className="flex items-center justify-center mb-6">
        <svg width="160" height="160" viewBox="0 0 160 160">
          <circle cx="80" cy="80" r="60" fill="none" stroke="#333" strokeWidth="20" />
          {sizes.reduce<{ start: number; segments: React.JSX.Element[] }>((acc, item, i) => {
            const pct = item.size / totalSize;
            const angle = pct * 360;
            const startRad = (acc.start - 90) * Math.PI / 180;
            const endRad = (acc.start + angle - 90) * Math.PI / 180;
            const x1 = 80 + 60 * Math.cos(startRad);
            const y1 = 80 + 60 * Math.sin(startRad);
            const x2 = 80 + 60 * Math.cos(endRad);
            const y2 = 80 + 60 * Math.sin(endRad);
            const largeArc = angle > 180 ? 1 : 0;
            acc.segments.push(
              <path key={i} d={`M ${x1} ${y1} A 60 60 0 ${largeArc} 1 ${x2} ${y2}`} fill="none" stroke={colors[i % colors.length]} strokeWidth="20" />
            );
            acc.start += angle;
            return acc;
          }, { start: 0, segments: [] }).segments}
          <text x="80" y="75" textAnchor="middle" fill="white" fontSize="14">{formatSize(totalSize)}</text>
          <text x="80" y="92" textAnchor="middle" fill="#666" fontSize="10">Total</text>
        </svg>
      </div>

      {/* Bar chart */}
      <div className="space-y-2 overflow-auto flex-1">
        {sizes.map((item, i) => (
          <div key={item.name} className="flex items-center gap-3">
            {item.type === 'folder' ? <FolderOpen size={14} className="text-[#4a9eff]" /> : <File size={14} className="text-[#ccc]" />}
            <span className="text-white/80 text-sm w-28 truncate">{item.name}</span>
            <div className="flex-1 bg-[#333] rounded-full h-4 overflow-hidden">
              <div className="h-full rounded-full transition-all" style={{ width: `${(item.size / maxSize) * 100}%`, backgroundColor: colors[i % colors.length] }} />
            </div>
            <span className="text-white/40 text-xs w-16 text-right tabular-nums">{formatSize(item.size)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
