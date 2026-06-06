import { useState } from 'react';
import { Monitor, Link, Power } from 'lucide-react';

export default function RemoteDesktop() {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [host, setHost] = useState('192.168.1.100');
  const [port, setPort] = useState('5900');

  const connect = () => {
    setConnecting(true);
    setTimeout(() => {
      setConnecting(false);
      setConnected(true);
    }, 2000);
  };

  if (!connected) {
    return (
      <div className="flex flex-col h-full bg-[#2d2d2d] items-center justify-center">
        <div className="w-72 text-center">
          <Monitor size={48} className="text-[#4a9eff] mx-auto mb-4" />
          <h2 className="text-white font-medium mb-1">VNC Viewer</h2>
          <p className="text-white/40 text-sm mb-6">Connect to a remote desktop</p>
          <div className="space-y-3 text-left">
            <input type="text" value={host} onChange={e => setHost(e.target.value)} placeholder="Host / IP Address" className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none" />
            <input type="text" value={port} onChange={e => setPort(e.target.value)} placeholder="Port" className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none" />
            <button onClick={connect} disabled={connecting} className="w-full py-2.5 bg-[#4a9eff] text-white rounded-lg hover:bg-[#3d8de6] disabled:opacity-50 flex items-center justify-center gap-2">
              <Link size={14} />
              {connecting ? 'Connecting...' : 'Connect'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#1a1a1a]">
      {/* Simulated remote desktop */}
      <div className="flex-1 relative overflow-hidden">
        <div className="absolute inset-0 flex flex-col" style={{ background: 'linear-gradient(135deg, #1a1a2e, #16213e)' }}>
          {/* Simulated remote desktop content */}
          <div className="h-8 bg-[#1e1e1e] flex items-center px-3 gap-3">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <div className="w-3 h-3 rounded-full bg-[#28c840]" />
            <span className="text-white/40 text-xs ml-2">Remote Desktop - {host}:{port}</span>
          </div>
          <div className="flex-1 p-8 flex items-center justify-center">
            <div className="text-center">
              <Monitor size={64} className="text-white/20 mx-auto mb-4" />
              <p className="text-white/40 text-sm">Remote Desktop Connected</p>
              <p className="text-white/20 text-xs mt-1">{host}:{port}</p>
              <div className="mt-6 flex gap-2 justify-center">
                <div className="w-16 h-16 bg-[#4a9eff]/20 rounded-lg flex items-center justify-center">
                  <span className="text-[#4a9eff] text-xs">Files</span>
                </div>
                <div className="w-16 h-16 bg-[#4ecdc4]/20 rounded-lg flex items-center justify-center">
                  <span className="text-[#4ecdc4] text-xs">Terminal</span>
                </div>
                <div className="w-16 h-16 bg-[#ff9800]/20 rounded-lg flex items-center justify-center">
                  <span className="text-[#ff9800] text-xs">Browser</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between px-4 py-2 bg-[#252526] border-t border-[#333]">
        <span className="text-[#4ecdc4] text-xs">Connected to {host}:{port}</span>
        <button onClick={() => setConnected(false)} className="px-3 py-1 bg-red-500/20 text-red-400 text-xs rounded hover:bg-red-500/30 flex items-center gap-1">
          <Power size={10} /> Disconnect
        </button>
      </div>
    </div>
  );
}
