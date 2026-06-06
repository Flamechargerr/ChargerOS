import { useState, useRef, useEffect } from 'react';
import { Mic, Play, Square, Trash2 } from 'lucide-react';

interface Recording {
  id: string;
  name: string;
  duration: number;
  date: string;
  waveform: number[];
}

export default function SoundRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [recordings, setRecordings] = useState<Recording[]>(() => {
    try { return JSON.parse(localStorage.getItem('chargeros_recordings') || '[]'); }
    catch { return []; }
  });
  const [waveform, setWaveform] = useState<number[]>(Array(40).fill(5));
  const intervalRef = useRef(0);

  useEffect(() => {
    if (isRecording) {
      intervalRef.current = window.setInterval(() => {
        setElapsed(e => e + 1);
        setWaveform(prev => [...prev.slice(1), Math.random() * 30 + 5]);
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRecording]);

  const startRecording = () => {
    setIsRecording(true);
    setElapsed(0);
    setWaveform(Array(40).fill(5));
  };

  const stopRecording = () => {
    setIsRecording(false);
    clearInterval(intervalRef.current);
    const newRecording: Recording = {
      id: Date.now().toString(),
      name: `Recording ${recordings.length + 1}`,
      duration: elapsed,
      date: new Date().toLocaleDateString(),
      waveform: [...waveform],
    };
    const newRecordings = [newRecording, ...recordings];
    setRecordings(newRecordings);
    localStorage.setItem('chargeros_recordings', JSON.stringify(newRecordings));
    setElapsed(0);
  };

  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div className="flex flex-col h-full bg-[#2d2d2d] p-4">
      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Record button */}
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
            isRecording ? 'bg-red-500 animate-pulse' : 'bg-[#f44336] hover:bg-red-600'
          }`}
        >
          {isRecording ? <Square size={24} className="text-white" /> : <Mic size={28} className="text-white" />}
        </button>

        <p className="text-white text-2xl font-light tabular-nums mt-4">{formatTime(elapsed)}</p>
        <p className="text-white/40 text-xs">{isRecording ? 'Recording...' : 'Tap to record'}</p>

        {/* Waveform */}
        <div className="flex items-end gap-[2px] h-16 mt-6">
          {waveform.map((h, i) => (
            <div key={i} className={`w-1.5 rounded-full transition-all ${isRecording ? 'bg-[#f44336]' : 'bg-white/20'}`} style={{ height: `${h * 2}px` }} />
          ))}
        </div>
      </div>

      {/* Recordings list */}
      <div className="max-h-32 overflow-y-auto space-y-1">
        {recordings.map(rec => (
          <div key={rec.id} className="flex items-center justify-between px-3 py-2 bg-[#252526] rounded-lg">
            <div className="flex items-center gap-2">
              <Play size={12} className="text-[#4a9eff]" />
              <span className="text-white text-xs">{rec.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white/30 text-xs">{formatTime(rec.duration)}</span>
              <button onClick={() => { const n = recordings.filter(r => r.id !== rec.id); setRecordings(n); localStorage.setItem('chargeros_recordings', JSON.stringify(n)); }} className="text-white/20 hover:text-red-400"><Trash2 size={10} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
