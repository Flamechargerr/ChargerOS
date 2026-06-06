import { useState, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Maximize, Film } from 'lucide-react';

const videos = [
  { title: 'Big Buck Bunny', duration: 596 },
  { title: 'Sintel', duration: 888 },
  { title: 'Tears of Steel', duration: 734 },
];

export default function VideoPlayer() {
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const hideTimeout = useRef(0);

  const video = videos[current];
  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      const interval = window.setInterval(() => {
        setProgress(p => {
          if (p >= video.duration) { setIsPlaying(false); return 0; }
          return p + 1;
        });
      }, 1000);
      hideTimeout.current = interval;
    } else {
      clearInterval(hideTimeout.current);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#1a1a1a]" onMouseMove={() => setShowControls(true)} onMouseLeave={() => setShowControls(false)}>
      {/* Video display */}
      <div className="flex-1 flex items-center justify-center relative bg-black">
        <div className="text-center">
          <Film size={64} className="text-white/10 mx-auto mb-4" />
          <p className="text-white/30 text-sm">{video.title}</p>
          <p className="text-white/20 text-xs mt-1">{formatTime(progress)} / {formatTime(video.duration)}</p>
        </div>

        {/* Controls overlay */}
        {showControls && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <div className="w-full h-1 bg-white/20 rounded-full mb-3 cursor-pointer" onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const pct = (e.clientX - rect.left) / rect.width;
              setProgress(Math.floor(pct * video.duration));
            }}>
              <div className="h-full bg-[#4a9eff] rounded-full" style={{ width: `${(progress / video.duration) * 100}%` }} />
            </div>
            <div className="flex items-center gap-3">
              <button onClick={togglePlay} className="text-white hover:text-[#4a9eff]">{isPlaying ? <Pause size={18} /> : <Play size={18} />}</button>
              <button onClick={() => setCurrent(i => (i - 1 + videos.length) % videos.length)} className="text-white/60 hover:text-white"><SkipBack size={16} /></button>
              <button onClick={() => setCurrent(i => (i + 1) % videos.length)} className="text-white/60 hover:text-white"><SkipForward size={16} /></button>
              <span className="text-white/40 text-xs">{formatTime(progress)} / {formatTime(video.duration)}</span>
              <div className="ml-auto flex items-center gap-2">
                <Volume2 size={14} className="text-white/60" />
                <div className="w-16 h-1 bg-white/20 rounded-full"><div className="w-3/4 h-full bg-white rounded-full" /></div>
                <Maximize size={14} className="text-white/60" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
