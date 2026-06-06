import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Music, Heart } from 'lucide-react';

interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  color: string;
}

const tracks: Track[] = [
  { id: '1', title: 'Midnight Dreams', artist: 'Luna Eclipse', album: 'Night Sky', duration: 245, color: '#4a9eff' },
  { id: '2', title: 'Solar Flare', artist: 'Star Walkers', album: 'Cosmic', duration: 198, color: '#ff9800' },
  { id: '3', title: 'Ocean Waves', artist: 'Deep Blue', album: 'Nature', duration: 312, color: '#4ecdc4' },
  { id: '4', title: 'City Lights', artist: 'Neon Pulse', album: 'Urban', duration: 267, color: '#ff6b6b' },
  { id: '5', title: 'Forest Rain', artist: 'Green Leaf', album: 'Nature', duration: 289, color: '#4caf50' },
  { id: '6', title: 'Digital Mind', artist: 'Cyber Soul', album: 'Future', duration: 223, color: '#9c27b0' },
];

export default function MusicPlayer() {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [shuffle, setShuffle] = useState(false);
  const intervalRef = useRef(0);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = window.setInterval(() => {
        setProgress(p => {
          if (p >= tracks[currentTrack].duration) {
            setCurrentTrack(i => (i + 1) % tracks.length);
            return 0;
          }
          return p + 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPlaying, currentTrack]);

  useEffect(() => { setProgress(0); }, [currentTrack]);

  const track = tracks[currentTrack];
  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div className="flex flex-col h-full bg-[#2d2d2d]">
      {/* Now playing */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-40 h-40 rounded-2xl shadow-xl flex items-center justify-center mb-4" style={{ backgroundColor: track.color + '30', border: `2px solid ${track.color}40` }}>
          <Music size={48} style={{ color: track.color }} />
        </div>
        <h3 className="text-white font-medium text-lg">{track.title}</h3>
        <p className="text-white/40 text-sm">{track.artist}</p>
        <p className="text-white/20 text-xs">{track.album}</p>

        {/* Progress */}
        <div className="w-full max-w-xs mt-6">
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-[#4a9eff] rounded-full transition-all" style={{ width: `${(progress / track.duration) * 100}%` }} />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-white/30 text-[10px]">{formatTime(progress)}</span>
            <span className="text-white/30 text-[10px]">{formatTime(track.duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4 mt-4">
          <button onClick={() => setShuffle(!shuffle)} className={`${shuffle ? 'text-[#4a9eff]' : 'text-white/30'} hover:text-white`}><Shuffle size={16} /></button>
          <button onClick={() => setCurrentTrack(i => (i - 1 + tracks.length) % tracks.length)} className="text-white/60 hover:text-white"><SkipBack size={20} /></button>
          <button onClick={() => setIsPlaying(!isPlaying)} className="w-12 h-12 rounded-full bg-[#4a9eff] text-white flex items-center justify-center hover:bg-[#3d8de6]">
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
          <button onClick={() => setCurrentTrack(i => (i + 1) % tracks.length)} className="text-white/60 hover:text-white"><SkipForward size={20} /></button>
          <button className="text-white/30 hover:text-white"><Repeat size={16} /></button>
        </div>
      </div>

      {/* Playlist */}
      <div className="border-t border-[#333] max-h-40 overflow-auto">
        {tracks.map((t, i) => (
          <button
            key={t.id}
            onClick={() => setCurrentTrack(i)}
            className={`w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-white/5 transition-colors ${i === currentTrack ? 'bg-[#4a9eff]/10' : ''}`}
          >
            <span className="text-white/30 text-xs w-4">{i === currentTrack && isPlaying ? '>' : i + 1}</span>
            <div className="flex-1">
              <p className={`text-sm ${i === currentTrack ? 'text-[#4a9eff]' : 'text-white/80'}`}>{t.title}</p>
              <p className="text-white/30 text-[10px]">{t.artist}</p>
            </div>
            <button onClick={(e) => { e.stopPropagation(); setLiked(prev => { const n = new Set(prev); n.has(t.id) ? n.delete(t.id) : n.add(t.id); return n; }); }}>
              <Heart size={12} className={liked.has(t.id) ? 'text-red-400 fill-red-400' : 'text-white/20'} />
            </button>
            <span className="text-white/30 text-xs">{formatTime(t.duration)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
