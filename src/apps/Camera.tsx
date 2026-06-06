import { useState, useRef, useCallback, useEffect } from 'react';
import { Camera, Trash2 } from 'lucide-react';

export default function CameraApp() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [photos, setPhotos] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('chargeros_photos') || '[]'); }
    catch { return []; }
  });
  const [filter, setFilter] = useState('none');

  const startCamera = useCallback(async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(s);
      if (videoRef.current) videoRef.current.srcObject = s;
    } catch {
      // Fallback to simulated camera
    }
  }, []);

  useEffect(() => {
    startCamera();
    return () => { stream?.getTracks().forEach(t => t.stop()); };
  }, [startCamera]);

  const capture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = 640;
    canvas.height = 480;

    if (video && stream) {
      ctx.filter = filter;
      ctx.drawImage(video, 0, 0);
    } else {
      // Simulated capture
      const gradient = ctx.createLinearGradient(0, 0, 640, 480);
      gradient.addColorStop(0, '#2c1e4a');
      gradient.addColorStop(0.5, '#6b2d5b');
      gradient.addColorStop(1, '#c75b39');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 640, 480);
      ctx.fillStyle = 'white';
      ctx.font = '20px sans-serif';
      ctx.fillText('Captured ' + new Date().toLocaleTimeString(), 20, 40);
    }

    const dataUrl = canvas.toDataURL('image/png');
    const newPhotos = [dataUrl, ...photos];
    setPhotos(newPhotos);
    localStorage.setItem('chargeros_photos', JSON.stringify(newPhotos.slice(0, 20)));
  };

  const deletePhoto = (idx: number) => {
    const newPhotos = photos.filter((_, i) => i !== idx);
    setPhotos(newPhotos);
    localStorage.setItem('chargeros_photos', JSON.stringify(newPhotos));
  };

  return (
    <div className="flex flex-col h-full bg-[#1a1a1a]">
      {/* Viewfinder */}
      <div className="flex-1 relative flex items-center justify-center bg-black overflow-hidden">
        {stream ? (
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" style={{ filter }} />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #2c1e4a, #6b2d5b, #c75b39)', filter }}>
            <Camera size={64} className="text-white/20" />
          </div>
        )}

        {/* Capture button */}
        <button
          onClick={capture}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full border-4 border-white/30 flex items-center justify-center hover:border-white/60 transition-colors"
        >
          <div className="w-12 h-12 rounded-full bg-white" />
        </button>

        {/* Filter buttons */}
        <div className="absolute top-4 right-4 flex gap-2">
          {['none', 'grayscale(1)', 'sepia(1)', 'invert(1)'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-2 py-1 rounded text-[10px] ${filter === f ? 'bg-[#4a9eff] text-white' : 'bg-black/50 text-white/60'}`}>
              {f === 'none' ? 'Normal' : f.replace('(1)', '')}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery */}
      {photos.length > 0 && (
        <div className="h-24 bg-[#252526] border-t border-[#333] flex gap-2 p-2 overflow-x-auto">
          {photos.map((photo, i) => (
            <div key={i} className="relative group shrink-0">
              <img src={photo} className="h-full w-16 object-cover rounded" alt={`Photo ${i}`} />
              <button onClick={() => deletePhoto(i)} className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[8px] flex items-center justify-center opacity-0 group-hover:opacity-100"><Trash2 size={8} /></button>
            </div>
          ))}
        </div>
      )}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
