import { useState, useCallback } from 'react';
import { RotateCcw } from 'lucide-react';

type Player = 'X' | 'O' | null;

export default function TicTacToe() {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X');
  const [winner, setWinner] = useState<Player | 'draw'>(null);
  const [winLine, setWinLine] = useState<number[]>([]);
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });
  const [mode, setMode] = useState<'pvp' | 'ai'>('pvp');

  const checkWinner = useCallback((b: Player[]): { winner: Player; line: number[] } | null => {
    const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    for (const line of lines) {
      const [a, b1, c] = line;
      if (b[a] && b[a] === b[b1] && b[a] === b[c]) return { winner: b[a], line };
    }
    return null;
  }, []);

  const makeMove = useCallback((index: number) => {
    if (board[index] || winner) return;
    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const result = checkWinner(newBoard);
    if (result) {
      setWinner(result.winner);
      setWinLine(result.line);
      setScores(prev => ({ ...prev, [result.winner!]: prev[result.winner!] + 1 }));
      return;
    }
    if (newBoard.every(c => c)) {
      setWinner('draw');
      setScores(prev => ({ ...prev, draws: prev.draws + 1 }));
      return;
    }

    const nextPlayer = currentPlayer === 'X' ? 'O' : 'X';
    setCurrentPlayer(nextPlayer);

    // AI move
    if (mode === 'ai' && nextPlayer === 'O') {
      setTimeout(() => {
        const emptyCells = newBoard.map((c, i) => c === null ? i : -1).filter(i => i !== -1);
        if (emptyCells.length === 0) return;

        // Try to win
        for (const i of emptyCells) {
          const test = [...newBoard];
          test[i] = 'O';
          if (checkWinner(test)?.winner === 'O') { makeMove(i); return; }
        }
        // Block
        for (const i of emptyCells) {
          const test = [...newBoard];
          test[i] = 'X';
          if (checkWinner(test)?.winner === 'X') { makeMove(i); return; }
        }
        // Center
        if (emptyCells.includes(4)) { makeMove(4); return; }
        // Random
        makeMove(emptyCells[Math.floor(Math.random() * emptyCells.length)]);
      }, 300);
    }
  }, [board, currentPlayer, winner, checkWinner, mode]);

  const reset = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
    setWinLine([]);
  };

  return (
    <div className="flex flex-col h-full bg-[#2d2d2d] items-center justify-center">
      <div className="flex items-center gap-4 mb-4">
        <button onClick={() => { setMode('pvp'); reset(); }} className={`px-3 py-1 text-xs rounded ${mode === 'pvp' ? 'bg-[#4a9eff] text-white' : 'bg-white/10 text-white/60'}`}>PvP</button>
        <button onClick={() => { setMode('ai'); reset(); }} className={`px-3 py-1 text-xs rounded ${mode === 'ai' ? 'bg-[#4a9eff] text-white' : 'bg-white/10 text-white/60'}`}>vs AI</button>
      </div>

      <div className="flex items-center gap-6 mb-4">
        <div className="text-center"><span className="text-[#4a9eff] font-bold text-lg">{scores.X}</span><p className="text-white/40 text-[10px]">Player X</p></div>
        <div className="text-center"><span className="text-white/40 text-sm">{scores.draws}</span><p className="text-white/40 text-[10px]">Draws</p></div>
        <div className="text-center"><span className="text-[#ff6b6b] font-bold text-lg">{scores.O}</span><p className="text-white/40 text-[10px]">Player O</p></div>
      </div>

      {!winner && <p className="text-white/60 text-sm mb-3">{currentPlayer === 'X' ? "X's turn" : "O's turn"}</p>}
      {winner && winner !== 'draw' && <p className="text-[#4a9eff] text-sm mb-3">{winner} wins!</p>}
      {winner === 'draw' && <p className="text-white/40 text-sm mb-3">It's a draw!</p>}

      <div className="grid grid-cols-3 gap-1 bg-[#444] p-1 rounded-lg">
        {board.map((cell, i) => (
          <button
            key={i}
            onClick={() => makeMove(i)}
            className={`w-14 h-14 bg-[#2d2d2d] rounded flex items-center justify-center text-2xl font-bold transition-all hover:bg-[#3a3a3a] ${
              winLine.includes(i) ? 'bg-[#4a9eff]/30 ring-2 ring-[#4a9eff]' : ''
            }`}
          >
            {cell === 'X' && <span className="text-[#4a9eff]">X</span>}
            {cell === 'O' && <span className="text-[#ff6b6b]">O</span>}
          </button>
        ))}
      </div>

      <button onClick={reset} className="mt-4 px-4 py-1.5 bg-white/10 text-white text-xs rounded hover:bg-white/20 flex items-center gap-1"><RotateCcw size={12} /> New Game</button>
    </div>
  );
}
