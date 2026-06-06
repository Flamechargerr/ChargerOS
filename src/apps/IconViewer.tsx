import { useState } from 'react';
import { Search, Check } from 'lucide-react';
import * as Icons from 'lucide-react';

const iconList = Object.entries(Icons).filter(([name]) => name !== 'createLucideIcon' && name !== 'icons').map(([name]) => name);

export default function IconViewer() {
  const [search, setSearch] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  const filtered = iconList.filter(name => name.toLowerCase().includes(search.toLowerCase()));

  const copyName = (name: string) => {
    navigator.clipboard.writeText(name);
    setCopied(name);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="flex flex-col h-full bg-[#2d2d2d]">
      <div className="p-3">
        <div className="flex items-center bg-white/10 rounded-lg px-3">
          <Search size={14} className="text-white/30" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={`Search ${iconList.length} icons...`}
            className="flex-1 bg-transparent text-white text-sm py-2 outline-none placeholder-white/30 ml-2"
          />
        </div>
      </div>
      <div className="flex-1 overflow-auto p-3">
        <div className="grid grid-cols-8 gap-2">
          {filtered.slice(0, 128).map(name => {
            const Icon = (Icons as any)[name];
            return (
              <button
                key={name}
                onClick={() => copyName(name)}
                className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-white/10 transition-colors group"
                title={name}
              >
                <Icon size={20} className="text-white/60 group-hover:text-white" />
                <span className="text-[8px] text-white/30 truncate w-full text-center group-hover:text-white/60">{name}</span>
                {copied === name && <Check size={10} className="text-[#4a9eff]" />}
              </button>
            );
          })}
        </div>
        {filtered.length > 128 && <p className="text-white/20 text-xs text-center mt-3">+{filtered.length - 128} more icons</p>}
      </div>
    </div>
  );
}
