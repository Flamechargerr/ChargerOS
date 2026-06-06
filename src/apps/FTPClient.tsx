import { useState } from 'react';
import { Server, Upload, Download, FolderOpen, File, Globe } from 'lucide-react';

interface RemoteFile {
  name: string;
  type: 'file' | 'folder';
  size: string;
}

const mockRemoteFiles: RemoteFile[] = [
  { name: 'public_html', type: 'folder', size: '--' },
  { name: 'cgi-bin', type: 'folder', size: '--' },
  { name: 'backup.zip', type: 'file', size: '24MB' },
  { name: 'index.html', type: 'file', size: '4KB' },
  { name: 'style.css', type: 'file', size: '12KB' },
  { name: 'script.js', type: 'file', size: '8KB' },
  { name: 'logo.png', type: 'file', size: '156KB' },
  { name: 'README.md', type: 'file', size: '2KB' },
];

export default function FTPClient() {
  const [connected, setConnected] = useState(false);
  const [host, setHost] = useState('ftp.example.com');
  const [user, setUser] = useState('user');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('Disconnected');

  const connect = () => {
    setStatus('Connecting...');
    setTimeout(() => {
      setConnected(true);
      setStatus(`Connected to ${host}`);
    }, 800);
  };

  if (!connected) {
    return (
      <div className="flex flex-col h-full bg-[#2d2d2d] items-center justify-center">
        <div className="w-80">
          <div className="text-center mb-6">
            <Server size={48} className="text-[#4a9eff] mx-auto mb-3" />
            <h2 className="text-white font-medium">FTP Client</h2>
            <p className="text-white/40 text-sm">Connect to a remote server</p>
          </div>
          <div className="space-y-3">
            <input type="text" value={host} onChange={e => setHost(e.target.value)} className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none" placeholder="Host" />
            <input type="text" value={user} onChange={e => setUser(e.target.value)} className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none" placeholder="Username" />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none" placeholder="Password" />
            <button onClick={connect} className="w-full py-2 bg-[#4a9eff] text-white rounded-lg hover:bg-[#3d8de6]">Connect</button>
            <p className="text-white/30 text-xs text-center">{status}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#2d2d2d]">
      <div className="flex items-center justify-between px-4 py-2 bg-[#252526] border-b border-[#333]">
        <div className="flex items-center gap-2 text-sm">
          <Globe size={14} className="text-[#4ecdc4]" />
          <span className="text-[#4ecdc4]">{status}</span>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1 text-xs bg-[#333] text-white rounded hover:bg-[#444] flex items-center gap-1"><Upload size={12} /> Upload</button>
          <button className="px-3 py-1 text-xs bg-[#333] text-white rounded hover:bg-[#444] flex items-center gap-1"><Download size={12} /> Download</button>
          <button onClick={() => setConnected(false)} className="px-3 py-1 text-xs bg-red-500/20 text-red-400 rounded hover:bg-red-500/30">Disconnect</button>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-4">
        <div className="grid grid-cols-[1fr_60px_60px] gap-2 text-xs text-white/40 px-3 py-2 border-b border-white/10">
          <span>Name</span><span>Size</span><span>Type</span>
        </div>
        {mockRemoteFiles.map((file, i) => (
          <div key={i} className="grid grid-cols-[1fr_60px_60px] gap-2 text-sm px-3 py-2 text-white/80 hover:bg-white/5 transition-colors">
            <span className="flex items-center gap-2">
              {file.type === 'folder' ? <FolderOpen size={14} className="text-[#4a9eff]" /> : <File size={14} className="text-[#ccc]" />}
              {file.name}
            </span>
            <span className="text-white/40">{file.size}</span>
            <span className="text-white/40 capitalize">{file.type}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
