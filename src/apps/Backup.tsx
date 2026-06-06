import { useState } from 'react';
import { Download, Upload, FileJson } from 'lucide-react';

export default function Backup() {
  const [lastBackup, setLastBackup] = useState(localStorage.getItem('chargeros_lastBackup') || null);
  const [message, setMessage] = useState('');

  const exportData = () => {
    const data: Record<string, any> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('chargeros_')) {
        try { data[key] = JSON.parse(localStorage.getItem(key) || ''); }
        catch { data[key] = localStorage.getItem(key); }
      }
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chargeros-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    const now = new Date().toLocaleString();
    setLastBackup(now);
    localStorage.setItem('chargeros_lastBackup', now);
    setMessage('Backup exported successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string);
        Object.entries(data).forEach(([key, value]) => {
          localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
        });
        setMessage('Data restored successfully! Reloading...');
        setTimeout(() => window.location.reload(), 1500);
      } catch {
        setMessage('Error: Invalid backup file');
        setTimeout(() => setMessage(''), 3000);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex flex-col h-full bg-[#2d2d2d] p-6 items-center justify-center">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <FileJson size={48} className="text-[#4a9eff] mx-auto mb-4" />
          <h2 className="text-white text-xl font-medium">Backup & Restore</h2>
          <p className="text-white/40 text-sm mt-1">Export or import all your ChargerOS data</p>
        </div>

        {message && (
          <div className="bg-[#4a9eff]/20 border border-[#4a9eff]/30 text-[#4a9eff] text-sm px-4 py-2.5 rounded-lg text-center">
            {message}
          </div>
        )}

        {lastBackup && (
          <div className="text-center text-white/40 text-xs">
            Last backup: {lastBackup}
          </div>
        )}

        <button
          onClick={exportData}
          className="w-full flex items-center justify-center gap-3 bg-[#4a9eff] hover:bg-[#3d8de6] text-white py-3 rounded-xl transition-colors"
        >
          <Download size={18} />
          Export All Data
        </button>

        <label className="w-full flex items-center justify-center gap-3 bg-[#333] hover:bg-[#444] text-white py-3 rounded-xl transition-colors cursor-pointer">
          <Upload size={18} />
          Import from File
          <input type="file" accept=".json" className="hidden" onChange={importData} />
        </label>

        <div className="border-t border-white/10 pt-4">
          <p className="text-white/30 text-xs text-center">
            Backup includes: files, settings, notes, todos, calendar events, and all app data.
          </p>
        </div>
      </div>
    </div>
  );
}
