import { useState } from 'react';
import { GitBranch, GitCommit } from 'lucide-react';

interface Commit {
  id: string;
  message: string;
  author: string;
  date: string;
  branch: string;
}

interface Branch {
  name: string;
  current: boolean;
}

export default function GitClient() {
  const [branches, setBranches] = useState<Branch[]>([
    { name: 'main', current: true },
    { name: 'feature/ui', current: false },
    { name: 'bugfix/terminal', current: false },
    { name: 'develop', current: false },
  ]);
  const [commits, setCommits] = useState<Commit[]>([
    { id: 'a1b2c3d', message: 'Initial commit', author: 'User', date: '2024-01-10', branch: 'main' },
    { id: 'e4f5g6h', message: 'Add desktop environment', author: 'User', date: '2024-01-11', branch: 'main' },
    { id: 'i7j8k9l', message: 'Implement window manager', author: 'User', date: '2024-01-12', branch: 'main' },
    { id: 'm0n1o2p', message: 'Add 50+ applications', author: 'User', date: '2024-01-15', branch: 'main' },
    { id: 'q3r4s5t', message: 'Fix terminal commands', author: 'User', date: '2024-01-14', branch: 'bugfix/terminal' },
    { id: 'u6v7w8x', message: 'Add custom themes', author: 'User', date: '2024-01-13', branch: 'feature/ui' },
  ]);
  const [commitMessage, setCommitMessage] = useState('');
  const [changedFiles] = useState(['src/apps/FileManager.tsx', 'src/apps/Terminal.tsx', 'src/contexts/DesktopContext.tsx']);
  const [activeTab, setActiveTab] = useState<'commits' | 'branches'>('commits');

  const currentBranch = branches.find(b => b.current)?.name || 'main';

  const makeCommit = () => {
    if (!commitMessage.trim()) return;
    setCommits(prev => [{
      id: Math.random().toString(36).substr(2, 7),
      message: commitMessage,
      author: 'User',
      date: new Date().toISOString().slice(0, 10),
      branch: currentBranch,
    }, ...prev]);
    setCommitMessage('');
  };

  const switchBranch = (name: string) => {
    setBranches(prev => prev.map(b => ({ ...b, current: b.name === name })));
  };

  return (
    <div className="flex flex-col h-full bg-[#2d2d2d]">
      <div className="flex items-center gap-2 px-4 py-2 bg-[#252526] border-b border-[#333]">
        <GitBranch size={16} className="text-[#ff9800]" />
        <span className="text-white text-sm">{currentBranch}</span>
        <div className="ml-auto flex gap-1">
          <button onClick={() => setActiveTab('commits')} className={`px-3 py-1 text-xs rounded ${activeTab === 'commits' ? 'bg-[#4a9eff]/20 text-[#4a9eff]' : 'text-white/40'}`}>Commits</button>
          <button onClick={() => setActiveTab('branches')} className={`px-3 py-1 text-xs rounded ${activeTab === 'branches' ? 'bg-[#4a9eff]/20 text-[#4a9eff]' : 'text-white/40'}`}>Branches</button>
        </div>
      </div>

      {activeTab === 'commits' ? (
        <div className="flex flex-1 overflow-hidden">
          {/* Changed files */}
          <div className="w-48 bg-[#252526] border-r border-[#333] p-3">
            <p className="text-white/40 text-[10px] uppercase mb-2">Changes ({changedFiles.length})</p>
            {changedFiles.map((f, i) => (
              <div key={i} className="flex items-center gap-2 py-1 text-xs">
                <span className="text-[#4ecdc4]">M</span>
                <span className="text-white/60 truncate">{f.split('/').pop()}</span>
              </div>
            ))}
            <div className="mt-4 space-y-2">
              <input
                type="text"
                value={commitMessage}
                onChange={e => setCommitMessage(e.target.value)}
                placeholder="Commit message"
                className="w-full bg-white/10 border border-white/10 rounded px-2 py-1 text-xs text-white placeholder-white/30 outline-none"
              />
              <button onClick={makeCommit} className="w-full py-1.5 bg-[#4a9eff] text-white text-xs rounded hover:bg-[#3d8de6] flex items-center justify-center gap-1">
                <GitCommit size={10} /> Commit
              </button>
            </div>
          </div>

          {/* Commit history */}
          <div className="flex-1 overflow-auto p-4">
            <div className="relative pl-6">
              {commits.filter(c => c.branch === currentBranch).map((commit, i) => (
                <div key={commit.id} className="relative pb-6">
                  {i === 0 && <div className="absolute left-[-14px] top-1 w-3 h-3 rounded-full bg-[#4a9eff] ring-4 ring-[#4a9eff]/20" />}
                  {i > 0 && <div className="absolute left-[-12px] top-1 w-2 h-2 rounded-full bg-white/30" />}
                  {i < commits.filter(c => c.branch === currentBranch).length - 1 && (
                    <div className="absolute left-[-9px] top-3 w-px h-full bg-white/10" />
                  )}
                  <p className="text-white text-sm font-medium">{commit.message}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[#ff9800] text-[10px] font-mono">{commit.id}</span>
                    <span className="text-white/30 text-[10px]">{commit.author}</span>
                    <span className="text-white/30 text-[10px]">{commit.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-auto p-4">
          {branches.map(branch => (
            <button
              key={branch.name}
              onClick={() => switchBranch(branch.name)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
                branch.current ? 'bg-[#4a9eff]/10' : 'hover:bg-white/5'
              }`}
            >
              <GitBranch size={14} className={branch.current ? 'text-[#4a9eff]' : 'text-white/30'} />
              <span className={`text-sm ${branch.current ? 'text-white font-medium' : 'text-white/60'}`}>{branch.name}</span>
              {branch.current && <span className="ml-auto text-[10px] text-[#4a9eff]">current</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
