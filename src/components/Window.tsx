import { useRef, useEffect, useState, useCallback } from 'react';
import { useDesktop } from '@/contexts/DesktopContext';
import type { WindowState } from '@/types';
import * as Icons from 'lucide-react';

const APP_COMPONENTS: Record<string, React.ComponentType<any>> = {};

export function registerAppComponent(id: string, component: React.ComponentType<any>) {
  APP_COMPONENTS[id] = component;
}

interface WindowProps {
  window: WindowState;
}

export default function WindowComponent({ window: win }: WindowProps) {
  const { closeWindow, minimizeWindow, maximizeWindow, restoreWindow, focusWindow, updateWindowPosition, updateWindowSize, getApp } = useDesktop();
  const app = getApp(win.appId);
  const titleBarRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [winPos, setWinPos] = useState({ x: win.x, y: win.y });
  const [winSize, setWinSize] = useState({ width: win.width, height: win.height });
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    setWinPos({ x: win.x, y: win.y });
  }, [win.x, win.y]);

  useEffect(() => {
    setWinSize({ width: win.width, height: win.height });
  }, [win.width, win.height]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (win.isMaximized) return;
    focusWindow(win.id);
    setIsDragging(true);
    setDragStart({ x: e.clientX - winPos.x, y: e.clientY - winPos.y });
  }, [focusWindow, win.id, win.isMaximized, winPos.x, winPos.y]);

  useEffect(() => {
    if (!isDragging) return;
    const handleMove = (e: MouseEvent) => {
      const newX = Math.max(0, e.clientX - dragStart.x);
      const newY = Math.max(40, e.clientY - dragStart.y);
      setWinPos({ x: newX, y: newY });
    };
    const handleUp = () => {
      setIsDragging(false);
      updateWindowPosition(win.id, winPos.x, winPos.y);
    };
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleUp);
    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
    };
  }, [isDragging, dragStart, win.id, winPos.x, winPos.y, updateWindowPosition]);

  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  }, []);

  useEffect(() => {
    if (!isResizing) return;
    const startSize = { ...winSize };
    const startMouse = { ...dragStart };
    const handleMove = (e: MouseEvent) => {
      const dw = e.clientX - startMouse.x;
      const dh = e.clientY - startMouse.y;
      setWinSize({
        width: Math.max(app?.minWidth || 300, startSize.width + dw),
        height: Math.max(app?.minHeight || 200, startSize.height + dh),
      });
    };
    const handleUp = () => {
      setIsResizing(false);
      updateWindowSize(win.id, winSize.width, winSize.height);
    };
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleUp);
    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
    };
  }, [isResizing, dragStart, win.id, winSize, updateWindowSize, app]);

  if (win.isMinimized) return null;

  const IconComponent = (Icons as any)[app?.icon || 'File'] || Icons.File;
  const AppComponent = APP_COMPONENTS[win.appId];

  const style: React.CSSProperties = win.isMaximized ? {
    position: 'fixed',
    top: 40,
    left: 0,
    right: 0,
    bottom: 48,
    width: '100%',
    height: 'calc(100vh - 88px)',
    zIndex: win.zIndex,
  } : {
    position: 'fixed',
    left: winPos.x,
    top: winPos.y,
    width: winSize.width,
    height: winSize.height,
    zIndex: win.zIndex,
  };

  return (
    <div
      className={`flex flex-col rounded-lg overflow-hidden shadow-2xl border transition-shadow duration-100 ${
        win.isActive ? 'border-[#4a9eff]/50 shadow-[0_0_20px_rgba(74,158,255,0.2)]' : 'border-[#444]'
      }`}
      style={style}
      onMouseDown={() => focusWindow(win.id)}
    >
      {/* Title bar */}
      <div
        ref={titleBarRef}
        className={`flex items-center justify-between h-9 px-3 select-none cursor-default ${
          win.isActive ? 'bg-[#3e3e3e]' : 'bg-[#2d2d2d]'
        }`}
        onMouseDown={handleMouseDown}
        onDoubleClick={() => win.isMaximized ? restoreWindow(win.id) : maximizeWindow(win.id)}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <IconComponent size={14} className="text-[#ccc] shrink-0" />
          <span className="text-[13px] text-[#ccc] truncate">{win.title}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => minimizeWindow(win.id)}
            className="w-4 h-4 rounded-full bg-[#ffbd2e] hover:brightness-110 transition-all flex items-center justify-center"
          >
            <Icons.Minus size={10} className="text-[#664] opacity-0 hover:opacity-100" />
          </button>
          <button
            onClick={() => win.isMaximized ? restoreWindow(win.id) : maximizeWindow(win.id)}
            className="w-4 h-4 rounded-full bg-[#28c840] hover:brightness-110 transition-all flex items-center justify-center"
          >
            <Icons.Square size={8} className="text-[#353] opacity-0 hover:opacity-100" />
          </button>
          <button
            onClick={() => closeWindow(win.id)}
            className="w-4 h-4 rounded-full bg-[#ff5f57] hover:brightness-110 transition-all flex items-center justify-center"
          >
            <Icons.X size={10} className="text-[#622] opacity-0 hover:opacity-100" />
          </button>
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 bg-[#2d2d2d] overflow-hidden">
        {AppComponent ? <AppComponent windowData={win.data} /> : (
          <div className="flex items-center justify-center h-full text-[#666]">
            <div className="text-center">
              <IconComponent size={48} className="mx-auto mb-4 opacity-30" />
              <p>{app?.name || 'Unknown App'}</p>
            </div>
          </div>
        )}
      </div>

      {/* Resize handle */}
      {!win.isMaximized && (
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize z-50"
          onMouseDown={handleResizeStart}
          style={{ background: 'linear-gradient(135deg, transparent 50%, #555 50%)' }}
        />
      )}
    </div>
  );
}
