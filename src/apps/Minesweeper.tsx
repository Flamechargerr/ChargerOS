import { useState, useCallback } from 'react';
import { Bomb, Flag } from 'lucide-react';

const DIFFICULTIES = {
  easy: { rows: 8, cols: 8, mines: 10 },
  medium: { rows: 16, cols: 16, mines: 40 },
  hard: { rows: 30, cols: 16, mines: 99 },
};

type Cell = { isMine: boolean; isRevealed: boolean; isFlagged: boolean; neighborMines: number };

function createBoard(rows: number, cols: number, mines: number, firstClick: [number, number] | null = null): Cell[][] {
  const board: Cell[][] = Array.from({ length: rows }, () => Array.from({ length: cols }, () => ({ isMine: false, isRevealed: false, isFlagged: false, neighborMines: 0 })));

  // Place mines
  let placed = 0;
  while (placed < mines) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);
    if (!board[r][c].isMine && (!firstClick || r !== firstClick[0] || c !== firstClick[1])) {
      board[r][c].isMine = true;
      placed++;
    }
  }

  // Calculate neighbor mines
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c].isMine) continue;
      let count = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr, nc = c + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && board[nr][nc].isMine) count++;
        }
      }
      board[r][c].neighborMines = count;
    }
  }

  return board;
}

export default function Minesweeper() {
  const [difficulty, setDifficulty] = useState<keyof typeof DIFFICULTIES>('easy');
  const [board, setBoard] = useState<Cell[][]>(() => createBoard(8, 8, 10));
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [flagCount, setFlagCount] = useState(0);
  const [firstClick, setFirstClick] = useState(true);

  const { rows, cols, mines } = DIFFICULTIES[difficulty];

  const newGame = useCallback(() => {
    setBoard(createBoard(rows, cols, mines));
    setGameOver(false);
    setWon(false);
    setFlagCount(0);
    setFirstClick(true);
  }, [rows, cols, mines]);

  const revealCell = (r: number, c: number) => {
    if (gameOver || won) return;
    if (board[r][c].isRevealed || board[r][c].isFlagged) return;

    let newBoard = board.map(row => row.map(cell => ({ ...cell })));

    if (firstClick) {
      newBoard = createBoard(rows, cols, mines, [r, c]);
      setFirstClick(false);
    }

    const reveal = (br: number, bc: number) => {
      if (br < 0 || br >= rows || bc < 0 || bc >= cols) return;
      const cell = newBoard[br][bc];
      if (cell.isRevealed || cell.isFlagged || cell.isMine) return;
      cell.isRevealed = true;
      if (cell.neighborMines === 0) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            reveal(br + dr, bc + dc);
          }
        }
      }
    };

    if (newBoard[r][c].isMine) {
      newBoard[r][c].isRevealed = true;
      // Reveal all mines
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          if (newBoard[i][j].isMine) newBoard[i][j].isRevealed = true;
        }
      }
      setBoard(newBoard);
      setGameOver(true);
      return;
    }

    reveal(r, c);
    setBoard(newBoard);

    // Check win
    const unrevealed = newBoard.flat().filter(c => !c.isRevealed).length;
    if (unrevealed === mines) setWon(true);
  };

  const flagCell = (e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    if (gameOver || won) return;
    if (board[r][c].isRevealed) return;
    const newBoard = board.map(row => row.map(cell => ({ ...cell })));
    if (newBoard[r][c].isFlagged) {
      newBoard[r][c].isFlagged = false;
      setFlagCount(f => f - 1);
    } else {
      newBoard[r][c].isFlagged = true;
      setFlagCount(f => f + 1);
    }
    setBoard(newBoard);
  };

  const numberColors = ['', 'text-[#4a9eff]', 'text-[#4caf50]', 'text-[#f44336]', 'text-[#9c27b0]', 'text-[#ff9800]', 'text-[#00bcd4]', 'text-black', 'text-[#666]'];

  return (
    <div className="flex flex-col h-full bg-[#c0c0c0] items-center justify-center">
      {/* Status bar */}
      <div className="flex items-center justify-between w-full max-w-[320px] px-2 py-1 bg-[#c0c0c0] border-2 border-t-white border-l-white border-r-[#808080] border-b-[#808080] mb-2">
        <div className="flex gap-1">
          {(Object.keys(DIFFICULTIES) as Array<keyof typeof DIFFICULTIES>).map(d => (
            <button key={d} onClick={() => { setDifficulty(d); newGame(); }} className={`px-2 py-0.5 text-[10px] capitalize border ${difficulty === d ? 'bg-[#e0e0e0] border-[#808080] border-t-[#404040] border-l-[#404040] border-r-white border-b-white' : 'border-t-white border-l-white border-r-[#808080] border-b-[#808080]'}`}>{d}</button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold font-mono">{mines - flagCount}</span>
          <button onClick={newGame} className="text-lg">{gameOver ? '😵' : won ? '😎' : '🙂'}</button>
        </div>
      </div>

      {/* Board */}
      <div className="grid gap-0 border-4 border-t-[#808080] border-l-[#808080] border-r-white border-b-white" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {board.map((row, r) => row.map((cell, c) => (
          <button
            key={`${r}-${c}`}
            onClick={() => revealCell(r, c)}
            onContextMenu={(e) => flagCell(e, r, c)}
            className={`w-6 h-6 flex items-center justify-center text-xs font-bold ${
              cell.isRevealed
                ? cell.isMine ? 'bg-red-500 text-black' : 'bg-[#c0c0c0] border border-[#b0b0b0]'
                : 'bg-[#c0c0c0] border-2 border-t-white border-l-white border-r-[#808080] border-b-[#808080]'
            }`}
          >
            {cell.isFlagged && !cell.isRevealed && <Flag size={12} className="text-red-600" />}
            {cell.isRevealed && cell.isMine && <Bomb size={12} />}
            {cell.isRevealed && !cell.isMine && cell.neighborMines > 0 && (
              <span className={numberColors[cell.neighborMines]}>{cell.neighborMines}</span>
            )}
          </button>
        )))}
      </div>

      {won && <p className="text-green-700 font-bold mt-2 text-sm">You Win!</p>}
      {gameOver && <p className="text-red-700 font-bold mt-2 text-sm">Game Over!</p>}
    </div>
  );
}
