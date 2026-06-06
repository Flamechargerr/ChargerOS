import { useState, useMemo } from 'react';
import { Search, File, FolderOpen } from 'lucide-react';

const ALL_FILES = [
  { name: 'readme.txt', path: '/home/user/Documents', type: 'file', size: 128, date: '2024-01-15' },
  { name: 'todo.txt', path: '/home/user/Documents', type: 'file', size: 72, date: '2024-01-14' },
  { name: 'notes.pdf', path: '/home/user/Documents', type: 'file', size: 2048, date: '2024-01-10' },
  { name: 'photo.jpg', path: '/home/user/Pictures', type: 'file', size: 15360, date: '2024-01-12' },
  { name: 'song.mp3', path: '/home/user/Music', type: 'file', size: 4096, date: '2024-01-08' },
  { name: 'video.mp4', path: '/home/user/Videos', type: 'file', size: 51200, date: '2024-01-05' },
  { name: 'script.js', path: '/home/user/Documents', type: 'file', size: 256, date: '2024-01-15' },
  { name: 'style.css', path: '/home/user/Documents', type: 'file', size: 180, date: '2024-01-15' },
  { name: 'index.html', path: '/home/user/Documents', type: 'file', size: 320, date: '2024-01-15' },
  { name: 'data.json', path: '/home/user/Documents', type: 'file', size: 64, date: '2024-01-13' },
  { name: 'backup', path: '/home/user', type: 'folder', size: 0, date: '2024-01-01' },
  { name: 'project', path: '/home/user', type: 'folder', size: 0, date: '2024-01-11' },
  { name: 'archive.zip', path: '/home/user/Downloads', type: 'file', size: 1024, date: '2024-01-09' },
  { name: 'report.docx', path: '/home/user/Documents', type: 'file', size: 512, date: '2024-01-07' },
  { name: 'budget.xlsx', path: '/home/user/Documents', type: 'file', size: 256, date: '2024-01-06' },
];

export default function FileSearch() {
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'file' | 'folder'>('all');

  const results = useMemo(() => {
    return ALL_FILES.filter(f => {
      const matchesQuery = !query || f.name.toLowerCase().includes(query.toLowerCase()) || f.path.toLowerCase().includes(query.toLowerCase());
      const matchesType = typeFilter === 'all' || f.type === typeFilter;
      return matchesQuery && matchesType;
    });
  }, [query, typeFilter]);

  const formatSize = (bytes: number) => bytes < 1024 ? `${bytes}B` : bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(1)}KB` : `${(bytes / 1024 / 1024).toFixed(1)}MB`;

  return (
    <div className="flex flex-col h-full bg-[#2d2d2d]">
      <div className="p-3 space-y-2">
        <div className="flex items-center bg-white/10 rounded-lg px-3">
          <Search size={14} className="text-white/30" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search files..."
            className="flex-1 bg-transparent text-white text-sm py-2 outline-none placeholder-white/30 ml-2"
            autoFocus
          />
        </div>
        <div className="flex gap-1">
          {(['all', 'file', 'folder'] as const).map(t => (
            <button key={t} onClick={() => setTypeFilter(t)} className={`px-2 py-0.5 text-[10px] rounded capitalize ${typeFilter === t ? 'bg-[#4a9eff]/20 text-[#4a9eff]' : 'text-white/30 hover:bg-white/5'}`}>{t}</button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {results.map((f, i) => (
          <div key={i} className="flex items-center gap-3 px-4 py-2 hover:bg-white/5 transition-colors border-b border-white/5">
            {f.type === 'folder' ? <FolderOpen size={14} className="text-[#4a9eff]" /> : <File size={14} className="text-[#ccc]" />}
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs truncate">{f.name}</p>
              <p className="text-white/30 text-[10px] truncate">{f.path}</p>
            </div>
            <span className="text-white/30 text-[10px] w-16 text-right">{f.type === 'file' ? formatSize(f.size) : '--'}</span>
            <span className="text-white/20 text-[10px] w-16 text-right">{f.date}</span>
          </div>
        ))}
        {results.length === 0 && <div className="text-center text-white/20 text-sm mt-8">No results found</div>}
      </div>

      <div className="px-4 py-2 border-t border-[#333] text-white/30 text-xs">
        {results.length} result{results.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
}
