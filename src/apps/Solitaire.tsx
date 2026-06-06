import { useState, useEffect } from 'react';
import { Layers, RotateCcw } from 'lucide-react';

interface Card {
  suit: string;
  rank: string;
  color: 'red' | 'black';
  faceUp: boolean;
}

const SUITS = ['♠', '♥', '♦', '♣'];
const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

function createDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({ suit, rank, color: (suit === '♥' || suit === '♦') ? 'red' : 'black', faceUp: false });
    }
  }
  // Shuffle
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

export default function Solitaire() {
  const [tableau, setTableau] = useState<Card[][]>([]);
  const [stock, setStock] = useState<Card[]>([]);
  const [waste, setWaste] = useState<Card[]>([]);
  const [foundations, setFoundations] = useState<Card[][]>([[], [], [], []]);
  const [selected, setSelected] = useState<{ pile: string; index: number; col?: number } | null>(null);

  useEffect(() => { newGame(); }, []);

  const newGame = () => {
    const deck = createDeck();
    const tab: Card[][] = [];
    let idx = 0;
    for (let i = 0; i < 7; i++) {
      tab.push([]);
      for (let j = 0; j <= i; j++) {
        tab[i].push({ ...deck[idx++], faceUp: j === i });
      }
    }
    setTableau(tab);
    setStock(deck.slice(idx));
    setWaste([]);
    setFoundations([[], [], [], []]);
    setSelected(null);
  };

  const drawStock = () => {
    if (stock.length === 0) {
      setStock(waste.reverse().map(c => ({ ...c, faceUp: false })));
      setWaste([]);
      return;
    }
    const card = stock[stock.length - 1];
    setWaste(prev => [...prev, { ...card, faceUp: true }]);
    setStock(prev => prev.slice(0, -1));
  };

  const canPlaceOnTableau = (target: Card | undefined, moving: Card) => {
    if (!target) return moving.rank === 'K';
    const rankOrder = RANKS.indexOf(target.rank);
    return rankOrder > 0 && RANKS[rankOrder - 1] === moving.rank && moving.color !== target.color;
  };

  const canPlaceOnFoundation = (foundation: Card[], card: Card) => {
    if (foundation.length === 0) return card.rank === 'A';
    const top = foundation[foundation.length - 1];
    const rankOrder = RANKS.indexOf(top.rank);
    return RANKS[rankOrder + 1] === card.rank && top.suit === card.suit;
  };

  const handleTableauClick = (col: number, row: number) => {
    const pile = tableau[col];
    const card = pile[row];
    if (!card || !card.faceUp) return;

    if (selected && selected.pile === 'tableau' && selected.col === col) {
      setSelected(null);
      return;
    }

    // Check if can move to foundation
    if (row === pile.length - 1) {
      for (let f = 0; f < 4; f++) {
        if (canPlaceOnFoundation(foundations[f], card)) {
          const newFoundations = [...foundations];
          newFoundations[f] = [...newFoundations[f], card];
          setFoundations(newFoundations);
          const newTableau = tableau.map((c, i) => i === col ? c.slice(0, -1).map((card, j) => j === c.length - 2 ? { ...card, faceUp: true } : card) : c);
          setTableau(newTableau);
          setSelected(null);
          return;
        }
      }
    }

    if (selected) {
      // Move card
      if (selected.pile === 'waste') {
        const movingCard = waste[waste.length - 1];
        if (canPlaceOnTableau(card, movingCard)) {
          const newTableau = [...tableau];
          newTableau[col] = [...newTableau[col], { ...movingCard, faceUp: true }];
          setTableau(newTableau);
          setWaste(prev => prev.slice(0, -1));
        }
      } else if (selected.pile === 'tableau' && selected.col !== undefined) {
        const movingCards = tableau[selected.col].slice(selected.index);
        if (movingCards.length === 1 && canPlaceOnTableau(card, movingCards[0])) {
          const newTableau = tableau.map((c, i) => {
            if (i === col) return [...c, ...movingCards.map(mc => ({ ...mc, faceUp: true }))];
            if (i === selected.col) return c.slice(0, selected.index).map((card, j) => j === c.slice(0, selected.index).length - 1 ? { ...card, faceUp: true } : card);
            return c;
          });
          setTableau(newTableau);
        }
      }
      setSelected(null);
    } else {
      setSelected({ pile: 'tableau', index: row, col });
    }
  };

  const handleWasteClick = () => {
    if (waste.length === 0) return;
    const card = waste[waste.length - 1];

    // Try foundation first
    for (let f = 0; f < 4; f++) {
      if (canPlaceOnFoundation(foundations[f], card)) {
        const newFoundations = [...foundations];
        newFoundations[f] = [...newFoundations[f], card];
        setFoundations(newFoundations);
        setWaste(prev => prev.slice(0, -1));
        return;
      }
    }

    setSelected({ pile: 'waste', index: waste.length - 1 });
  };

  const score = foundations.reduce((s, f) => s + f.length, 0);

  return (
    <div className="flex flex-col h-full bg-[#0f5132] select-none">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#0a3d25]">
        <div className="flex items-center gap-2">
          <Layers size={14} className="text-white/60" />
          <span className="text-white/60 text-xs">Score: {score}</span>
        </div>
        <button onClick={newGame} className="text-white/40 hover:text-white"><RotateCcw size={14} /></button>
      </div>

      <div className="flex gap-2 p-3">
        {/* Stock */}
        <button onClick={drawStock} className="w-12 h-16 bg-[#1a5c3a] rounded border border-[#2a7c4a] flex items-center justify-center hover:bg-[#1f6b44]">
          {stock.length > 0 && <span className="text-[#4ecdc4] text-lg">🂠</span>}
        </button>
        {/* Waste */}
        <button onClick={handleWasteClick} className={`w-12 h-16 bg-white rounded border-2 flex items-center justify-center ${selected?.pile === 'waste' ? 'border-[#ff9800]' : 'border-[#ccc]'}`}>
          {waste.length > 0 && (
            <span className={waste[waste.length - 1].color === 'red' ? 'text-red-600' : 'text-black'}>
              {waste[waste.length - 1].rank}{waste[waste.length - 1].suit}
            </span>
          )}
        </button>

        <div className="flex-1" />

        {/* Foundations */}
        {foundations.map((foundation, i) => (
          <div key={i} className="w-12 h-16 bg-[#1a5c3a]/50 rounded border border-[#2a7c4a]/50 flex items-center justify-center">
            {foundation.length > 0 ? (
              <span className={foundation[foundation.length - 1].color === 'red' ? 'text-red-300 text-lg' : 'text-white text-lg'}>
                {foundation[foundation.length - 1].rank}{foundation[foundation.length - 1].suit}
              </span>
            ) : (
              <span className="text-[#2a7c4a] text-lg">{SUITS[i]}</span>
            )}
          </div>
        ))}
      </div>

      {/* Tableau */}
      <div className="flex-1 flex gap-1 px-3 pb-3 overflow-auto">
        {tableau.map((pile, col) => (
          <div key={col} className="flex-1 flex flex-col items-center relative">
            {pile.map((card, row) => (
              <button
                key={row}
                onClick={() => handleTableauClick(col, row)}
                className={`w-12 h-8 rounded border flex items-center justify-center text-[10px] font-medium absolute ${
                  card.faceUp
                    ? `bg-white ${card.color === 'red' ? 'text-red-600' : 'text-black'} ${selected?.pile === 'tableau' && selected.col === col && selected.index === row ? 'border-[#ff9800] ring-1 ring-[#ff9800]' : 'border-[#ccc]'}`
                    : 'bg-[#1a5c3a] border-[#2a7c4a]'
                }`}
                style={{ top: `${row * 14}px` }}
              >
                {card.faceUp ? `${card.rank}${card.suit}` : ''}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
