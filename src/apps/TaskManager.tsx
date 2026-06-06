import { useState, useEffect } from 'react';
import { Activity, Cpu, XCircle } from 'lucide-react';

interface Process {
  pid: number;
  name: string;
  cpu: number;
  mem: number;
  status: string;
}

const mockProcesses: Process[] = [
  { pid: 1, name: 'init', cpu: 0.1, mem: 4, status: 'running' },
  { pid: 100, name: 'gnome-shell', cpu: 4.2, mem: 156, status: 'running' },
  { pid: 200, name: 'firefox', cpu: 8.7, mem: 340, status: 'running' },
  { pid: 300, name: 'codeeditor', cpu: 2.1, mem: 89, status: 'running' },
  { pid: 400, name: 'terminal', cpu: 0.3, mem: 12, status: 'running' },
  { pid: 500, name: 'filemanager', cpu: 1.5, mem: 45, status: 'running' },
  { pid: 600, name: 'node', cpu: 5.4, mem: 128, status: 'running' },
  { pid: 700, name: 'python3', cpu: 3.2, mem: 78, status: 'running' },
  { pid: 800, name: 'mysql', cpu: 0.8, mem: 96, status: 'sleeping' },
  { pid: 900, name: 'redis-server', cpu: 0.2, mem: 8, status: 'sleeping' },
  { pid: 1000, name: 'dockerd', cpu: 1.8, mem: 56, status: 'running' },
  { pid: 1100, name: 'nginx', cpu: 0.4, mem: 16, status: 'running' },
];

export default function TaskManager() {
  const [processes, setProcesses] = useState<Process[]>(mockProcesses);
  const [sortBy, setSortBy] = useState<'cpu' | 'mem'>('cpu');

  useEffect(() => {
    const interval = setInterval(() => {
      setProcesses(prev => prev.map(p => ({
        ...p,
        cpu: Math.max(0.1, Math.min(50, p.cpu + (Math.random() - 0.5) * 3)),
        mem: Math.max(4, p.mem + (Math.random() - 0.5) * 3),
      })));
    }, 2000);
    return () => clearInterval(interval);
  }, [processes]);

  const kill = (pid: number) => {
    setProcesses(prev => prev.filter(p => p.pid !== pid));
  };

  const sorted = [...processes].sort((a, b) => b[sortBy] - a[sortBy]);
  const totalCpu = processes.reduce((s, p) => s + p.cpu, 0);
  const totalMem = processes.reduce((s, p) => s + p.mem, 0);

  return (
    <div className="flex flex-col h-full bg-[#2d2d2d]">
      {/* Performance bars */}
      <div className="flex gap-4 px-4 py-2 bg-[#252526] border-b border-[#333]">
        <div className="flex items-center gap-2">
          <Activity size={14} className="text-[#4a9eff]" />
          <span className="text-white/60 text-xs">CPU: {totalCpu.toFixed(1)}%</span>
        </div>
        <div className="flex items-center gap-2">
          <Cpu size={14} className="text-[#4ecdc4]" />
          <span className="text-white/60 text-xs">Mem: {totalMem.toFixed(0)}MB</span>
        </div>
        <div className="ml-auto flex gap-1">
          <button onClick={() => setSortBy('cpu')} className={`px-2 py-0.5 text-[10px] rounded ${sortBy === 'cpu' ? 'bg-[#4a9eff]/20 text-[#4a9eff]' : 'text-white/30'}`}>CPU</button>
          <button onClick={() => setSortBy('mem')} className={`px-2 py-0.5 text-[10px] rounded ${sortBy === 'mem' ? 'bg-[#4a9eff]/20 text-[#4a9eff]' : 'text-white/30'}`}>Mem</button>
        </div>
      </div>

      {/* Process list */}
      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-[50px_1fr_50px_50px_60px_30px] gap-2 text-[10px] text-white/30 px-4 py-1.5 border-b border-white/5">
          <span>PID</span><span>Name</span><span>CPU</span><span>Mem</span><span>Status</span><span></span>
        </div>
        {sorted.map(p => (
          <div key={p.pid} className="grid grid-cols-[50px_1fr_50px_50px_60px_30px] gap-2 text-xs px-4 py-1.5 text-white/70 hover:bg-white/5 transition-colors border-b border-white/5">
            <span className="text-white/30">{p.pid}</span>
            <span>{p.name}</span>
            <span className="tabular-nums">{p.cpu.toFixed(1)}</span>
            <span className="tabular-nums">{p.mem.toFixed(0)}</span>
            <span className={p.status === 'running' ? 'text-[#4ecdc4]' : 'text-[#ff9800]'}>{p.status}</span>
            <button onClick={() => kill(p.pid)} className="text-white/20 hover:text-red-400"><XCircle size={12} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}
