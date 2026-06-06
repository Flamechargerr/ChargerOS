import { useState, useEffect } from 'react';
import { Activity, Cpu, HardDrive, Wifi } from 'lucide-react';

interface Process {
  pid: number;
  name: string;
  cpu: number;
  mem: number;
  status: string;
}

const mockProcesses: Process[] = [
  { pid: 1, name: 'init', cpu: 0.1, mem: 4, status: 'running' },
  { pid: 100, name: 'systemd', cpu: 0.2, mem: 12, status: 'running' },
  { pid: 200, name: 'gnome-shell', cpu: 5.4, mem: 180, status: 'running' },
  { pid: 300, name: 'firefox', cpu: 12.8, mem: 420, status: 'running' },
  { pid: 400, name: 'terminal', cpu: 0.5, mem: 24, status: 'running' },
  { pid: 500, name: 'filemanager', cpu: 1.2, mem: 56, status: 'running' },
  { pid: 600, name: 'codeeditor', cpu: 3.1, mem: 340, status: 'running' },
  { pid: 700, name: 'python3', cpu: 8.7, mem: 210, status: 'running' },
  { pid: 800, name: 'node', cpu: 6.2, mem: 156, status: 'running' },
  { pid: 900, name: 'dockerd', cpu: 2.1, mem: 88, status: 'running' },
  { pid: 1000, name: 'mysql', cpu: 1.5, mem: 120, status: 'sleeping' },
  { pid: 1100, name: 'redis-server', cpu: 0.3, mem: 16, status: 'sleeping' },
];

export default function SystemMonitor() {
  const [tab, setTab] = useState<'processes' | 'resources'>('processes');
  const [processes, setProcesses] = useState<Process[]>(mockProcesses);
  const [cpuHistory, setCpuHistory] = useState<number[]>(Array(30).fill(10));
  const [memHistory, setMemHistory] = useState<number[]>(Array(30).fill(30));

  useEffect(() => {
    const interval = setInterval(() => {
      setProcesses(prev => prev.map(p => ({
        ...p,
        cpu: Math.max(0.1, p.cpu + (Math.random() - 0.5) * 2),
        mem: Math.max(4, p.mem + (Math.random() - 0.5) * 5),
      })));
      setCpuHistory(prev => [...prev.slice(1), Math.random() * 30 + 5]);
      setMemHistory(prev => [...prev.slice(1), Math.random() * 20 + 20]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const totalCpu = processes.reduce((s, p) => s + p.cpu, 0);
  const totalMem = processes.reduce((s, p) => s + p.mem, 0);

  const Sparkline = ({ data, color }: { data: number[]; color: string }) => {
    const max = Math.max(...data, 1);
    const points = data.map((v, i) => `${(i / (data.length - 1)) * 100},${100 - (v / max) * 100}`).join(' ');
    return (
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-16">
        <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" />
        <polygon points={`0,100 ${points} 100,100`} fill={color} opacity="0.1" />
      </svg>
    );
  };

  return (
    <div className="flex flex-col h-full bg-[#2d2d2d]">
      <div className="flex border-b border-[#333]">
        <button onClick={() => setTab('processes')} className={`px-4 py-2.5 text-sm ${tab === 'processes' ? 'text-[#4a9eff] border-b-2 border-[#4a9eff]' : 'text-white/40 hover:text-white'}`}>Processes</button>
        <button onClick={() => setTab('resources')} className={`px-4 py-2.5 text-sm ${tab === 'resources' ? 'text-[#4a9eff] border-b-2 border-[#4a9eff]' : 'text-white/40 hover:text-white'}`}>Resources</button>
      </div>

      {tab === 'processes' ? (
        <div className="flex-1 overflow-auto">
          <div className="grid grid-cols-[60px_1fr_60px_60px_80px] gap-2 text-xs text-white/40 px-4 py-2 border-b border-white/10">
            <span>PID</span><span>Name</span><span>CPU%</span><span>Mem</span><span>Status</span>
          </div>
          {processes.sort((a, b) => b.cpu - a.cpu).map(p => (
            <div key={p.pid} className="grid grid-cols-[60px_1fr_60px_60px_80px] gap-2 text-sm px-4 py-2 text-white/80 hover:bg-white/5 transition-colors">
              <span className="text-white/40">{p.pid}</span>
              <span>{p.name}</span>
              <span className="tabular-nums">{p.cpu.toFixed(1)}</span>
              <span className="tabular-nums">{p.mem.toFixed(0)}MB</span>
              <span className={p.status === 'running' ? 'text-[#4ecdc4]' : 'text-[#ff9800]'}>{p.status}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex-1 overflow-auto p-4 space-y-4">
          <div className="bg-[#252526] rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Cpu size={16} className="text-[#4a9eff]" />
              <span className="text-white text-sm">CPU Usage: {totalCpu.toFixed(1)}%</span>
            </div>
            <Sparkline data={cpuHistory} color="#4a9eff" />
          </div>
          <div className="bg-[#252526] rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <HardDrive size={16} className="text-[#4ecdc4]" />
              <span className="text-white text-sm">Memory: {totalMem.toFixed(0)}MB / 4096MB ({(totalMem / 4096 * 100).toFixed(1)}%)</span>
            </div>
            <Sparkline data={memHistory} color="#4ecdc4" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Processes', value: processes.length, icon: Activity, color: '#ff9800' },
              { label: 'Threads', value: processes.length * 3, icon: Cpu, color: '#4a9eff' },
              { label: 'Network', value: '2.4 MB/s', icon: Wifi, color: '#4ecdc4' },
            ].map(item => (
              <div key={item.label} className="bg-[#252526] rounded-lg p-3 text-center">
                <item.icon size={20} className="mx-auto mb-2" style={{ color: item.color }} />
                <p className="text-white text-lg font-medium">{item.value}</p>
                <p className="text-white/40 text-xs">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
