import { useState } from 'react';
import { Database, Play } from 'lucide-react';


export default function DatabaseManager() {
  const [query, setQuery] = useState('SELECT * FROM users');
  const [result, setResult] = useState<Record<string, string>[]>([
    { id: '1', name: 'Alice', email: 'alice@example.com', role: 'admin' },
    { id: '2', name: 'Bob', email: 'bob@example.com', role: 'user' },
    { id: '3', name: 'Charlie', email: 'charlie@example.com', role: 'user' },
    { id: '4', name: 'Diana', email: 'diana@example.com', role: 'moderator' },
  ]);
  const [history, setHistory] = useState<string[]>(['SELECT * FROM users', 'SELECT name, email FROM users WHERE role = "admin"']);

  const executeQuery = () => {
    setHistory(prev => [query, ...prev].slice(0, 20));
    const q = query.toUpperCase().trim();
    if (q.includes('SELECT')) {
      // Mock different results based on query
      if (q.includes('WHERE')) {
        const filtered = result.filter(r => Object.values(r).some(v => q.includes(v.toUpperCase())));
        setResult(filtered.length > 0 ? filtered : result);
      }
    } else if (q.includes('INSERT')) {
      const newRow = { id: String(result.length + 1), name: 'New User', email: 'new@example.com', role: 'user' };
      setResult(prev => [...prev, newRow]);
    }
  };

  const columns = result.length > 0 ? Object.keys(result[0]) : [];

  return (
    <div className="flex flex-col h-full bg-[#2d2d2d]">
      <div className="flex items-center gap-2 px-4 py-2 bg-[#252526] border-b border-[#333]">
        <Database size={16} className="text-[#4ecdc4]" />
        <span className="text-white text-sm">SQLite Manager</span>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-white/40 text-xs">1 table</span>
          <span className="text-[#4ecdc4] text-xs">Connected</span>
        </div>
      </div>

      {/* Query input */}
      <div className="p-3">
        <div className="flex gap-2">
          <textarea
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && e.ctrlKey && executeQuery()}
            className="flex-1 bg-[#1e1e1e] border border-[#333] rounded-lg px-3 py-2 text-xs text-[#4af626] font-mono outline-none resize-none h-16"
          />
          <button onClick={executeQuery} className="px-4 py-2 bg-[#4a9eff] text-white rounded-lg hover:bg-[#3d8de6] flex items-center gap-1">
            <Play size={12} /> Run
          </button>
        </div>
        <div className="flex gap-1 mt-2">
          {history.slice(0, 3).map((h, i) => (
            <button key={i} onClick={() => setQuery(h)} className="px-2 py-1 bg-white/5 rounded text-white/40 text-[10px] hover:bg-white/10 hover:text-white truncate max-w-[150px]">{h}</button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-auto px-3 pb-3">
        {result.length > 0 && (
          <div className="bg-[#252526] rounded-lg overflow-hidden">
            <div className="grid gap-2 px-3 py-2 bg-[#1e1e1e] text-xs text-white/40 border-b border-[#333]" style={{ gridTemplateColumns: `repeat(${columns.length}, 1fr)` }}>
              {columns.map(c => <span key={c}>{c}</span>)}
            </div>
            {result.map((row, i) => (
              <div key={i} className="grid gap-2 px-3 py-2 text-xs text-white/80 border-b border-white/5 hover:bg-white/5" style={{ gridTemplateColumns: `repeat(${columns.length}, 1fr)` }}>
                {columns.map(c => <span key={c} className="truncate">{row[c]}</span>)}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
