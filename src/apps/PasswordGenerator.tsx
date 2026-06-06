import { useState, useCallback } from 'react';
import { Key, Copy, Check, RefreshCw, Shield, ShieldAlert, ShieldCheck } from 'lucide-react';

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = useCallback(() => {
    const chars = [
      ...(uppercase ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' : ''),
      ...(lowercase ? 'abcdefghijklmnopqrstuvwxyz' : ''),
      ...(numbers ? '0123456789' : ''),
      ...(symbols ? '!@#$%^&*()_+-=[]{}|;:,.<>?' : ''),
    ].join('');
    if (!chars) return;
    let result = '';
    const arr = new Uint32Array(length);
    crypto.getRandomValues(arr);
    for (let i = 0; i < length; i++) result += chars[arr[i] % chars.length];
    setPassword(result);
  }, [length, uppercase, lowercase, numbers, symbols]);

  useState(() => { generate(); });

  const strength = () => {
    let s = 0;
    if (length >= 8) s++;
    if (length >= 12) s++;
    if (length >= 16) s++;
    if (uppercase) s++;
    if (lowercase) s++;
    if (numbers) s++;
    if (symbols) s++;
    if (s < 3) return { label: 'Weak', color: 'text-red-400', icon: ShieldAlert };
    if (s < 5) return { label: 'Medium', color: 'text-[#ff9800]', icon: Shield };
    return { label: 'Strong', color: 'text-[#4caf50]', icon: ShieldCheck };
  };

  const s = strength();
  const Icon = s.icon;

  return (
    <div className="flex flex-col h-full bg-[#2d2d2d] p-4 items-center justify-center">
      <div className="w-80">
        <div className="text-center mb-6">
          <Key size={32} className="text-[#4a9eff] mx-auto mb-2" />
          <h2 className="text-white font-medium">Password Generator</h2>
        </div>

        {/* Password display */}
        <div className="bg-[#1e1e1e] rounded-xl p-4 mb-4 flex items-center gap-2">
          <p className="flex-1 text-white font-mono text-sm break-all">{password}</p>
          <button onClick={() => { generate(); }} className="text-white/30 hover:text-white"><RefreshCw size={14} /></button>
          <button onClick={() => { navigator.clipboard.writeText(password); setCopied(true); setTimeout(() => setCopied(false), 1500); }} className="text-white/30 hover:text-[#4a9eff]">
            {copied ? <Check size={14} className="text-[#4a9eff]" /> : <Copy size={14} />}
          </button>
        </div>

        {/* Strength */}
        <div className={`flex items-center gap-2 mb-4 ${s.color}`}>
          <Icon size={14} />
          <span className="text-xs">{s.label}</span>
        </div>

        {/* Length */}
        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <span className="text-white/40 text-xs">Length</span>
            <span className="text-white text-sm">{length}</span>
          </div>
          <input type="range" min={4} max={64} value={length} onChange={e => setLength(parseInt(e.target.value))} className="w-full" />
        </div>

        {/* Options */}
        <div className="space-y-2 mb-4">
          {[
            { label: 'Uppercase (A-Z)', checked: uppercase, set: setUppercase },
            { label: 'Lowercase (a-z)', checked: lowercase, set: setLowercase },
            { label: 'Numbers (0-9)', checked: numbers, set: setNumbers },
            { label: 'Symbols (!@#$)', checked: symbols, set: setSymbols },
          ].map(opt => (
            <label key={opt.label} className="flex items-center justify-between cursor-pointer">
              <span className="text-white/60 text-sm">{opt.label}</span>
              <button
                onClick={() => opt.set(!opt.checked)}
                className={`w-10 h-6 rounded-full relative transition-colors ${opt.checked ? 'bg-[#4a9eff]' : 'bg-white/20'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${opt.checked ? 'right-1' : 'left-1'}`} />
              </button>
            </label>
          ))}
        </div>

        <button onClick={generate} className="w-full py-2.5 bg-[#4a9eff] text-white rounded-lg hover:bg-[#3d8de6] font-medium">Generate</button>
      </div>
    </div>
  );
}
