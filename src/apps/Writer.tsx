import { useState, useRef } from 'react';
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, List, ListOrdered } from 'lucide-react';

export default function Writer() {
  const [content, setContent] = useState('<p>Start typing your document here...</p>');
  const [fontSize, setFontSize] = useState('16');
  const [fontColor, setFontColor] = useState('#cccccc');
  const editorRef = useRef<HTMLDivElement>(null);

  const exec = (command: string, value: string = '') => {
    document.execCommand(command, false, value);
  };

  const ToolbarButton = ({ onClick, icon: Icon, active }: { onClick: () => void; icon: any; active?: boolean }) => (
    <button onClick={onClick} className={`p-1.5 rounded hover:bg-white/10 transition-colors ${active ? 'bg-white/20 text-[#4a9eff]' : 'text-white/60'}`}>
      <Icon size={14} />
    </button>
  );

  return (
    <div className="flex flex-col h-full bg-[#2d2d2d]">
      <div className="flex flex-wrap items-center gap-1 px-3 py-2 bg-[#252526] border-b border-[#333]">
        <select value={fontSize} onChange={e => { setFontSize(e.target.value); exec('fontSize', e.target.value); }} className="bg-white/10 text-white text-xs rounded px-2 py-1 outline-none">
          {['12', '14', '16', '18', '20', '24', '28', '32'].map(s => <option key={s} value={s}>{s}px</option>)}
        </select>
        <div className="w-px h-4 bg-white/10" />
        <ToolbarButton onClick={() => exec('bold')} icon={Bold} />
        <ToolbarButton onClick={() => exec('italic')} icon={Italic} />
        <ToolbarButton onClick={() => exec('underline')} icon={Underline} />
        <div className="w-px h-4 bg-white/10" />
        <ToolbarButton onClick={() => exec('justifyLeft')} icon={AlignLeft} />
        <ToolbarButton onClick={() => exec('justifyCenter')} icon={AlignCenter} />
        <ToolbarButton onClick={() => exec('justifyRight')} icon={AlignRight} />
        <div className="w-px h-4 bg-white/10" />
        <ToolbarButton onClick={() => exec('insertUnorderedList')} icon={List} />
        <ToolbarButton onClick={() => exec('insertOrderedList')} icon={ListOrdered} />
        <div className="w-px h-4 bg-white/10" />
        <input type="color" value={fontColor} onChange={e => { setFontColor(e.target.value); exec('foreColor', e.target.value); }} className="w-6 h-6 rounded cursor-pointer bg-transparent" />
      </div>
      <div className="flex-1 overflow-auto p-8">
        <div
          ref={editorRef}
          contentEditable
          className="min-h-[400px] bg-[#1e1e1e] rounded-lg p-6 text-[#ccc] outline-none text-sm leading-relaxed max-w-[800px] mx-auto"
          style={{ fontSize: `${fontSize}px` }}
          dangerouslySetInnerHTML={{ __html: content }}
          onInput={(e) => setContent((e.target as HTMLDivElement).innerHTML)}
        />
      </div>
      <div className="px-4 py-1 bg-[#007acc] text-white text-xs flex justify-between">
        <span>Document</span>
        <span>UTF-8</span>
      </div>
    </div>
  );
}
