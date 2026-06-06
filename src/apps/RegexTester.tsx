import { useState, useMemo } from 'react';
import { Check, X } from 'lucide-react';

const PRESETS = [
  { name: 'Email', pattern: '^[\\w.-]+@[\\w.-]+\\.\\w+$' },
  { name: 'URL', pattern: 'https?://(www\\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)' },
  { name: 'Phone', pattern: '^\\+?[1-9]\\d{1,14}$' },
  { name: 'IPv4', pattern: '^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$' },
  { name: 'Hex Color', pattern: '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$' },
];

export default function RegexTester() {
  const [pattern, setPattern] = useState('^[\\w.-]+@[\\w.-]+\\.\\w+$');
  const [flags, setFlags] = useState('g');
  const [testString, setTestString] = useState('test@example.com\ninvalid-email\nuser@domain.org\nhello@world.com');
  const [replaceWith, setReplaceWith] = useState('[REDACTED]');
  const [showReplace, setShowReplace] = useState(false);

  const result = useMemo(() => {
    try {
      const regex = new RegExp(pattern, flags);
      const matches = testString.match(regex);
      const replaced = showReplace ? testString.replace(regex, replaceWith) : null;
      return { valid: true, matches: matches || [], replaced, error: '' };
    } catch (e: any) {
      return { valid: false, matches: [], replaced: null, error: e.message };
    }
  }, [pattern, flags, testString, replaceWith, showReplace]);

  const highlighted = useMemo(() => {
    if (!result.valid) return testString;
    try {
      const regex = new RegExp(`(${pattern})`, flags.includes('g') ? flags : flags + 'g');
      return testString.replace(regex, '<<MATCH>>$1<</MATCH>>');
    } catch {
      return testString;
    }
  }, [pattern, flags, testString, result.valid]);

  const renderHighlighted = (text: string) => {
    const parts = text.split(/<<MATCH>>|<\/MATCH>>/);
    let inMatch = false;
    return parts.map((part, i) => {
      if (part === '') { inMatch = !inMatch; return null; }
      const el = <span key={i} className={inMatch ? 'bg-[#4a9eff]/30 text-[#4a9eff] rounded px-0.5' : ''}>{part}</span>;
      inMatch = !inMatch;
      return el;
    });
  };

  return (
    <div className="flex flex-col h-full bg-[#2d2d2d] p-4">
      {/* Pattern input */}
      <div className="mb-3">
        <label className="text-white/40 text-xs mb-1 block">Regular Expression</label>
        <div className="flex gap-2">
          <span className="text-[#ff9800] text-lg">/</span>
          <input
            type="text"
            value={pattern}
            onChange={e => setPattern(e.target.value)}
            className="flex-1 bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-mono outline-none focus:border-[#4a9eff]/50"
          />
          <input
            type="text"
            value={flags}
            onChange={e => setFlags(e.target.value)}
            className="w-12 bg-white/10 border border-white/10 rounded-lg px-2 py-2 text-white text-sm font-mono outline-none text-center"
          />
          <span className="text-[#ff9800] text-lg">/</span>
        </div>
        <div className="flex gap-1 mt-2 flex-wrap">
          {PRESETS.map(p => (
            <button key={p.name} onClick={() => setPattern(p.pattern)} className="px-2 py-0.5 bg-white/5 rounded text-white/40 text-[10px] hover:bg-white/10 hover:text-white">{p.name}</button>
          ))}
        </div>
      </div>

      {/* Test string */}
      <div className="mb-3 flex-1">
        <div className="flex items-center justify-between mb-1">
          <label className="text-white/40 text-xs">Test String</label>
          <button onClick={() => setShowReplace(!showReplace)} className="text-[#4a9eff] text-[10px]">{showReplace ? 'Hide Replace' : 'Show Replace'}</button>
        </div>
        <textarea
          value={testString}
          onChange={e => setTestString(e.target.value)}
          className="w-full h-24 bg-[#1e1e1e] border border-[#333] rounded-lg px-3 py-2 text-white text-xs font-mono outline-none resize-none"
        />

        {showReplace && (
          <div className="mt-2">
            <label className="text-white/40 text-xs mb-1 block">Replace With</label>
            <input
              type="text"
              value={replaceWith}
              onChange={e => setReplaceWith(e.target.value)}
              className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-1.5 text-white text-xs font-mono outline-none mb-2"
            />
            {result.replaced && (
              <pre className="bg-[#1e1e1e] rounded-lg p-2 text-[#4ecdc4] text-xs font-mono">{result.replaced}</pre>
            )}
          </div>
        )}
      </div>

      {/* Results */}
      <div className="bg-[#252526] rounded-lg p-3">
        {result.valid ? (
          <>
            <div className="flex items-center gap-2 mb-2">
              <Check size={12} className="text-[#4caf50]" />
              <span className="text-[#4caf50] text-xs">Valid regex</span>
              <span className="text-white/30 text-xs ml-auto">{result.matches.length} match{result.matches.length !== 1 ? 'es' : ''}</span>
            </div>
            <div className="bg-[#1e1e1e] rounded p-2 text-xs font-mono text-white/60 whitespace-pre-wrap">
              {renderHighlighted(highlighted)}
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <X size={12} className="text-red-400" />
            <span className="text-red-400 text-xs">{result.error}</span>
          </div>
        )}
      </div>
    </div>
  );
}
