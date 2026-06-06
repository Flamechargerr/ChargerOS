import { useState, useRef, useEffect } from 'react';
import { useFileSystem } from '@/contexts/FileSystemContext';
import { useDesktop } from '@/contexts/DesktopContext';

interface Props {
  windowData?: { filePath?: string; content?: string };
}

export default function TextEditor({ windowData }: Props) {
  const { readFile, writeFile } = useFileSystem();
  const { openApp } = useDesktop();
  const [content, setContent] = useState(windowData?.content || '');
  const [filePath, setFilePath] = useState(windowData?.filePath || '');
  const [isDirty, setIsDirty] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    void openApp;
  }, [openApp]);

  useEffect(() => {
    if (windowData?.content !== undefined) {
      setContent(windowData.content);
      setFilePath(windowData.filePath || '');
    }
  }, [windowData]);

  const handleSave = () => {
    const path = filePath || prompt('Save as (path):') || '/home/user/Documents/untitled.txt';
    if (path) {
      writeFile(path, content);
      setFilePath(path);
      setIsDirty(false);
    }
  };

  const handleOpen = () => {
    const path = prompt('Open file (path):');
    if (path) {
      const fileContent = readFile(path);
      if (fileContent !== null) {
        setContent(fileContent);
        setFilePath(path);
        setIsDirty(false);
      }
    }
  };

  const lineCount = content.split('\n').length;
  const charCount = content.length;

  return (
    <div className="flex flex-col h-full bg-[#2d2d2d]">
      <div className="flex items-center gap-1 px-3 py-1.5 bg-[#252526] border-b border-[#333]">
        <button onClick={() => { setContent(''); setFilePath(''); setIsDirty(false); }} className="px-3 py-1 text-xs text-white/60 hover:bg-white/10 hover:text-white rounded transition-colors">New</button>
        <button onClick={handleOpen} className="px-3 py-1 text-xs text-white/60 hover:bg-white/10 hover:text-white rounded transition-colors">Open</button>
        <button onClick={handleSave} className="px-3 py-1 text-xs text-white/60 hover:bg-white/10 hover:text-white rounded transition-colors">Save</button>
        <div className="w-px h-4 bg-white/10 mx-1" />
        <button onClick={() => document.execCommand('undo')} className="px-3 py-1 text-xs text-white/60 hover:bg-white/10 hover:text-white rounded transition-colors">Undo</button>
        <button onClick={() => document.execCommand('redo')} className="px-3 py-1 text-xs text-white/60 hover:bg-white/10 hover:text-white rounded transition-colors">Redo</button>
        <span className="text-white/30 text-xs ml-auto">{isDirty && 'Modified'}{filePath && ` - ${filePath}`}</span>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-12 bg-[#1e1e1e] text-right pr-2 pt-3 text-[#555] text-sm font-mono leading-6 select-none overflow-hidden">
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => { setContent(e.target.value); setIsDirty(true); }}
          className="flex-1 bg-[#1e1e1e] text-[#ccc] font-mono text-sm p-3 leading-6 resize-none outline-none border-none"
          spellCheck={false}
        />
      </div>

      <div className="flex items-center justify-between px-3 py-1 bg-[#007acc] text-white text-xs">
        <span>UTF-8</span>
        <span>{lineCount} lines, {charCount} characters</span>
      </div>
    </div>
  );
}
