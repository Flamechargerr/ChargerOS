import { useState } from 'react';
import { useDesktop } from '@/contexts/DesktopContext';
import { Menu, Trash2, ChevronUp, Search, Power } from 'lucide-react';
import * as Icons from 'lucide-react';

const categories = [
  'Favorites', 'System', 'Internet', 'Office', 'Graphics', 'Media', 'Development', 'Games', 'Utilities',
];

export default function Taskbar() {
  const { windows, openApp, focusWindow, restoreWindow, minimizeWindow, appRegistry } = useDesktop();
  const [showMenu, setShowMenu] = useState(false);
  const [activeCategory, setActiveCategory] = useState('Favorites');
  const [searchQuery, setSearchQuery] = useState('');

  const runningApps = [...new Set(windows.filter(w => !w.isMinimized).map(w => w.appId))];

  const filteredApps = searchQuery
    ? appRegistry.filter(a => a.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : activeCategory === 'Favorites'
      ? appRegistry.filter(a => ['filemanager', 'browser', 'terminal', 'texteditor', 'settings', 'calculator'].includes(a.id))
      : appRegistry.filter(a => a.category === activeCategory);

  const handleAppClick = (appId: string) => {
    const existing = windows.find(w => w.appId === appId && !w.isMinimized);
    if (existing) {
      focusWindow(existing.id);
    } else {
      const minimized = windows.find(w => w.appId === appId && w.isMinimized);
      if (minimized) {
        restoreWindow(minimized.id);
      } else {
        openApp(appId);
      }
    }
    setShowMenu(false);
  };

  return (
    <>
      {/* Application Menu */}
      {showMenu && (
        <>
          <div className="fixed inset-0 z-[9985]" onClick={() => setShowMenu(false)} />
          <div className="fixed bottom-12 left-4 z-[9992] bg-[#1e1e1e]/95 backdrop-blur-xl border border-[#444] rounded-2xl shadow-2xl flex overflow-hidden"
            style={{ width: 680, height: 480 }}>
            {/* Sidebar */}
            <div className="w-44 bg-[#252526] border-r border-[#333] flex flex-col">
              <div className="p-3">
                <div className="relative">
                  <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/40" />
                  <input
                    type="text"
                    placeholder="Search apps..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/10 border border-white/10 rounded-lg pl-8 pr-3 py-1.5 text-sm text-white placeholder-white/30 outline-none focus:border-[#4a9eff]/50"
                    autoFocus
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto py-2 scrollbar-thin">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => { setActiveCategory(cat); setSearchQuery(''); }}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                      activeCategory === cat && !searchQuery
                        ? 'bg-[#4a9eff]/20 text-[#4a9eff]'
                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <div className="p-3 border-t border-[#333]">
                <button
                  onClick={() => window.location.reload()}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white/60 hover:text-red-400 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <Power size={14} />
                  Log Out
                </button>
              </div>
            </div>

            {/* App grid */}
            <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
              <h3 className="text-white/40 text-xs uppercase tracking-wider mb-3">
                {searchQuery ? `Search: "${searchQuery}"` : activeCategory}
              </h3>
              <div className="grid grid-cols-4 gap-3">
                {filteredApps.map(app => {
                  const IconComp = (Icons as any)[app.icon] || Icons.File;
                  return (
                    <button
                      key={app.id}
                      onClick={() => handleAppClick(app.id)}
                      className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-white/10 transition-colors group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-[#3e3e3e] flex items-center justify-center group-hover:bg-[#4a4a4a] transition-colors">
                        <IconComp size={24} className="text-[#ccc]" />
                      </div>
                      <span className="text-white/70 text-xs text-center leading-tight group-hover:text-white">{app.name}</span>
                    </button>
                  );
                })}
              </div>
              {filteredApps.length === 0 && (
                <div className="text-center text-white/30 text-sm py-12">No apps found</div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Taskbar */}
      <div className="fixed bottom-0 left-0 right-0 h-12 bg-[#1e1e1e]/90 backdrop-blur-md border-t border-white/5 flex items-center px-3 z-[9990]">
        {/* Menu button */}
        <button
          onClick={() => setShowMenu(!showMenu)}
          className={`p-2.5 rounded-xl transition-colors mr-2 ${
            showMenu ? 'bg-[#4a9eff]/20 text-[#4a9eff]' : 'text-white/70 hover:bg-white/10 hover:text-white'
          }`}
        >
          <Menu size={20} />
        </button>

        {/* App icons */}
        <div className="flex items-center gap-1 flex-1 justify-center">
          {appRegistry.slice(0, 8).map(app => {
            const IconComp = (Icons as any)[app.icon] || Icons.File;
            const isRunning = runningApps.includes(app.id);
            return (
              <button
                key={app.id}
                onClick={() => handleAppClick(app.id)}
                className={`relative p-2 rounded-xl transition-all group ${
                  isRunning ? 'bg-white/10 text-white' : 'text-white/50 hover:bg-white/10 hover:text-white'
                }`}
                title={app.name}
              >
                <IconComp size={20} />
                {isRunning && (
                  <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#4a9eff]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              windows.forEach(w => {
                if (!w.isMinimized) {
                  minimizeWindow(w.id);
                }
              });
            }}
            className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
            title="Show Desktop"
          >
            <ChevronUp size={18} />
          </button>
          <div className="w-px h-6 bg-white/10 mx-1" />
          <button
            onClick={() => openApp('filemanager')}
            className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
            title="Trash"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </>
  );
}
