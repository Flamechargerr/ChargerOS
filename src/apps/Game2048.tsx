import { useState, useEffect, useCallback } from 'react';
import { RotateCcw, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

const COLORS: Record<number, string> = {
  2: '#eee4da', 4: '#ede0c8', 8: '#f2b179', 16: '#f59563', 32: '#f67c5f',
  64: '#f65e3b', 128: '#edcf72', 256: '#edcc61', 512: '#edc850', 1024: '#edc53f', 2048: '#edc22e',
};

const TEXT_COLORS: Record<number, string> = {
  2: '#776e65', 4: '#776e65', 8: '#f9f6f2', 16: '#f9f6f2', 32: '#f9f6f2',
  64: '#f9f6f2', 128: '#f9f6f2', 256: '#f9f6f2', 512: '#f9f6f2', 1024: '#f9f6f2', 2048: '#f9f6f2',
};

export default function Game2048() {
  const [board, setBoard] = useState<(number | null)[]>(() => {
    const b = Array(16).fill(null);
    addRandom(b);
    addRandom(b);
    return b;
  });
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => parseInt(localStorage.getItem('chargeros_2048_best') || '0'));
  const [won, setWon] = useState(false);

  function addRandom(b: (number | null)[]) {
    const empty = b.map((v, i) => v === null ? i : -1).filter(i => i !== -1);
    if (empty.length === 0) return false;
    b[empty[Math.floor(Math.random() * empty.length)]] = Math.random() < 0.9 ? 2 : 4;
    return true;
  }

  const slide = useCallback((line: (number | null)[]): [number[], number] => {
    const filtered = line.filter(v => v !== null) as number[];
    let newScore = 0;
    for (let i = 0; i < filtered.length - 1; i++) {
      if (filtered[i] === filtered[i + 1]) {
        filtered[i] *= 2;
        newScore += filtered[i];
        filtered.splice(i + 1, 1);
        if (filtered[i] === 2048) setWon(true);
      }
    }
    while (filtered.length < 4) filtered.push(null as any);
    return [filtered, newScore];
  }, []);

  const move = useCallback((dir: 'up' | 'down' | 'left' | 'right') => {
    setBoard(prev => {
      const newBoard = [...prev];
      let moved = false;
      let addScore = 0;

      for (let i = 0; i < 4; i++) {
        let line: (number | null)[];
        if (dir === 'left') line = [newBoard[i * 4], newBoard[i * 4 + 1], newBoard[i * 4 + 2], newBoard[i * 4 + 3]];
        else if (dir === 'right') line = [newBoard[i * 4 + 3], newBoard[i * 4 + 2], newBoard[i * 4 + 1], newBoard[i * 4]];
        else if (dir === 'up') line = [newBoard[i], newBoard[i + 4], newBoard[i + 8], newBoard[i + 12]];
        else line = [newBoard[i + 12], newBoard[i + 8], newBoard[i + 4], newBoard[i]];

        const [slid, s] = slide(line);
        addScore += s;
        if (slid.some((v, j) => v !== line[j])) moved = true;

        if (dir === 'left') { for (let j = 0; j < 4; j++) newBoard[i * 4 + j] = slid[j]; }
        else if (dir === 'right') { for (let j = 0; j < 4; j++) newBoard[i * 4 + 3 - j] = slid[j]; }
        else if (dir === 'up') { for (let j = 0; j < 4; j++) newBoard[i + j * 4] = slid[j]; }
        else { for (let j = 0; j < 4; j++) newBoard[i + (3 - j) * 4] = slid[j]; }
      }

      if (moved) {
        addRandom(newBoard);
        setScore(s => {
          const ns = s + addScore;
          if (ns > best) { setBest(ns); localStorage.setItem('chargeros_2048_best', String(ns)); }
          return ns;
        });
      }
      return newBoard;
    });
  }, [slide, best]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': move('up'); break;
        case 'ArrowDown': move('down'); break;
        case 'ArrowLeft': move('left'); break;
        case 'ArrowRight': move('right'); break;
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [move]);

  const reset = () => {
    const b = Array(16).fill(null);
    addRandom(b);
    addRandom(b);
    setBoard(b);
    setScore(0);
    setWon(false);
  };

  return (
    <div className="flex flex-col h-full bg-[#faf8ef] items-center justify-center p-4">
      <div className="flex items-center justify-between w-full max-w-[300px] mb-4">
        <div>
          <h2 className="text-[#776e65] text-2xl font-bold">2048</h2>
          <p className="text-[#bbada0] text-xs">Join the numbers to get 2048!</p>
        </div>
        <div className="flex gap-2">
          <div className="bg-[#bbada0] rounded px-2 py-1 text-center">
            <p className="text-[#eee4da] text-[8px] uppercase">Score</p>
            <p className="text-white text-sm font-bold">{score}</p>
          </div>
          <div className="bg-[#bbada0] rounded px-2 py-1 text-center">
            <p className="text-[#eee4da] text-[8px] uppercase">Best</p>
            <p className="text-white text-sm font-bold">{best}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 bg-[#bbada0] p-2 rounded-lg">
        {board.map((cell, i) => (
          <div
            key={i}
            className="w-14 h-14 rounded flex items-center justify-center text-lg font-bold transition-all"
            style={{ backgroundColor: cell ? COLORS[cell] || '#3c3a32' : '#cdc1b4', color: cell ? TEXT_COLORS[cell] || '#f9f6f2' : 'transparent' }}
          >
            {cell || ''}
          </div>
        ))}
      </div>

      {/* Mobile controls */}
      <div className="mt-4 grid grid-cols-3 gap-1 w-28">
        <div />
        <button onClick={() => move('up')} className="p-2 bg-[#bbada0] rounded text-white hover:bg-[#a39488]"><ArrowUp size={14} /></button>
        <div />
        <button onClick={() => move('left')} className="p-2 bg-[#bbada0] rounded text-white hover:bg-[#a39488]"><ArrowLeft size={14} /></button>
        <button onClick={reset} className="p-2 bg-[#8f7a66] rounded text-white hover:bg-[#7d6b58]"><RotateCcw size={14} /></button>
        <button onClick={() => move('right')} className="p-2 bg-[#bbada0] rounded text-white hover:bg-[#a39488]"><ArrowRight size={14} /></button>
        <div />
        <button onClick={() => move('down')} className="p-2 bg-[#bbada0] rounded text-white hover:bg-[#a39488]"><ArrowDown size={14} /></button>
        <div />
      </div>

      {won && <p className="text-[#edc22e] font-bold mt-3">You reached 2048!</p>}
    </div>
  );
}
