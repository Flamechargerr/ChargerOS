import { useState } from 'react';
import { Delete, History, RotateCcw } from 'lucide-react';

export default function Calculator() {
  const [display, setDisplay] = useState('0');
  const [prevValue, setPrevValue] = useState<string | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const formatNumber = (num: number): string => {
    if (isNaN(num)) return 'Error';
    if (!isFinite(num)) return 'Error';
    const str = num.toString();
    if (str.length > 12) return num.toExponential(6);
    return str;
  };

  const calculate = (left: number, op: string, right: number): number => {
    switch (op) {
      case '+': return left + right;
      case '-': return left - right;
      case '*': return left * right;
      case '/': return right === 0 ? NaN : left / right;
      case '%': return left % right;
      case '^': return Math.pow(left, right);
      default: return right;
    }
  };

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const performOperation = (nextOperator: string) => {
    const inputValue = parseFloat(display);

    if (prevValue === null) {
      setPrevValue(display);
    } else if (operator) {
      const currentPrev = parseFloat(prevValue);
      const result = calculate(currentPrev, operator, inputValue);
      const formatted = formatNumber(result);
      setDisplay(formatted);
      setPrevValue(formatted);
      setHistory(prev => [`${currentPrev} ${operator} ${inputValue} = ${formatted}`, ...prev].slice(0, 20));
    }

    setWaitingForOperand(true);
    setOperator(nextOperator);
  };

  const performFunction = (fn: string) => {
    const inputValue = parseFloat(display);
    let result: number;

    switch (fn) {
      case 'sqrt': result = Math.sqrt(inputValue); break;
      case 'sin': result = Math.sin(inputValue * Math.PI / 180); break;
      case 'cos': result = Math.cos(inputValue * Math.PI / 180); break;
      case 'tan': result = Math.tan(inputValue * Math.PI / 180); break;
      case 'log': result = Math.log10(inputValue); break;
      case 'ln': result = Math.log(inputValue); break;
      case '1/x': result = 1 / inputValue; break;
      case 'x^2': result = inputValue * inputValue; break;
      case 'n!': result = factorial(inputValue); break;
      case 'pi': result = Math.PI; break;
      case 'e': result = Math.E; break;
      case 'abs': result = Math.abs(inputValue); break;
      default: result = inputValue;
    }

    const formatted = formatNumber(result);
    setDisplay(formatted);
    setWaitingForOperand(true);
  };

  const factorial = (n: number): number => {
    if (n < 0 || !Number.isInteger(n)) return NaN;
    if (n > 170) return Infinity;
    let result = 1;
    for (let i = 2; i <= n; i++) result *= i;
    return result;
  };

  const handleEqual = () => {
    const inputValue = parseFloat(display);

    if (prevValue !== null && operator) {
      const currentPrev = parseFloat(prevValue);
      const result = calculate(currentPrev, operator, inputValue);
      const formatted = formatNumber(result);
      setDisplay(formatted);
      setPrevValue(null);
      setOperator(null);
      setWaitingForOperand(true);
      setHistory(prev => [`${currentPrev} ${operator} ${inputValue} = ${formatted}`, ...prev].slice(0, 20));
    }
  };

  const clear = () => {
    setDisplay('0');
    setPrevValue(null);
    setOperator(null);
    setWaitingForOperand(false);
  };

  const clearEntry = () => {
    setDisplay('0');
  };

  const backspace = () => {
    if (!waitingForOperand && display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const btnClass = "h-12 rounded-lg text-sm font-medium transition-all hover:brightness-110 active:scale-95";
  const numClass = `${btnClass} bg-[#3e3e3e] text-white`;
  const opClass = `${btnClass} bg-[#4a4a4a] text-[#4a9eff]`;
  const fnClass = `${btnClass} bg-[#333] text-white/80`;
  const eqClass = `${btnClass} bg-[#4a9eff] text-white`;

  return (
    <div className="flex flex-col h-full bg-[#2d2d2d]">
      {/* Display */}
      <div className="bg-[#1e1e1e] p-4">
        {showHistory && history.length > 0 && (
          <div className="max-h-20 overflow-y-auto mb-2 scrollbar-thin">
            {history.map((h, i) => (
              <p key={i} className="text-white/40 text-xs text-right">{h}</p>
            ))}
          </div>
        )}
        <div className="text-right text-3xl text-white font-light truncate">{display}</div>
        {operator && prevValue && (
          <div className="text-right text-white/40 text-xs mt-1">{prevValue} {operator}</div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex-1 p-3 grid grid-cols-5 gap-1.5">
        {/* Row 1 */}
        <button onClick={clear} className={fnClass}>AC</button>
        <button onClick={clearEntry} className={fnClass}>CE</button>
        <button onClick={backspace} className={fnClass}><Delete size={14} className="mx-auto" /></button>
        <button onClick={() => performOperation('%')} className={opClass}>%</button>
        <button onClick={() => performOperation('/')} className={opClass}>/</button>

        {/* Row 2 */}
        <button onClick={() => performFunction('sin')} className={fnClass}>sin</button>
        <button onClick={() => inputDigit('7')} className={numClass}>7</button>
        <button onClick={() => inputDigit('8')} className={numClass}>8</button>
        <button onClick={() => inputDigit('9')} className={numClass}>9</button>
        <button onClick={() => performOperation('*')} className={opClass}>*</button>

        {/* Row 3 */}
        <button onClick={() => performFunction('cos')} className={fnClass}>cos</button>
        <button onClick={() => inputDigit('4')} className={numClass}>4</button>
        <button onClick={() => inputDigit('5')} className={numClass}>5</button>
        <button onClick={() => inputDigit('6')} className={numClass}>6</button>
        <button onClick={() => performOperation('-')} className={opClass}>-</button>

        {/* Row 4 */}
        <button onClick={() => performFunction('tan')} className={fnClass}>tan</button>
        <button onClick={() => inputDigit('1')} className={numClass}>1</button>
        <button onClick={() => inputDigit('2')} className={numClass}>2</button>
        <button onClick={() => inputDigit('3')} className={numClass}>3</button>
        <button onClick={() => performOperation('+')} className={opClass}>+</button>

        {/* Row 5 */}
        <button onClick={() => performFunction('sqrt')} className={fnClass}>sqrt</button>
        <button onClick={() => performFunction('pi')} className={fnClass}>pi</button>
        <button onClick={() => inputDigit('0')} className={numClass}>0</button>
        <button onClick={inputDecimal} className={numClass}>.</button>
        <button onClick={handleEqual} className={eqClass}>=</button>

        {/* Row 6 */}
        <button onClick={() => performFunction('log')} className={fnClass}>log</button>
        <button onClick={() => performFunction('ln')} className={fnClass}>ln</button>
        <button onClick={() => performFunction('x^2')} className={fnClass}>x^2</button>
        <button onClick={() => performFunction('1/x')} className={fnClass}>1/x</button>
        <button onClick={() => performFunction('n!')} className={fnClass}>n!</button>
      </div>

      {/* Footer */}
      <div className="flex justify-between px-4 py-2 border-t border-white/10">
        <button onClick={() => setShowHistory(!showHistory)} className="text-white/40 hover:text-white text-xs flex items-center gap-1">
          <History size={12} /> History
        </button>
        <button onClick={() => setHistory([])} className="text-white/40 hover:text-white text-xs flex items-center gap-1">
          <RotateCcw size={12} /> Clear
        </button>
      </div>
    </div>
  );
}
