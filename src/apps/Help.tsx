import { useState } from 'react';
import { HelpCircle, Search, Terminal, FolderOpen, Globe, Settings, Gamepad2, Code, Mail, Music } from 'lucide-react';

const TOPICS = [
  {
    icon: Terminal,
    title: 'Getting Started',
    content: 'ChargerOS is a fully functional web-based Linux desktop environment. Log in with any username and password, or use Guest mode. The desktop features a top panel with clock and system indicators, and a bottom taskbar with the application menu.',
  },
  {
    icon: FolderOpen,
    title: 'File Manager',
    content: 'Browse and manage your virtual file system. Create folders, upload files, and organize your documents. The file system is persisted in your browser\'s localStorage.',
  },
  {
    icon: Terminal,
    title: 'Terminal',
    content: 'Use the terminal to interact with the system via commands. Available commands: ls, cd, pwd, mkdir, touch, cat, rm, echo, clear, whoami, date, neofetch, cowsay, fortune, tree, and more.',
  },
  {
    icon: Globe,
    title: 'Applications',
    content: 'Access 59 built-in apps from the taskbar menu or desktop icons. Categories include System, Internet, Office, Graphics, Media, Development, Games, and Utilities.',
  },
  {
    icon: Settings,
    title: 'Customization',
    content: 'Open Settings to change your wallpaper, accent color, and other preferences. Right-click on the desktop for quick access to common actions.',
  },
  {
    icon: Gamepad2,
    title: 'Games',
    content: 'Play Chess, Solitaire, Minesweeper, Snake, Tetris, Tic Tac Toe, and 2048. High scores are saved locally.',
  },
  {
    icon: Code,
    title: 'Development',
    content: 'Use the Code Editor, Git Client, Database Manager, and API Tester for development work. Syntax highlighting is available for multiple languages.',
  },
  {
    icon: Mail,
    title: 'Productivity',
    content: 'Stay organized with Email, Calendar, Notes, Todo List, and the full office suite including Writer, Spreadsheet, and Presentation apps.',
  },
  {
    icon: Music,
    title: 'Media',
    content: 'Play music and videos, take photos with the Camera app, and use the Color Picker, Paint, and other creative tools.',
  },
];

export default function Help() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<number | null>(null);

  const filtered = TOPICS.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-full bg-[#2d2d2d]">
      {/* Sidebar */}
      <div className="w-48 bg-[#252526] border-r border-[#333] py-2 overflow-y-auto">
        <div className="px-3 py-2">
          <div className="flex items-center bg-white/10 rounded-lg px-2">
            <Search size={10} className="text-white/30" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search help..."
              className="flex-1 bg-transparent text-white text-xs py-1.5 outline-none placeholder-white/30 ml-1"
            />
          </div>
        </div>
        {filtered.map((topic) => {
          const originalIdx = TOPICS.indexOf(topic);
          return (
            <button
              key={originalIdx}
              onClick={() => setSelected(originalIdx)}
              className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2 transition-colors ${
                selected === originalIdx ? 'bg-[#37373d] text-white' : 'text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              <topic.icon size={12} />
              {topic.title}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {selected !== null ? (
          <div>
            <div className="flex items-center gap-3 mb-4">
              {(() => { const Icon = TOPICS[selected].icon; return <Icon size={24} className="text-[#4a9eff]" />; })()}
              <h2 className="text-white text-lg font-medium">{TOPICS[selected].title}</h2>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">{TOPICS[selected].content}</p>
          </div>
        ) : (
          <div className="text-center mt-12">
            <HelpCircle size={48} className="text-white/10 mx-auto mb-4" />
            <h2 className="text-white text-lg mb-2">ChargerOS Help</h2>
            <p className="text-white/40 text-sm">Select a topic from the sidebar to learn more.</p>
            <div className="mt-6 grid grid-cols-3 gap-3 max-w-md mx-auto">
              {TOPICS.slice(0, 6).map((topic, i) => (
                <button
                  key={i}
                  onClick={() => setSelected(i)}
                  className="p-3 bg-[#252526] rounded-lg hover:bg-[#333] transition-colors flex flex-col items-center gap-2"
                >
                  <topic.icon size={16} className="text-[#4a9eff]" />
                  <span className="text-white/60 text-[10px]">{topic.title}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
