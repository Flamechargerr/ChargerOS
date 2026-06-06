import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

const ASCII_FONTS: Record<string, (text: string) => string> = {
  'Standard': (text: string) => {
    const letters: Record<string, string[]> = {
      'A': ['  __ _ ', ' / _` |', '| (_| |', ' \\__,_|', '       '],
      'B': [' _     ', '| |__  ', '|  _ \ ', '| |_) |', '|____/ '],
      'C': ['  ____ ', ' / ___|', '| |    ', '| |___ ', ' \____|'],
      'D': [' ____  ', '|  _ \ ', '| | | |', '| |_| |', '|____/ '],
      'E': [' _____ ', '| ____|', '|  _|  ', '| |___ ', '|_____|'],
      'F': [' _____ ', '|  ___|', '| |_   ', '|  _|  ', '|_|    '],
      'G': ['  ____ ', ' / ___|', '| |  _ ', '| |_| |', ' \____|'],
      'H': [' _   _ ', '| | | |', '| |_| |', '|  _  |', '|_| |_|'],
      'I': [' ___ ', '|_ _|', ' | | ', ' | | ', '|___|'],
      'J': ['     _ ', '    | |', ' _  | |', '| |_| |', ' \___/ '],
      'K': [' _  __', '| |/ /', '|   < ', '| |\ \\', '|_| \_|'],
      'L': [' _     ', '| |    ', '| |    ', '| |___ ', '|_____|'],
      'M': [' __  __ ', '|  \/  |', '| |\/| |', '| |  | |', '|_|  |_|'],
      'N': [' _   _ ', '| \ | |', '|  \| |', '| |\  |', '|_| \_|'],
      'O': ['  ___  ', ' / _ \ ', '| | | |', '| |_| |', ' \___/ '],
      'P': [' ____  ', '|  _ \ ', '| |_) |', '|  __/ ', '|_|    '],
      'Q': ['  ___  ', ' / _ \ ', '| | | |', '| |_| |', ' \__\_\\'],
      'R': [' ____  ', '|  _ \ ', '| |_) |', '|  _ < ', '|_| \_|'],
      'S': [' ____  ', '/ ___| ', '\\___ \ ', ' ___) |', '|____/ '],
      'T': [' _____ ', '|_   _|', '  | |  ', '  | |  ', '  |_|  '],
      'U': [' _   _ ', '| | | |', '| | | |', '| |_| |', ' \___/ '],
      'V': ['__   __', '\\ \ / /', ' \\ V / ', '  | |  ', '  |_|  '],
      'W': ['__    __', '\\ \\  / /', ' \\ \\/ / ', '  |  |  ', '  |_/   '],
      'X': ['__  __', '\\ \\/ /', ' \\  / ', ' /  \\ ', '/_/\\_\\'],
      'Y': ['__   __', '\\ \ / /', ' \\ V / ', '  | |  ', '  |_|  '],
      'Z': [' _____', '|__  /', '  / / ', ' / /_ ', '/____|'],
    };
    const upper = text.toUpperCase();
    const lines: string[] = ['', '', '', '', ''];
    for (const char of upper) {
      const letter = letters[char] || ['     ', '     ', '     ', '     ', '     '];
      for (let i = 0; i < 5; i++) lines[i] += letter[i] + ' ';
    }
    return lines.join('\n');
  },
  'Blocks': (text: string) => {
    return text.split('').map(c => {
      const code = c.charCodeAt(0);
      return code >= 33 && code <= 126 ? String.fromCharCode(0x2588) : c;
    }).join(' ');
  },
  'Shadow': (text: string) => {
    return text + '\n' + text.split('').map(() => '█').join('');
  },
};

export default function AsciiArt() {
  const [text, setText] = useState('LINUX');
  const [font, setFont] = useState('Standard');
  const [copied, setCopied] = useState(false);

  const result = ASCII_FONTS[font]?.(text) || text;

  return (
    <div className="flex flex-col h-full bg-[#2d2d2d]">
      <div className="p-4 space-y-3 border-b border-[#333]">
        <input
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Enter text"
          className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none"
        />
        <select
          value={font}
          onChange={e => setFont(e.target.value)}
          className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none"
        >
          {Object.keys(ASCII_FONTS).map(f => <option key={f} value={f}>{f}</option>)}
        </select>
      </div>
      <div className="flex-1 overflow-auto p-4">
        <pre className="text-[#4a9eff] font-mono text-xs leading-tight whitespace-pre">{result}</pre>
      </div>
      <div className="p-3 border-t border-[#333]">
        <button
          onClick={() => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
          className="w-full py-2 bg-[#333] text-white text-sm rounded-lg hover:bg-[#444] flex items-center justify-center gap-2"
        >
          {copied ? <><Check size={14} className="text-[#4a9eff]" /> Copied</> : <><Copy size={14} /> Copy ASCII</>}
        </button>
      </div>
    </div>
  );
}
