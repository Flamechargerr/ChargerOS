import { useState, useRef, useEffect, useCallback } from 'react';
import { useFileSystem } from '@/contexts/FileSystemContext';
import { useAuth } from '@/contexts/AuthContext';

interface CommandHistory {
  input: string;
  output: string[];
}

export default function Terminal() {
  const { readFile, writeFile, deleteFile, createFolder, listDir, fileExists } = useFileSystem();
  const { username } = useAuth();
  const [cwd, setCwd] = useState('/home/user');
  const [history, setHistory] = useState<CommandHistory[]>([]);
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);

  const executeCommand = useCallback((cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    setCommandHistory(prev => [...prev, trimmed]);

    const parts = trimmed.split(/\s+/);
    const command = parts[0];
    const args = parts.slice(1);
    const output: string[] = [];

    const resolvePath = (path: string) => {
      if (path.startsWith('/')) return path;
      if (path === '~') return '/home/user';
      if (path.startsWith('~/')) return '/home/user' + path.slice(1);
      return cwd === '/' ? `/${path}` : `${cwd}/${path}`;
    };

    try {
      switch (command) {
        case 'ls': {
          const path = args[0] ? resolvePath(args[0]) : cwd;
          const items = listDir(path);
          if (args.includes('-l')) {
            items.forEach(item => {
              const type = item.type === 'folder' ? 'd' : '-';
              const size = item.size || 0;
              output.push(`${type}rwxrwxrwx 1 ${username} ${username} ${size.toString().padStart(8)} ${new Date(item.modified).toLocaleDateString()} ${item.name}`);
            });
          } else {
            output.push(...items.map(item => item.type === 'folder' ? `${item.name}/` : item.name));
          }
          break;
        }
        case 'cd': {
          const path = args[0] ? resolvePath(args[0]) : '/home/user';
          const node = fileExists(path);
          if (node) {
            setCwd(path);
          } else {
            output.push(`cd: ${args[0]}: No such file or directory`);
          }
          break;
        }
        case 'pwd':
          output.push(cwd);
          break;
        case 'mkdir': {
          if (args[0]) {
            createFolder(resolvePath(args[0]));
          } else {
            output.push('mkdir: missing operand');
          }
          break;
        }
        case 'touch': {
          if (args[0]) {
            writeFile(resolvePath(args[0]), '');
          } else {
            output.push('touch: missing operand');
          }
          break;
        }
        case 'cat': {
          if (args[0]) {
            const content = readFile(resolvePath(args[0]));
            if (content !== null) {
              output.push(...content.split('\n'));
            } else {
              output.push(`cat: ${args[0]}: No such file or directory`);
            }
          } else {
            output.push('cat: missing operand');
          }
          break;
        }
        case 'rm': {
          if (args[0]) {
            deleteFile(resolvePath(args[0]));
          } else {
            output.push('rm: missing operand');
          }
          break;
        }
        case 'echo': {
          output.push(args.join(' '));
          break;
        }
        case 'clear':
          setHistory([]);
          return;
        case 'whoami':
          output.push(username);
          break;
        case 'date':
          output.push(new Date().toString());
          break;
        case 'uname':
          output.push('ChargerOS');
          break;
        case 'neofetch': {
          const perf = performance as any;
          const mem = Math.round(perf.memory?.usedJSHeapSize / 1024 / 1024 || 0);
          const totalMem = Math.round(perf.memory?.totalJSHeapSize / 1024 / 1024 || 0);
          output.push(
            '    ___    __    _       ____  _____ __',
            '   /   |  / /   (_)     / __ \/ ___// /',
            '  / /| | / /   / /_____/ / / /\__ \/ / ',
            ' / ___ |/ /___/ /_____/ /_/ /___/ / /__',
            '/_/  |_/_____/_/      \____//____/_____/',
            '',
            `OS: ChargerOS 1.0`,
            `Kernel: simulated-browser`,
            `Shell: websh`,
            `User: ${username}`,
            `Memory: ${mem}MB / ${totalMem}MB`,
            `Browser: ${navigator.userAgent.split(' ').pop()}`,
            `Resolution: ${window.innerWidth}x${window.innerHeight}`,
          );
          break;
        }
        case 'cowsay': {
          const text = args.join(' ') || 'Moo!';
          const len = Math.max(text.length + 2, 4);
          output.push(` ${'_'.repeat(len)}`,
            `< ${text} >`,
            ` ${'-'.repeat(len)}`,
            '        \\   ^__^',
            '         \\  (oo)\\_______',
            '            (__)\\       )\\/\\',
            '                ||----w |',
            '                ||     ||');
          break;
        }
        case 'fortune': {
          const fortunes = [
            'The journey of a thousand miles begins with a single step.',
            'Fortune favors the bold.',
            'A friend in need is a friend indeed.',
            'All that glitters is not gold.',
            'Better late than never.',
            'Curiosity killed the cat, but satisfaction brought it back.',
            'Don\'t count your chickens before they hatch.',
            'Every cloud has a silver lining.',
            'Good things come to those who wait.',
            'If at first you don\'t succeed, try, try again.',
          ];
          output.push(fortunes[Math.floor(Math.random() * fortunes.length)]);
          break;
        }
        case 'tree': {
          const buildTree = (path: string, prefix = '') => {
            const items = listDir(path);
            items.forEach((item, i) => {
              const isLast = i === items.length - 1;
              const connector = isLast ? '└── ' : '├── ';
              output.push(`${prefix}${connector}${item.name}`);
              if (item.type === 'folder' && item.children && item.children.length > 0) {
                const ext = isLast ? '    ' : '│   ';
                buildTree(`${path}/${item.name}`, prefix + ext);
              }
            });
          };
          output.push(cwd);
          buildTree(cwd);
          break;
        }
        case 'history': {
          commandHistory.forEach((cmd, i) => output.push(`${i + 1}  ${cmd}`));
          break;
        }
        case 'help': {
          output.push(
            'Available commands:',
            '  ls [-l] [path]     List directory contents',
            '  cd [path]          Change directory',
            '  pwd                Print working directory',
            '  mkdir <dir>        Create directory',
            '  touch <file>       Create empty file',
            '  cat <file>         Display file contents',
            '  rm <file>          Remove file',
            '  echo <text>        Print text',
            '  clear              Clear screen',
            '  whoami             Print username',
            '  date               Print date',
            '  uname              Print OS name',
            '  neofetch           System info',
            '  cowsay <text>      Cow with message',
            '  fortune            Random fortune',
            '  tree               Directory tree',
            '  history            Command history',
            '  help               Show this help',
          );
          break;
        }
        default:
          output.push(`${command}: command not found. Type 'help' for available commands.`);
      }
    } catch (err: any) {
      output.push(`Error: ${err.message}`);
    }

    setHistory(prev => [...prev, { input: trimmed, output }]);
  }, [cwd, username, readFile, writeFile, deleteFile, createFolder, listDir, fileExists, commandHistory]);

  useEffect(() => {
    outputRef.current?.scrollTo({ top: outputRef.current.scrollHeight, behavior: 'smooth' });
  }, [history]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] text-[#4af626] font-mono text-sm" onClick={() => inputRef.current?.focus()}>
      <div ref={outputRef} className="flex-1 overflow-auto p-3 scrollbar-thin">
        {history.map((entry, i) => (
          <div key={i}>
            <div className="flex items-center gap-1">
              <span className="text-[#4a9eff]">{username}@chargeros</span>
              <span className="text-white/40">:</span>
              <span className="text-[#ff9800]">{cwd}</span>
              <span className="text-white/40">$</span>
              <span className="text-white ml-1">{entry.input}</span>
            </div>
            {entry.output.map((line, j) => (
              <div key={j} className="text-[#ccc] whitespace-pre-wrap">{line}</div>
            ))}
          </div>
        ))}
        <div className="flex items-center gap-1">
          <span className="text-[#4a9eff]">{username}@chargeros</span>
          <span className="text-white/40">:</span>
          <span className="text-[#ff9800]">{cwd}</span>
          <span className="text-white/40">$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none text-white ml-1 font-mono"
            spellCheck={false}
            autoComplete="off"
          />
        </div>
      </div>
    </div>
  );
}
