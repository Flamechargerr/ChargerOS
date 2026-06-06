import { useState } from 'react';
import { FileCode } from 'lucide-react';

interface OpenFile {
  name: string;
  content: string;
  language: string;
}

const sampleFiles: OpenFile[] = [
  { name: 'index.html', language: 'html', content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>ChargerOS</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div id="app">
        <h1>Welcome to ChargerOS</h1>
        <p>A fully functional OS in your browser.</p>
    </div>
    <script src="app.js"><\/script>
</body>
</html>` },
  { name: 'style.css', language: 'css', content: `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Ubuntu', sans-serif;
    background: #1a1a2e;
    color: #cccccc;
}

#app {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

h1 {
    color: #4a9eff;
    font-size: 2rem;
    margin-bottom: 1rem;
}` },
  { name: 'app.js', language: 'javascript', content: `// ChargerOS - Main Application

class ChargerOS {
    constructor() {
        this.version = '1.0.0';
        this.apps = new Map();
        this.desktop = new Desktop();
    }

    init() {
        console.log('ChargerOS v' + this.version);
        this.desktop.render();
        this.loadApps();
    }

    loadApps() {
        const appList = [
            'filemanager', 'terminal', 'browser',
            'texteditor', 'calculator', 'settings'
        ];
        appList.forEach(app => this.register(app));
    }

    register(name) {
        this.apps.set(name, { name, running: false });
    }
}

const os = new ChargerOS();
os.init();` },
];

const LANGUAGE_COLORS: Record<string, string> = {
  html: '#e34c26', css: '#264de4', javascript: '#f7df1e', typescript: '#3178c6', json: '#f7df1e', python: '#3776ab',
};

export default function CodeEditor() {
  const [files] = useState<OpenFile[]>(sampleFiles);
  const [activeFile, setActiveFile] = useState(0);
  const [openFiles, setOpenFiles] = useState<number[]>([0, 1, 2]);

  const file = files[activeFile];

  const highlightSyntax = (code: string, lang: string): string => {
    if (lang === 'html') {
      return code
        .replace(/(&lt;\/?)(\w+)/g, '$1<span class="text-[#ff9800]">$2</span>')
        .replace(/(\s)(\w+)=/g, '$1<span class="text-[#4a9eff]">$2</span>=')
        .replace(/"([^"]*)"/g, '<span class="text-[#4ecdc4]">"$1"</span>');
    }
    if (lang === 'css') {
      return code
        .replace(/([\w-]+):/g, '<span class="text-[#4a9eff]">$1</span>:')
        .replace(/([\w-]+)\s*\{/g, '<span class="text-[#ff9800]">$1</span> {')
        .replace(/\b(\d+(?:px|rem|%|em)?)\b/g, '<span class="text-[#f7b731]">$1</span>');
    }
    return code
      .replace(/\b(const|let|var|function|class|return|if|else|for|while|new|this|import|export|from)\b/g, '<span class="text-[#ff6b6b]">$1</span>')
      .replace(/\b(console|document|window|Math|Date|Array|Object|String|Number)\b/g, '<span class="text-[#4a9eff]">$1</span>')
      .replace(/("[^"]*"|'[^']*')/g, '<span class="text-[#4ecdc4]">$1</span>')
      .replace(/\/\/.*$/gm, '<span class="text-[#666]">$&</span>');
  };

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e]">
      {/* Tab bar */}
      <div className="flex items-center bg-[#252526] border-b border-[#333] overflow-x-auto">
        {openFiles.map(idx => (
          <button
            key={idx}
            onClick={() => setActiveFile(idx)}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs border-r border-[#333] transition-colors ${
              activeFile === idx ? 'bg-[#1e1e1e] text-white' : 'text-white/40 hover:bg-[#333] hover:text-white/60'
            }`}
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: LANGUAGE_COLORS[files[idx].language] || '#ccc' }} />
            {files[idx].name}
          </button>
        ))}
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-40 bg-[#252526] border-r border-[#333] py-2 overflow-y-auto">
          <p className="text-white/30 text-[10px] uppercase px-3 py-1">Explorer</p>
          {files.map((f, i) => (
            <button
              key={i}
              onClick={() => { setActiveFile(i); if (!openFiles.includes(i)) setOpenFiles(prev => [...prev, i]); }}
              className={`w-full text-left px-3 py-1 text-xs flex items-center gap-1.5 transition-colors ${
                activeFile === i ? 'bg-white/10 text-white' : 'text-white/50 hover:bg-white/5 hover:text-white'
              }`}
            >
              <FileCode size={10} style={{ color: LANGUAGE_COLORS[f.language] || '#ccc' }} />
              {f.name}
            </button>
          ))}
        </div>

        {/* Editor */}
        <div className="flex-1 overflow-auto">
          <pre className="p-4 text-xs font-mono leading-5" dangerouslySetInnerHTML={{ __html: highlightSyntax(file.content, file.language) }} />
        </div>
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between px-3 py-1 bg-[#007acc] text-white text-[10px]">
        <div className="flex gap-3">
          <span>{file.language.toUpperCase()}</span>
          <span>UTF-8</span>
        </div>
        <span>{file.content.split('\n').length} lines</span>
      </div>
    </div>
  );
}
