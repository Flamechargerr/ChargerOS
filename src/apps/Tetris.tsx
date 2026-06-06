import { useState, useEffect, useCallback, useRef } from 'react';
import { Play, RotateCcw, Pause } from 'lucide-react';

const BOARD_W = 10;
const BOARD_H = 20;

const SHAPES = [
  { shape: [[1,1,1,1]], color: '#00f0f0' }, // I
  { shape: [[1,1],[1,1]], color: '#f0f000' }, // O
  { shape: [[0,1,0],[1,1,1]], color: '#a000f0' }, // T
  { shape: [[0,1,1],[1,1,0]], color: '#00f000' }, // S
  { shape: [[1,1,0],[0,1,1]], color: '#f00000' }, // Z
  { shape: [[1,0,0],[1,1,1]], color: '#0000f0' }, // J
  { shape: [[0,0,1],[1,1,1]], color: '#f0a000' }, // L
];

function randomPiece() {
  const def = SHAPES[Math.floor(Math.random() * SHAPES.length)];
  return { shape: def.shape.map(r => [...r]), color: def.color, x: 3, y: 0 };
}

export default function Tetris() {
  const [board, setBoard] = useState<string[][]>(() => Array.from({ length: BOARD_H }, () => Array(BOARD_W).fill('')));
  const [piece, setPiece] = useState(randomPiece);
  const [running, setRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(1);
  const [paused, setPaused] = useState(false);
  const [highScore, setHighScore] = useState(() => parseInt(localStorage.getItem('chargeros_tetris_high') || '0'));
  const pieceRef = useRef(piece);

  useEffect(() => { pieceRef.current = piece; }, [piece]);

  const isValid = useCallback((shape: number[][], x: number, y: number, currentBoard: string[][]): boolean => {
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (shape[r][c]) {
          const nr = y + r, nc = x + c;
          if (nr < 0 || nr >= BOARD_H || nc < 0 || nc >= BOARD_W) return false;
          if (currentBoard[nr][nc]) return false;
        }
      }
    }
    return true;
  }, []);

  const lockPiece = useCallback(() => {
    const p = pieceRef.current;
    setBoard(currentBoard => {
      const newBoard = currentBoard.map(r => [...r]);
      p.shape.forEach((row, r) => {
        row.forEach((cell, c) => {
          if (cell) newBoard[p.y + r][p.x + c] = p.color;
        });
      });

      // Clear lines
      let cleared = 0;
      for (let r = BOARD_H - 1; r >= 0; r--) {
        if (newBoard[r].every(c => c !== '')) {
          newBoard.splice(r, 1);
          newBoard.unshift(Array(BOARD_W).fill(''));
          cleared++;
          r++;
        }
      }

      if (cleared > 0) {
        const points = [0, 100, 300, 500, 800][cleared] * level;
        setScore(s => {
          const ns = s + points;
          if (ns > highScore) {
            setHighScore(ns);
            localStorage.setItem('chargeros_tetris_high', String(ns));
          }
          return ns;
        });
        setLines(l => { const nl = l + cleared; setLevel(Math.floor(nl / 10) + 1); return nl; });
      }

      const newPiece = randomPiece();
      if (!isValid(newPiece.shape, newPiece.x, newPiece.y, newBoard)) {
        setGameOver(true);
        setRunning(false);
      }
      setPiece(newPiece);
      return newBoard;
    });
  }, [isValid, level, highScore]);

  const move = useCallback((dx: number, dy: number) => {
    const p = pieceRef.current;
    if (isValid(p.shape, p.x + dx, p.y + dy, board)) {
      setPiece(prev => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
      return true;
    }
    return false;
  }, [isValid, board]);

  const rotate = useCallback(() => {
    const p = pieceRef.current;
    const rows = p.shape.length;
    const cols = p.shape[0].length;
    const rotated = Array.from({ length: cols }, (_, c) => Array.from({ length: rows }, (_, r) => p.shape[rows - 1 - r][c]));
    if (isValid(rotated, p.x, p.y, board)) {
      setPiece(prev => ({ ...prev, shape: rotated }));
    }
  }, [isValid, board]);

  const hardDrop = useCallback(() => {
    let dropY = 0;
    const p = pieceRef.current;
    while (isValid(p.shape, p.x, p.y + dropY + 1, board)) dropY++;
    setPiece(prev => ({ ...prev, y: prev.y + dropY }));
    setTimeout(lockPiece, 50);
  }, [isValid, board, lockPiece]);

  useEffect(() => {
    if (!running || gameOver || paused) return;
    const speed = Math.max(100, 800 - (level - 1) * 70);
    const interval = setInterval(() => {
      if (!move(0, 1)) lockPiece();
    }, speed);
    return () => clearInterval(interval);
  }, [running, gameOver, paused, level, move, lockPiece]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!running || gameOver) return;
      switch (e.key) {
        case 'ArrowLeft': move(-1, 0); break;
        case 'ArrowRight': move(1, 0); break;
        case 'ArrowDown': move(0, 1); break;
        case 'ArrowUp': rotate(); break;
        case ' ': hardDrop(); break;
        case 'p': case 'P': setPaused(p => !p); break;
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [running, gameOver, move, rotate, hardDrop]);

  const reset = () => {
    setBoard(Array.from({ length: BOARD_H }, () => Array(BOARD_W).fill('')));
    setPiece(randomPiece);
    setRunning(true);
    setGameOver(false);
    setScore(0);
    setLines(0);
    setLevel(1);
    setPaused(false);
  };

  // Render board with piece
  const displayBoard = board.map(r => [...r]);
  if (running && !gameOver) {
    piece.shape.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (cell && piece.y + r >= 0 && piece.y + r < BOARD_H && piece.x + c >= 0 && piece.x + c < BOARD_W) {
          displayBoard[piece.y + r][piece.x + c] = piece.color;
        }
      });
    });
  }

  return (
    <div className="flex flex-col h-full bg-[#1a1a1a] items-center justify-center">
      <div className="flex items-center gap-6 mb-2">
        <div>
          <p className="text-white/40 text-[10px]">SCORE</p>
          <p className="text-white text-sm font-bold tabular-nums">{score}</p>
        </div>
        <div>
          <p className="text-white/40 text-[10px]">LEVEL</p>
          <p className="text-white text-sm font-bold tabular-nums">{level}</p>
        </div>
        <div>
          <p className="text-white/40 text-[10px]">LINES</p>
          <p className="text-white text-sm font-bold tabular-nums">{lines}</p>
        </div>
        <div>
          <p className="text-white/40 text-[10px]">BEST</p>
          <p className="text-[#ff9800] text-sm font-bold tabular-nums">{highScore}</p>
        </div>
      </div>

      <div className="grid gap-px bg-[#333]" style={{ gridTemplateColumns: `repeat(${BOARD_W}, 16px)` }}>
        {displayBoard.flat().map((cell, i) => (
          <div key={i} className="w-4 h-4" style={{ backgroundColor: cell || '#1e1e1e' }} />
        ))}
      </div>

      <div className="flex gap-2 mt-3">
        <button onClick={() => running ? setPaused(!paused) : reset()} className="px-4 py-1.5 bg-[#4a9eff] text-white text-xs rounded flex items-center gap-1">
          {paused ? <Play size={10} /> : running ? <Pause size={10} /> : <Play size={10} />} {paused ? 'Resume' : running ? 'Pause' : 'Play'}
        </button>
        <button onClick={reset} className="px-4 py-1.5 bg-[#333] text-white text-xs rounded flex items-center gap-1"><RotateCcw size={10} /> Restart</button>
      </div>

      {gameOver && <p className="text-red-400 text-sm mt-2">Game Over! Score: {score}</p>}
    </div>
  );
}
