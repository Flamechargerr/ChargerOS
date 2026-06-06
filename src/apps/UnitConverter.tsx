import { useState } from 'react';
import { ArrowLeftRight } from 'lucide-react';

const CATEGORIES: Record<string, { label: string; units: Record<string, number> }> = {
  length: { label: 'Length', units: { 'm': 1, 'km': 1000, 'cm': 0.01, 'mm': 0.001, 'mi': 1609.34, 'yd': 0.9144, 'ft': 0.3048, 'in': 0.0254 } },
  weight: { label: 'Weight', units: { 'kg': 1, 'g': 0.001, 'mg': 0.000001, 'lb': 0.453592, 'oz': 0.0283495, 't': 1000 } },
  temperature: { label: 'Temperature', units: { 'C': 1, 'F': 1, 'K': 1 } },
  volume: { label: 'Volume', units: { 'L': 1, 'mL': 0.001, 'gal': 3.78541, 'qt': 0.946353, 'pt': 0.473176, 'cup': 0.236588, 'fl oz': 0.0295735 } },
  area: { label: 'Area', units: { 'm2': 1, 'km2': 1000000, 'ft2': 0.092903, 'ac': 4046.86, 'ha': 10000 } },
  speed: { label: 'Speed', units: { 'm/s': 1, 'km/h': 0.277778, 'mph': 0.44704, 'kn': 0.514444 } },
  time: { label: 'Time', units: { 's': 1, 'min': 60, 'h': 3600, 'd': 86400, 'wk': 604800, 'mo': 2592000, 'y': 31536000 } },
  data: { label: 'Data', units: { 'B': 1, 'KB': 1024, 'MB': 1048576, 'GB': 1073741824, 'TB': 1099511627776 } },
};

export default function UnitConverter() {
  const [category, setCategory] = useState('length');
  const [fromUnit, setFromUnit] = useState('m');
  const [toUnit, setToUnit] = useState('km');
  const [value, setValue] = useState(1);

  const cat = CATEGORIES[category];

  const convert = () => {
    if (category === 'temperature') {
      if (fromUnit === 'C' && toUnit === 'F') return value * 9 / 5 + 32;
      if (fromUnit === 'F' && toUnit === 'C') return (value - 32) * 5 / 9;
      if (fromUnit === 'C' && toUnit === 'K') return value + 273.15;
      if (fromUnit === 'K' && toUnit === 'C') return value - 273.15;
      if (fromUnit === 'F' && toUnit === 'K') return (value - 32) * 5 / 9 + 273.15;
      if (fromUnit === 'K' && toUnit === 'F') return (value - 273.15) * 9 / 5 + 32;
      return value;
    }
    const base = value * cat.units[fromUnit];
    return base / cat.units[toUnit];
  };

  const result = convert();

  return (
    <div className="flex flex-col h-full bg-[#2d2d2d] p-4">
      <div className="text-center mb-6">
        <ArrowLeftRight size={28} className="text-[#4a9eff] mx-auto mb-2" />
        <h2 className="text-white font-medium">Unit Converter</h2>
      </div>

      {/* Category */}
      <div className="grid grid-cols-4 gap-1 mb-4">
        {Object.entries(CATEGORIES).map(([key, c]) => (
          <button key={key} onClick={() => { setCategory(key); const units = Object.keys(c.units); setFromUnit(units[0]); setToUnit(units[1]); }} className={`py-1.5 text-[10px] rounded transition-colors ${category === key ? 'bg-[#4a9eff]/20 text-[#4a9eff]' : 'text-white/40 hover:bg-white/5'}`}>
            {c.label}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="bg-[#252526] rounded-xl p-4 mb-3">
        <input type="number" value={value} onChange={e => setValue(parseFloat(e.target.value) || 0)} className="w-full bg-transparent text-white text-2xl outline-none mb-2" />
        <select value={fromUnit} onChange={e => setFromUnit(e.target.value)} className="w-full bg-white/10 text-white text-sm rounded px-2 py-1 outline-none">
          {Object.keys(cat.units).map(u => <option key={u} value={u}>{u}</option>)}
        </select>
      </div>

      {/* Swap */}
      <div className="flex justify-center mb-3">
        <button onClick={() => { setFromUnit(toUnit); setToUnit(fromUnit); }} className="p-2 bg-white/5 rounded-full text-white/40 hover:text-white hover:bg-white/10"><ArrowLeftRight size={14} /></button>
      </div>

      {/* Output */}
      <div className="bg-[#252526] rounded-xl p-4 mb-4">
        <p className="text-[#4a9eff] text-2xl font-light tabular-nums">{Number.isInteger(result) ? result : result.toFixed(4)}</p>
        <select value={toUnit} onChange={e => setToUnit(e.target.value)} className="w-full bg-white/10 text-white text-sm rounded px-2 py-1 outline-none mt-2">
          {Object.keys(cat.units).map(u => <option key={u} value={u}>{u}</option>)}
        </select>
      </div>
    </div>
  );
}
