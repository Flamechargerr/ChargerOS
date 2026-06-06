import { useState } from 'react';
import { useDesktop } from '@/contexts/DesktopContext';
import { useAuth } from '@/contexts/AuthContext';
import WindowComponent from './Window';
import TopPanel from './TopPanel';
import Taskbar from './Taskbar';
import * as Icons from 'lucide-react';

export default function Desktop() {
  const { windows, icons, wallpaper, openApp } = useDesktop();
  const { isGuest } = useAuth();
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

  const handleDesktopClick = () => {
    setContextMenu(null);
  };

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const appIconMap: Record<string, string> = {
    filemanager: 'Home',
  };

  return (
    <div
      className="fixed inset-0 pt-10 pb-12 select-none"
      style={{
        backgroundImage: `url(${wallpaper})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      onClick={handleDesktopClick}
      onContextMenu={handleRightClick}
    >
      <TopPanel />
      <Taskbar />

      {/* Guest notification */}
      {isGuest && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 bg-[#ff9800]/20 border border-[#ff9800]/40 text-[#ff9800] text-xs px-4 py-2 rounded-lg backdrop-blur-sm z-[9980]">
          Guest demo session
        </div>
      )}

      {/* Desktop icons */}
      <div className="relative w-full h-full">
        {icons.map(icon => {
          const iconName = icon.name === 'Trash' ? 'Trash2' :
            icon.name === 'Home' ? 'Home' :
            appIconMap[icon.appId] || 'File';
          const AppIcon = (Icons as any)[iconName] || Icons.File;

          return (
            <button
              key={icon.id}
              className="absolute flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-white/10 transition-colors group w-[72px]"
              style={{ left: icon.x, top: icon.y }}
              onClick={(e) => { e.stopPropagation(); openApp(icon.appId); }}
              onDoubleClick={(e) => { e.stopPropagation(); openApp(icon.appId); }}
            >
              <div className="w-12 h-12 flex items-center justify-center">
                <AppIcon size={32} className="text-white/70 group-hover:text-white" />
              </div>
              <span className="text-white text-xs text-center leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] group-hover:bg-[#4a9eff]/50 group-hover:px-1 group-hover:rounded">
                {icon.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Desktop context menu */}
      {contextMenu && (
        <>
          <div className="fixed inset-0 z-[9980]" onClick={() => setContextMenu(null)} />
          <div
            className="absolute z-[9993] bg-[#2d2d2d] border border-[#444] rounded-xl shadow-2xl py-2 min-w-[180px]"
            style={{ left: contextMenu.x, top: contextMenu.y }}
          >
            <button
              onClick={() => { openApp('texteditor'); setContextMenu(null); }}
              className="w-full text-left px-4 py-2 text-sm text-white/80 hover:bg-[#4a9eff]/20 hover:text-white transition-colors flex items-center gap-2"
            >
              <Icons.FileText size={14} /> New Document
            </button>
            <button
              onClick={() => { openApp('filemanager'); setContextMenu(null); }}
              className="w-full text-left px-4 py-2 text-sm text-white/80 hover:bg-[#4a9eff]/20 hover:text-white transition-colors flex items-center gap-2"
            >
              <Icons.FolderOpen size={14} /> Open File Manager
            </button>
            <button
              onClick={() => { openApp('terminal'); setContextMenu(null); }}
              className="w-full text-left px-4 py-2 text-sm text-white/80 hover:bg-[#4a9eff]/20 hover:text-white transition-colors flex items-center gap-2"
            >
              <Icons.Terminal size={14} /> Open in Terminal
            </button>
            <div className="border-t border-white/10 my-1" />
            <button
              onClick={() => { openApp('settings'); setContextMenu(null); }}
              className="w-full text-left px-4 py-2 text-sm text-white/80 hover:bg-[#4a9eff]/20 hover:text-white transition-colors flex items-center gap-2"
            >
              <Icons.Image size={14} /> Change Wallpaper
            </button>
            <button
              onClick={() => setContextMenu(null)}
              className="w-full text-left px-4 py-2 text-sm text-white/80 hover:bg-[#4a9eff]/20 hover:text-white transition-colors flex items-center gap-2"
            >
              <Icons.RefreshCw size={14} /> Refresh
            </button>
          </div>
        </>
      )}

      {/* Windows */}
      {windows.map(win => (
        <WindowComponent key={win.id} window={win} />
      ))}
    </div>
  );
}
