import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Trash2, Play, Type, Square, Circle } from 'lucide-react';

interface Slide {
  id: number;
  elements: { type: 'text' | 'rect' | 'circle'; x: number; y: number; content: string; color: string }[];
}

export default function Impress() {
  const [slides, setSlides] = useState<Slide[]>([{ id: 1, elements: [{ type: 'text', x: 50, y: 40, content: 'Click to add title', color: '#fff' }] }]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [presenting, setPresenting] = useState(false);

  const addSlide = () => {
    setSlides(prev => [...prev, { id: Date.now(), elements: [] }]);
    setActiveSlide(slides.length);
  };

  const addElement = (type: 'text' | 'rect' | 'circle') => {
    const newSlides = [...slides];
    newSlides[activeSlide].elements.push({
      type, x: 30 + Math.random() * 20, y: 30 + Math.random() * 20,
      content: type === 'text' ? 'New text' : '', color: '#4a9eff',
    });
    setSlides(newSlides);
  };

  if (presenting) {
    return (
      <div className="fixed inset-0 bg-black z-[99999] flex items-center justify-center" onClick={() => setPresenting(false)}>
        <div className="w-[800px] h-[450px] bg-[#1a1a2e] rounded-lg relative overflow-hidden flex items-center justify-center">
          {slides[activeSlide]?.elements.map((el, i) => (
            <div key={i} style={{ position: 'absolute', left: `${el.x}%`, top: `${el.y}%`, color: el.color }}>
              {el.type === 'text' ? <span className="text-2xl">{el.content}</span> :
               el.type === 'rect' ? <div className="w-20 h-20 rounded" style={{ backgroundColor: el.color }} /> :
               <div className="w-20 h-20 rounded-full" style={{ backgroundColor: el.color }} />}
            </div>
          ))}
          {slides[activeSlide]?.elements.length === 0 && (
            <span className="text-white/20 text-lg">Slide {activeSlide + 1}</span>
          )}
        </div>
        <div className="absolute bottom-4 text-white/40 text-sm">Click anywhere to exit | Slide {activeSlide + 1} / {slides.length}</div>
        <button onClick={(e) => { e.stopPropagation(); setActiveSlide(Math.max(0, activeSlide - 1)); }} className="absolute left-4 text-white/40 hover:text-white p-4"><ChevronLeft size={32} /></button>
        <button onClick={(e) => { e.stopPropagation(); setActiveSlide(Math.min(slides.length - 1, activeSlide + 1)); }} className="absolute right-4 text-white/40 hover:text-white p-4"><ChevronRight size={32} /></button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#2d2d2d]">
      <div className="flex items-center gap-2 px-3 py-2 bg-[#252526] border-b border-[#333]">
        <button onClick={() => addElement('text')} className="p-1.5 rounded hover:bg-white/10 text-white/60"><Type size={14} /></button>
        <button onClick={() => addElement('rect')} className="p-1.5 rounded hover:bg-white/10 text-white/60"><Square size={14} /></button>
        <button onClick={() => addElement('circle')} className="p-1.5 rounded hover:bg-white/10 text-white/60"><Circle size={14} /></button>
        <div className="w-px h-4 bg-white/10 mx-1" />
        <button onClick={addSlide} className="p-1.5 rounded hover:bg-white/10 text-white/60"><Plus size={14} /></button>
        <button onClick={() => setSlides(prev => prev.filter((_, i) => i !== activeSlide))} className="p-1.5 rounded hover:bg-white/10 text-white/60"><Trash2 size={14} /></button>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-white/40 text-xs">{activeSlide + 1} / {slides.length}</span>
          <button onClick={() => setPresenting(true)} className="px-3 py-1 bg-[#4a9eff] text-white text-xs rounded hover:bg-[#3d8de6] flex items-center gap-1"><Play size={10} /> Present</button>
        </div>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div className="w-32 bg-[#252526] border-r border-[#333] overflow-y-auto p-2 space-y-2">
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              onClick={() => setActiveSlide(i)}
              className={`w-full aspect-video bg-[#1e1e1e] rounded border-2 transition-colors ${
                i === activeSlide ? 'border-[#4a9eff]' : 'border-transparent hover:border-white/20'
              }`}
            >
              <span className="text-white/30 text-xs">{i + 1}</span>
            </button>
          ))}
        </div>
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-[600px] h-[337px] bg-[#1a1a2e] rounded-lg relative overflow-hidden shadow-lg">
            {slides[activeSlide]?.elements.map((el, i) => (
              <div key={i} style={{ position: 'absolute', left: `${el.x}%`, top: `${el.y}%`, color: el.color }}>
                {el.type === 'text' ? <span>{el.content}</span> :
                 el.type === 'rect' ? <div className="w-16 h-16 rounded" style={{ backgroundColor: el.color }} /> :
                 <div className="w-16 h-16 rounded-full" style={{ backgroundColor: el.color }} />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
