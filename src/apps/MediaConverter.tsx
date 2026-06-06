import { useState } from 'react';
import { RefreshCw, FileVideo, ArrowRight, Check } from 'lucide-react';

const FORMATS = ['MP3', 'WAV', 'OGG', 'AAC', 'FLAC', 'MP4', 'AVI', 'MKV', 'MOV', 'WEBM'];

export default function MediaConverter() {
  const [file, setFile] = useState<string | null>(null);
  const [inputFormat, setInputFormat] = useState('MP4');
  const [outputFormat, setOutputFormat] = useState('MP3');
  const [converting, setConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  const startConvert = () => {
    if (!file) return;
    setConverting(true);
    setProgress(0);
    setDone(false);
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setConverting(false);
          setDone(true);
          return 100;
        }
        return p + 3;
      });
    }, 150);
  };

  return (
    <div className="flex flex-col h-full bg-[#2d2d2d] p-6 items-center justify-center">
      <div className="w-80">
        <div className="text-center mb-6">
          <RefreshCw size={40} className="text-[#4a9eff] mx-auto mb-3" />
          <h2 className="text-white font-medium">Media Converter</h2>
        </div>

        {/* File selection */}
        <label className="block w-full bg-white/5 border-2 border-dashed border-white/10 rounded-xl p-6 text-center hover:border-[#4a9eff]/50 transition-colors cursor-pointer mb-4">
          <input type="file" accept="audio/*,video/*" className="hidden" onChange={e => setFile(e.target.files?.[0]?.name || null)} />
          {file ? <p className="text-white text-sm">{file}</p> : <><FileVideo size={24} className="text-white/20 mx-auto mb-2" /><p className="text-white/30 text-xs">Drop a file or click to select</p></>}
        </label>

        {/* Format selection */}
        <div className="flex items-center gap-3 mb-4">
          <select value={inputFormat} onChange={e => setInputFormat(e.target.value)} className="flex-1 bg-white/10 text-white text-sm rounded-lg px-2 py-2 outline-none">
            {FORMATS.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
          <ArrowRight size={16} className="text-white/30" />
          <select value={outputFormat} onChange={e => setOutputFormat(e.target.value)} className="flex-1 bg-white/10 text-white text-sm rounded-lg px-2 py-2 outline-none">
            {FORMATS.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>

        {/* Convert button */}
        <button onClick={startConvert} disabled={!file || converting} className="w-full py-2.5 bg-[#4a9eff] text-white rounded-lg hover:bg-[#3d8de6] disabled:opacity-50 flex items-center justify-center gap-2">
          {done ? <><Check size={16} /> Done</> : converting ? `Converting... ${progress}%` : 'Convert'}
        </button>

        {converting && (
          <div className="mt-3 w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-[#4a9eff] rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        )}
      </div>
    </div>
  );
}
