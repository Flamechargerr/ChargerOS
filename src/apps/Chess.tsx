import { useState, useCallback } from 'react';
import { Crown } from 'lucide-react';

type Piece = string | null;
const INITIAL_BOARD: Piece[][] = [
  ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
  ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
  ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
];

const PIECE_SYMBOLS: Record<string, string> = {
  'k': '♚', 'q': '♛', 'r': '♜', 'b': '♝', 'n': '♞', 'p': '♟',
  'K': '♔', 'Q': '♕', 'R': '♖', 'B': '♗', 'N': '♘', 'P': '♙',
};

export default function Chess() {
  const [board, setBoard] = useState<Piece[][]>(INITIAL_BOARD.map(r => [...r]));
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [turn, setTurn] = useState<'white' | 'black'>('white');
  const [moves, setMoves] = useState<string[]>([]);
  const [captured, setCaptured] = useState<{ white: string[]; black: string[] }>({ white: [], black: [] });

  const isWhite = (p: Piece) => p && p === p.toUpperCase();
  const isBlack = (p: Piece) => p && p === p.toLowerCase();

  const getValidMoves = useCallback((r: number, c: number, b: Piece[][]): [number, number][] => {
    const piece = b[r][c];
    if (!piece) return [];
    const moves: [number, number][] = [];
    const white = isWhite(piece);
    const p = piece.toLowerCase();

    if (p === 'p') {
      const dir = white ? -1 : 1;
      const startRow = white ? 6 : 1;
      // Forward
      if (r + dir >= 0 && r + dir < 8 && !b[r + dir][c]) {
        moves.push([r + dir, c]);
        if (r === startRow && !b[r + dir * 2][c]) moves.push([r + dir * 2, c]);
      }
      // Capture
      for (const dc of [-1, 1]) {
        const nr = r + dir, nc = c + dc;
        if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
          const target = b[nr][nc];
          if (target && (white ? isBlack(target) : isWhite(target))) moves.push([nr, nc]);
        }
      }
    } else if (p === 'n') {
      for (const [dr, dc] of [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]) {
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
          const target = b[nr][nc];
          if (!target || (white ? isBlack(target) : isWhite(target))) moves.push([nr, nc]);
        }
      }
    } else if (p === 'r' || p === 'q' || p === 'b') {
      const dirs: [number, number][] = p === 'r' ? [[-1,0],[1,0],[0,-1],[0,1]] :
        p === 'b' ? [[-1,-1],[-1,1],[1,-1],[1,1]] :
        [[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[-1,1],[1,-1],[1,1]];
      for (const [dr, dc] of dirs) {
        for (let d = 1; d < 8; d++) {
          const nr = r + dr * d, nc = c + dc * d;
          if (nr < 0 || nr >= 8 || nc < 0 || nc >= 8) break;
          const target = b[nr][nc];
          if (!target) { moves.push([nr, nc]); }
          else if (white ? isBlack(target) : isWhite(target)) { moves.push([nr, nc]); break; }
          else break;
        }
      }
    } else if (p === 'k') {
      for (const [dr, dc] of [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]]) {
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
          const target = b[nr][nc];
          if (!target || (white ? isBlack(target) : isWhite(target))) moves.push([nr, nc]);
        }
      }
    }

    return moves;
  }, []);

  const handleClick = (r: number, c: number) => {
    const piece = board[r][c];

    if (selected) {
      const [sr, sc] = selected;
      const validMoves = getValidMoves(sr, sc, board);
      if (validMoves.some(([vr, vc]) => vr === r && vc === c)) {
        const newBoard = board.map(row => [...row]);
        const target = newBoard[r][c];
        if (target) {
          setCaptured(prev => ({
            ...prev,
            [turn === 'white' ? 'white' : 'black']: [...prev[turn === 'white' ? 'white' : 'black'], target],
          }));
        }
        newBoard[r][c] = newBoard[sr][sc];
        newBoard[sr][sc] = null;

        // Pawn promotion
        const movedPiece = newBoard[r][c];
        if (movedPiece?.toLowerCase() === 'p' && (r === 0 || r === 7)) {
          newBoard[r][c] = isWhite(movedPiece) ? 'Q' : 'q';
        }

        setBoard(newBoard);
        const moveNotation = `${PIECE_SYMBOLS[movedPiece || ''] || ''}${String.fromCharCode(97 + c)}${8 - r}`;
        setMoves(prev => [...prev, moveNotation]);
        setTurn(t => t === 'white' ? 'black' : 'white');
      }
      setSelected(null);
    } else if (piece && ((turn === 'white' && isWhite(piece)) || (turn === 'black' && isBlack(piece)))) {
      setSelected([r, c]);
    }
  };

  const validMoves = selected ? getValidMoves(selected[0], selected[1], board) : [];

  return (
    <div className="flex flex-col h-full bg-[#2d2d2d]">
      <div className="flex items-center justify-between px-4 py-2 bg-[#252526] border-b border-[#333]">
        <div className="flex items-center gap-2">
          <Crown size={14} className={turn === 'white' ? 'text-white' : 'text-[#666]'} />
          <span className="text-white/40 text-xs">{turn === 'white' ? "White's turn" : "Black's turn"}</span>
        </div>
        <button onClick={() => { setBoard(INITIAL_BOARD.map(r => [...r])); setTurn('white'); setMoves([]); setCaptured({ white: [], black: [] }); setSelected(null); }} className="text-white/40 text-xs hover:text-white">New Game</button>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="grid grid-cols-8 border-2 border-[#555]">
          {board.map((row, r) => row.map((piece, c) => {
            const isLight = (r + c) % 2 === 0;
            const isSelected = selected?.[0] === r && selected?.[1] === c;
            const isValidMove = validMoves.some(([vr, vc]) => vr === r && vc === c);

            return (
              <button
                key={`${r}-${c}`}
                onClick={() => handleClick(r, c)}
                className={`w-10 h-10 flex items-center justify-center text-xl relative transition-all ${
                  isLight ? 'bg-[#f0d9b5]' : 'bg-[#b58863]'
                } ${isSelected ? 'ring-2 ring-[#4a9eff] ring-inset z-10' : ''}`}
              >
                {piece && (
                  <span className={isWhite(piece) ? 'text-white drop-shadow' : 'text-black drop-shadow'}>
                    {PIECE_SYMBOLS[piece]}
                  </span>
                )}
                {isValidMove && (
                  <div className={`absolute inset-0 flex items-center justify-center ${piece ? '' : ''}`}>
                    <div className={`rounded-full ${piece ? 'w-full h-full bg-[#4a9eff]/30' : 'w-3 h-3 bg-[#4a9eff]/50'}`} />
                  </div>
                )}
              </button>
            );
          }))}
        </div>
      </div>

      {/* Captured pieces & move history */}
      <div className="px-4 py-2 bg-[#252526] border-t border-[#333] flex justify-between">
        <div className="text-xs text-white/30">
          Captured: {captured.white.map(p => PIECE_SYMBOLS[p]).join(' ')}
        </div>
        <div className="text-xs text-white/30 max-w-[150px] truncate">
          {moves.slice(-8).join(', ')}
        </div>
      </div>
    </div>
  );
}
