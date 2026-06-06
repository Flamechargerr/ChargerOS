import { useState, useCallback } from 'react';

const COLS = 10;
const ROWS = 30;

export default function Spreadsheet() {
  const [cells, setCells] = useState<Record<string, string>>({});
  const [selectedCell, setSelectedCell] = useState<string | null>(null);
  const [formulaBar, setFormulaBar] = useState('');

  const getCellId = (col: number, row: number) => `${String.fromCharCode(65 + col)}${row + 1}`;
  const getCellValue = useCallback((cellId: string): number => {
    const raw = cells[cellId] || '';
    if (raw.startsWith('=')) {
      try {
        const formula = raw.slice(1);
        if (formula.match(/^[A-Z]\d+$/)) {
          const val = parseFloat(cells[formula] || '0');
          return isNaN(val) ? 0 : val;
        }
        // Simple arithmetic
        const clean = formula.replace(/([A-Z]\d+)/g, (match) => {
          const v = parseFloat(cells[match] || '0');
          return isNaN(v) ? '0' : v.toString();
        });
        // eslint-disable-next-line no-eval
        const result = eval(clean);
        return typeof result === 'number' ? result : 0;
      } catch {
        return NaN;
      }
    }
    return parseFloat(raw) || 0;
  }, [cells]);

  const getDisplayValue = (cellId: string): string => {
    const raw = cells[cellId] || '';
    if (raw.startsWith('=')) {
      const val = getCellValue(cellId);
      return isNaN(val) ? '#ERR' : val.toString();
    }
    return raw;
  };


  const handleCellClick = (cellId: string) => {
    setSelectedCell(cellId);
    setFormulaBar(cells[cellId] || '');
  };

  const handleFormulaBarChange = (value: string) => {
    setFormulaBar(value);
    if (selectedCell) {
      setCells(prev => ({ ...prev, [selectedCell]: value }));
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#2d2d2d]">
      {/* Formula bar */}
      <div className="flex items-center gap-2 px-3 py-2 bg-[#252526] border-b border-[#333]">
        <div className="w-20 bg-white/10 rounded px-2 py-1 text-xs text-white text-center">{selectedCell || ''}</div>
        <div className="text-white/20">=</div>
        <input
          type="text"
          value={formulaBar}
          onChange={e => handleFormulaBarChange(e.target.value)}
          className="flex-1 bg-white/10 rounded px-2 py-1 text-xs text-white outline-none"
          placeholder="Enter value or formula (=A1+B1)"
        />
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-auto">
        <div className="grid" style={{ gridTemplateColumns: `40px repeat(${COLS}, 80px)` }}>
          {/* Corner */}
          <div className="bg-[#252526] border-r border-b border-[#333]" />
          {/* Column headers */}
          {Array.from({ length: COLS }, (_, c) => (
            <div key={`h-${c}`} className="bg-[#252526] text-white/40 text-xs text-center py-1 border-r border-b border-[#333]">
              {String.fromCharCode(65 + c)}
            </div>
          ))}
          {/* Rows */}
          {Array.from({ length: ROWS }, (_, r) => (
            <>
              <div key={`r-${r}`} className="bg-[#252526] text-white/40 text-xs text-right pr-1 py-0.5 border-r border-b border-[#333]">
                {r + 1}
              </div>
              {Array.from({ length: COLS }, (_, c) => {
                const cellId = getCellId(c, r);
                return (
                  <div
                    key={cellId}
                    onClick={() => handleCellClick(cellId)}
                    className={`text-xs px-1 py-0.5 border-r border-b border-[#333] cursor-cell truncate ${
                      selectedCell === cellId ? 'ring-2 ring-[#4a9eff] ring-inset bg-[#4a9eff]/10' : 'hover:bg-white/5'
                    }`}
                  >
                    <span className="text-[#ccc]">{getDisplayValue(cellId)}</span>
                  </div>
                );
              })}
            </>
          ))}
        </div>
      </div>
    </div>
  );
}
