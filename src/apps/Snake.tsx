import { useState, useEffect, useCallback, useRef } from 'react';
import { Zap, Play, RotateCcw } from 'lucide-react';

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const GRID_SIZE = 20;
const INITIAL_SPEED = 150;

export default function Snake() {
  const [snake, setSnake] = useState<[number, number][]>([[10, 10], [10, 11], [10, 12]]);
  const [food, setFood] = useState<[number, number]>([5, 5]);
  const [direction, setDirection] = useState<Direction>('UP');
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [running, setRunning] = useState(false);
  const [highScore, setHighScore] = useState(() => parseInt(localStorage.getItem('chargeros_snake_high') || '0'));
  const directionRef = useRef<Direction>('UP');

  useEffect(() => { directionRef.current = direction; }, [direction]);

  const placeFood = useCallback((currentSnake: [number, number][]) => {
    let newFood: [number, number];
    do {
      newFood = [Math.floor(Math.random() * GRID_SIZE), Math.floor(Math.random() * GRID_SIZE)];
    } while (currentSnake.some(([r, c]) => r === newFood[0] && c === newFood[1]));
    setFood(newFood);
  }, []);

  const reset = () => {
    const initial: [number, number][] = [[10, 10], [10, 11], [10, 12]];
    setSnake(initial);
    setDirection('UP');
    directionRef.current = 'UP';
    setGameOver(false);
    setScore(0);
    setRunning(true);
    placeFood(initial);
  };

  useEffect(() => {
    if (!running || gameOver) return;
    const speed = Math.max(50, INITIAL_SPEED - score * 2);
    const interval = setInterval(() => {
      setSnake(currentSnake => {
        const head = currentSnake[0];
        const dir = directionRef.current;
        let newHead: [number, number];
        switch (dir) {
          case 'UP': newHead = [head[0] - 1, head[1]]; break;
          case 'DOWN': newHead = [head[0] + 1, head[1]]; break;
          case 'LEFT': newHead = [head[0], head[1] - 1]; break;
          case 'RIGHT': newHead = [head[0], head[1] + 1]; break;
        }

        // Wall collision
        if (newHead[0] < 0 || newHead[0] >= GRID_SIZE || newHead[1] < 0 || newHead[1] >= GRID_SIZE) {
          setGameOver(true);
          setRunning(false);
          return currentSnake;
        }

        // Self collision
        if (currentSnake.some(([r, c]) => r === newHead[0] && c === newHead[1])) {
          setGameOver(true);
          setRunning(false);
          return currentSnake;
        }

        const newSnake = [newHead, ...currentSnake];

        // Food
        if (newHead[0] === food[0] && newHead[1] === food[1]) {
          setScore(s => {
            const newScore = s + 10;
            if (newScore > highScore) {
              setHighScore(newScore);
              localStorage.setItem('chargeros_snake_high', String(newScore));
            }
            return newScore;
          });
          placeFood(newSnake);
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, speed);
    return () => clearInterval(interval);
  }, [running, gameOver, food, score, highScore, placeFood]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!running) return;
      switch (e.key) {
        case 'ArrowUp': if (directionRef.current !== 'DOWN') setDirection('UP'); break;
        case 'ArrowDown': if (directionRef.current !== 'UP') setDirection('DOWN'); break;
        case 'ArrowLeft': if (directionRef.current !== 'RIGHT') setDirection('LEFT'); break;
        case 'ArrowRight': if (directionRef.current !== 'LEFT') setDirection('RIGHT'); break;
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [running]);

  return (
    <div className="flex flex-col h-full bg-[#1a1a1a] items-center justify-center" tabIndex={0}>
      <div className="flex items-center justify-between w-full max-w-[400px] px-4 mb-2">
        <div className="flex items-center gap-2">
          <Zap size={16} className="text-[#4a9eff]" />
          <span className="text-white text-sm font-medium">{score}</span>
        </div>
        <span className="text-white/40 text-xs">Best: {highScore}</span>
        <button onClick={reset} className="text-white/60 hover:text-white"><RotateCcw size={14} /></button>
      </div>

      <div className="grid gap-px bg-[#333]" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 16px)` }}>
        {Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => {
          const r = Math.floor(i / GRID_SIZE);
          const c = i % GRID_SIZE;
          const isSnake = snake.some(([sr, sc]) => sr === r && sc === c);
          const isHead = snake[0][0] === r && snake[0][1] === c;
          const isFood = food[0] === r && food[1] === c;

          return (
            <div
              key={i}
              className={`w-4 h-4 ${
                isHead ? 'bg-[#4a9eff] rounded-sm' :
                isSnake ? 'bg-[#4a9eff]/70' :
                isFood ? 'bg-[#ff9800] rounded-full' :
                'bg-[#1e1e1e]'
              }`}
            />
          );
        })}
      </div>

      {/* Mobile controls */}
      <div className="mt-4 grid grid-cols-3 gap-1 w-28">
        <div />
        <button onClick={() => running && directionRef.current !== 'DOWN' && setDirection('UP')} className="p-2 bg-white/10 rounded text-white/60 hover:bg-white/20">▲</button>
        <div />
        <button onClick={() => running && directionRef.current !== 'RIGHT' && setDirection('LEFT')} className="p-2 bg-white/10 rounded text-white/60 hover:bg-white/20">◀</button>
        <button onClick={reset} className="p-2 bg-[#4a9eff] rounded text-white hover:bg-[#3d8de6]"><Play size={12} /></button>
        <button onClick={() => running && directionRef.current !== 'LEFT' && setDirection('RIGHT')} className="p-2 bg-white/10 rounded text-white/60 hover:bg-white/20">▶</button>
        <div />
        <button onClick={() => running && directionRef.current !== 'UP' && setDirection('DOWN')} className="p-2 bg-white/10 rounded text-white/60 hover:bg-white/20">▼</button>
        <div />
      </div>

      {gameOver && <p className="text-red-400 text-sm mt-2">Game Over! Score: {score}</p>}
      {!running && !gameOver && <p className="text-white/40 text-xs mt-2">Press Play or arrow keys to start</p>}
    </div>
  );
}
