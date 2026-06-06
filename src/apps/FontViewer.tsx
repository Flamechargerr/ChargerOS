import { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';

const fonts = [
  'system-ui', 'Arial', 'Georgia', 'Times New Roman', 'Courier New', 'Verdana',
  'Helvetica', 'Tahoma', 'Trebuchet MS', 'Impact', 'Comic Sans MS',
  'Palatino Linotype', 'Book Antiqua', 'Arial Black', 'Lucida Console',
];

export default function FontViewer() {
  const [sampleText, setSampleText] = useState('The quick brown fox jumps over the lazy dog.');
  const [fontSize, setFontSize] = useState(24);

  return (
    <div className="flex flex-col h-full bg-[#2d2d2d]">
      <div className="p-4 border-b border-[#333]">
        <input
          type="text"
          value={sampleText}
          onChange={e => setSampleText(e.target.value)}
          className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none mb-3"
        />
        <div className="flex items-center gap-3">
          <SlidersHorizontal size={14} className="text-white/40" />
          <input type="range" min={8} max={72} value={fontSize} onChange={e => setFontSize(parseInt(e.target.value))} className="flex-1" />
          <span className="text-white/40 text-xs w-8">{fontSize}px</span>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {fonts.map(font => (
          <div key={font} className="p-4 bg-[#252526] rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/40 text-xs">{font}</span>
              <button onClick={() => navigator.clipboard.writeText(font)} className="text-white/20 hover:text-white text-xs">Copy</button>
            </div>
            <p style={{ fontFamily: font, fontSize: `${fontSize}px` }} className="text-white">
              {sampleText || 'Aa Bb Cc 123'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
