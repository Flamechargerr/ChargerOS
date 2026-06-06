import React, { createContext, useContext, useState, useCallback } from 'react';
import type { WindowState, DesktopIcon, AppDefinition } from '@/types';

const appRegistry: AppDefinition[] = [
  // System
  { id: 'filemanager', name: 'Files', icon: 'FolderOpen', category: 'System', description: 'Browse and manage files', component: 'FileManager', defaultWidth: 800, defaultHeight: 500 },
  { id: 'terminal', name: 'Terminal', icon: 'Terminal', category: 'System', description: 'Command-line interface', component: 'Terminal', defaultWidth: 700, defaultHeight: 450, minWidth: 400, minHeight: 300 },
  { id: 'settings', name: 'Settings', icon: 'Settings', category: 'System', description: 'System configuration', component: 'Settings', defaultWidth: 700, defaultHeight: 500 },
  { id: 'calculator', name: 'Calculator', icon: 'Calculator', category: 'System', description: 'Basic and scientific calculator', component: 'Calculator', defaultWidth: 360, defaultHeight: 520 },
  { id: 'texteditor', name: 'Text Editor', icon: 'FileText', category: 'System', description: 'Create and edit text files', component: 'TextEditor', defaultWidth: 700, defaultHeight: 500, minWidth: 400, minHeight: 300 },
  { id: 'calendar', name: 'Calendar', icon: 'Calendar', category: 'System', description: 'Calendar and events', component: 'CalendarApp', defaultWidth: 700, defaultHeight: 500 },
  { id: 'clock', name: 'Clock', icon: 'Clock', category: 'System', description: 'World clock, alarm, timer', component: 'Clock', defaultWidth: 500, defaultHeight: 420 },
  { id: 'systemmonitor', name: 'System Monitor', icon: 'Activity', category: 'System', description: 'Monitor system resources', component: 'SystemMonitor', defaultWidth: 700, defaultHeight: 450 },
  { id: 'diskusage', name: 'Disk Usage', icon: 'PieChart', category: 'System', description: 'Visualize disk space', component: 'DiskUsage', defaultWidth: 600, defaultHeight: 450 },
  { id: 'backup', name: 'Backup', icon: 'Download', category: 'System', description: 'Export and import data', component: 'Backup', defaultWidth: 500, defaultHeight: 350 },
  // Internet
  { id: 'browser', name: 'Browser', icon: 'Globe', category: 'Internet', description: 'Web browser', component: 'Browser', defaultWidth: 900, defaultHeight: 600, minWidth: 500, minHeight: 400 },
  { id: 'email', name: 'Email', icon: 'Mail', category: 'Internet', description: 'Email client', component: 'Email', defaultWidth: 900, defaultHeight: 550 },
  { id: 'chat', name: 'Chat', icon: 'MessageSquare', category: 'Internet', description: 'IRC chat client', component: 'Chat', defaultWidth: 600, defaultHeight: 450 },
  { id: 'weather', name: 'Weather', icon: 'CloudSun', category: 'Internet', description: 'Weather information', component: 'Weather', defaultWidth: 450, defaultHeight: 550 },
  { id: 'rss', name: 'RSS Reader', icon: 'Rss', category: 'Internet', description: 'Read news feeds', component: 'RSSReader', defaultWidth: 800, defaultHeight: 500 },
  { id: 'ftp', name: 'FTP Client', icon: 'Server', category: 'Internet', description: 'File transfer client', component: 'FTPClient', defaultWidth: 700, defaultHeight: 450 },
  { id: 'remote', name: 'Remote Desktop', icon: 'Monitor', category: 'Internet', description: 'VNC viewer', component: 'RemoteDesktop', defaultWidth: 600, defaultHeight: 450 },
  // Office
  { id: 'writer', name: 'Writer', icon: 'FileType', category: 'Office', description: 'Document editor', component: 'Writer', defaultWidth: 800, defaultHeight: 600, minWidth: 500, minHeight: 400 },
  { id: 'calc', name: 'Spreadsheet', icon: 'Table', category: 'Office', description: 'Spreadsheet editor', component: 'Spreadsheet', defaultWidth: 800, defaultHeight: 550 },
  { id: 'impress', name: 'Presentation', icon: 'Presentation', category: 'Office', description: 'Presentation editor', component: 'Impress', defaultWidth: 800, defaultHeight: 550 },
  { id: 'notes', name: 'Notes', icon: 'StickyNote', category: 'Office', description: 'Sticky notes', component: 'Notes', defaultWidth: 500, defaultHeight: 400 },
  { id: 'todo', name: 'Todo List', icon: 'CheckSquare', category: 'Office', description: 'Task management', component: 'Todo', defaultWidth: 500, defaultHeight: 500 },
  { id: 'pdfviewer', name: 'PDF Viewer', icon: 'File', category: 'Office', description: 'View PDF files', component: 'PDFViewer', defaultWidth: 700, defaultHeight: 550 },
  { id: 'dictionary', name: 'Dictionary', icon: 'BookOpen', category: 'Office', description: 'Word definitions', component: 'Dictionary', defaultWidth: 500, defaultHeight: 450 },
  // Graphics
  { id: 'imageviewer', name: 'Image Viewer', icon: 'Image', category: 'Graphics', description: 'View images', component: 'ImageViewer', defaultWidth: 600, defaultHeight: 500 },
  { id: 'paint', name: 'Paint', icon: 'Paintbrush', category: 'Graphics', description: 'Drawing and painting', component: 'Paint', defaultWidth: 750, defaultHeight: 550 },
  { id: 'screenshot', name: 'Screenshot', icon: 'Camera', category: 'Graphics', description: 'Capture screen', component: 'Screenshot', defaultWidth: 500, defaultHeight: 400 },
  { id: 'colorpicker', name: 'Color Picker', icon: 'Palette', category: 'Graphics', description: 'Pick and manage colors', component: 'ColorPicker', defaultWidth: 450, defaultHeight: 500 },
  { id: 'iconviewer', name: 'Icon Viewer', icon: 'Grid3x3', category: 'Graphics', description: 'Browse system icons', component: 'IconViewer', defaultWidth: 600, defaultHeight: 450 },
  { id: 'fontviewer', name: 'Font Viewer', icon: 'Type', category: 'Graphics', description: 'Preview fonts', component: 'FontViewer', defaultWidth: 600, defaultHeight: 450 },
  { id: 'asciiart', name: 'ASCII Art', icon: 'Type', category: 'Graphics', description: 'Text to ASCII art', component: 'AsciiArt', defaultWidth: 600, defaultHeight: 450 },
  { id: 'qrcode', name: 'QR Code', icon: 'QrCode', category: 'Graphics', description: 'Generate QR codes', component: 'QRCode', defaultWidth: 450, defaultHeight: 500 },
  // Media
  { id: 'music', name: 'Music Player', icon: 'Music', category: 'Media', description: 'Play music files', component: 'MusicPlayer', defaultWidth: 700, defaultHeight: 450 },
  { id: 'video', name: 'Video Player', icon: 'Video', category: 'Media', description: 'Play video files', component: 'VideoPlayer', defaultWidth: 700, defaultHeight: 450 },
  { id: 'camera', name: 'Camera', icon: 'Camera', category: 'Media', description: 'Take photos', component: 'Camera', defaultWidth: 550, defaultHeight: 450 },
  { id: 'recorder', name: 'Sound Recorder', icon: 'Mic', category: 'Media', description: 'Record audio', component: 'SoundRecorder', defaultWidth: 500, defaultHeight: 350 },
  { id: 'cdburner', name: 'CD Burner', icon: 'Disc', category: 'Media', description: 'Create data discs', component: 'CDBurner', defaultWidth: 550, defaultHeight: 400 },
  { id: 'mediaconverter', name: 'Media Converter', icon: 'RefreshCw', category: 'Media', description: 'Convert media files', component: 'MediaConverter', defaultWidth: 500, defaultHeight: 400 },
  // Development
  { id: 'codeeditor', name: 'Code Editor', icon: 'Code', category: 'Development', description: 'Edit code', component: 'CodeEditor', defaultWidth: 800, defaultHeight: 600, minWidth: 500, minHeight: 400 },
  { id: 'git', name: 'Git Client', icon: 'GitBranch', category: 'Development', description: 'Version control', component: 'GitClient', defaultWidth: 800, defaultHeight: 500 },
  { id: 'database', name: 'Database', icon: 'Database', category: 'Development', description: 'Database manager', component: 'DatabaseManager', defaultWidth: 800, defaultHeight: 500 },
  { id: 'apitester', name: 'API Tester', icon: 'Send', category: 'Development', description: 'Test HTTP APIs', component: 'APITester', defaultWidth: 700, defaultHeight: 550 },
  { id: 'regex', name: 'Regex Tester', icon: 'Search', category: 'Development', description: 'Test regular expressions', component: 'RegexTester', defaultWidth: 650, defaultHeight: 500 },
  // Games
  { id: 'chess', name: 'Chess', icon: 'Crown', category: 'Games', description: 'Play chess', component: 'Chess', defaultWidth: 600, defaultHeight: 600 },
  { id: 'solitaire', name: 'Solitaire', icon: 'Layers', category: 'Games', description: 'Klondike solitaire', component: 'Solitaire', defaultWidth: 700, defaultHeight: 550 },
  { id: 'minesweeper', name: 'Minesweeper', icon: 'Bomb', category: 'Games', description: 'Classic minesweeper', component: 'Minesweeper', defaultWidth: 400, defaultHeight: 480 },
  { id: 'snake', name: 'Snake', icon: 'Zap', category: 'Games', description: 'Classic snake game', component: 'Snake', defaultWidth: 500, defaultHeight: 540 },
  { id: 'tetris', name: 'Tetris', icon: 'Box', category: 'Games', description: 'Classic Tetris', component: 'Tetris', defaultWidth: 420, defaultHeight: 600 },
  { id: 'tictactoe', name: 'Tic Tac Toe', icon: 'Grid3x3', category: 'Games', description: 'Tic tac toe', component: 'TicTacToe', defaultWidth: 420, defaultHeight: 500 },
  { id: 'game2048', name: '2048', icon: 'LayoutGrid', category: 'Games', description: '2048 puzzle game', component: 'Game2048', defaultWidth: 420, defaultHeight: 540 },
  // Utilities
  { id: 'password', name: 'Password Generator', icon: 'Key', category: 'Utilities', description: 'Generate passwords', component: 'PasswordGenerator', defaultWidth: 450, defaultHeight: 420 },
  { id: 'unitconverter', name: 'Unit Converter', icon: 'ArrowLeftRight', category: 'Utilities', description: 'Convert units', component: 'UnitConverter', defaultWidth: 500, defaultHeight: 450 },
  { id: 'scicalc', name: 'Scientific Calc', icon: 'FunctionSquare', category: 'Utilities', description: 'Graphing calculator', component: 'SciCalc', defaultWidth: 700, defaultHeight: 550 },
  { id: 'network', name: 'Network Tools', icon: 'Wifi', category: 'Utilities', description: 'Network diagnostics', component: 'NetworkTools', defaultWidth: 600, defaultHeight: 450 },
  { id: 'taskmanager', name: 'Task Manager', icon: 'List', category: 'Utilities', description: 'Process viewer', component: 'TaskManager', defaultWidth: 700, defaultHeight: 450 },
  { id: 'search', name: 'File Search', icon: 'Search', category: 'Utilities', description: 'Search files', component: 'FileSearch', defaultWidth: 600, defaultHeight: 450 },
  { id: 'archive', name: 'Archive Manager', icon: 'FileArchive', category: 'Utilities', description: 'Create/extract archives', component: 'ArchiveManager', defaultWidth: 600, defaultHeight: 450 },
  { id: 'sysinfo', name: 'System Info', icon: 'Cpu', category: 'Utilities', description: 'System information', component: 'SystemInfo', defaultWidth: 550, defaultHeight: 500 },
  { id: 'help', name: 'Help', icon: 'HelpCircle', category: 'Utilities', description: 'Documentation', component: 'Help', defaultWidth: 650, defaultHeight: 500 },
];

const defaultIcons: DesktopIcon[] = [
  { id: 'icon-home', appId: 'filemanager', name: 'Home', x: 20, y: 20 },
  { id: 'icon-browser', appId: 'browser', name: 'Browser', x: 20, y: 110 },
  { id: 'icon-terminal', appId: 'terminal', name: 'Terminal', x: 20, y: 200 },
  { id: 'icon-texteditor', appId: 'texteditor', name: 'Text Editor', x: 20, y: 290 },
  { id: 'icon-calculator', appId: 'calculator', name: 'Calculator', x: 20, y: 380 },
  { id: 'icon-settings', appId: 'settings', name: 'Settings', x: 20, y: 470 },
  { id: 'icon-trash', appId: 'filemanager', name: 'Trash', x: 20, y: 560 },
];

interface DesktopContextType {
  windows: WindowState[];
  icons: DesktopIcon[];
  activeWindowId: string | null;
  wallpaper: string;
  openApp: (appId: string, data?: any) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  updateWindowPosition: (id: string, x: number, y: number) => void;
  updateWindowSize: (id: string, width: number, height: number) => void;
  getApp: (appId: string) => AppDefinition | undefined;
  setWallpaper: (url: string) => void;
  appRegistry: AppDefinition[];
}

const DesktopContext = createContext<DesktopContextType | null>(null);

export function DesktopProvider({ children }: { children: React.ReactNode }) {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [icons] = useState<DesktopIcon[]>(() => {
    try {
      const saved = localStorage.getItem('chargeros_icons');
      if (saved) return JSON.parse(saved);
    } catch { /* ignore */ }
    return defaultIcons;
  });
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [wallpaper, setWallpaperState] = useState(() => {
    return localStorage.getItem('chargeros_wallpaper') || '/wallpapers/desktop-default.jpg';
  });
  const [, setZIndexCounter] = useState(100);

  const getApp = useCallback((appId: string) => {
    return appRegistry.find(a => a.id === appId);
  }, []);

  const openApp = useCallback((appId: string, data?: any) => {
    const app = getApp(appId);
    if (!app) return;

    if (app.singleInstance) {
      const existing = windows.find(w => w.appId === appId && !w.isMinimized);
      if (existing) {
        focusWindow(existing.id);
        return;
      }
    }

    const id = `window-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const centerX = Math.max(50, (window.innerWidth - app.defaultWidth) / 2);
    const centerY = Math.max(50, (window.innerHeight - app.defaultHeight - 100) / 2);

    setZIndexCounter(prev => {
      const newZ = prev + 1;
      const newWindow: WindowState = {
        id,
        appId,
        title: app.name,
        x: centerX + (windows.length * 30) % 150,
        y: centerY + (windows.length * 30) % 150,
        width: app.defaultWidth,
        height: app.defaultHeight,
        isMinimized: false,
        isMaximized: false,
        isActive: true,
        zIndex: newZ,
        data,
      };
      setWindows(prev => prev.map(w => ({ ...w, isActive: false })).concat(newWindow));
      setActiveWindowId(id);
      return newZ;
    });
  }, [windows, getApp]);

  const closeWindow = useCallback((id: string) => {
    setWindows(prev => {
      const filtered = prev.filter(w => w.id !== id);
      if (activeWindowId === id && filtered.length > 0) {
        const top = filtered.reduce((a, b) => a.zIndex > b.zIndex ? a : b);
        setActiveWindowId(top.id);
        return filtered.map(w => ({ ...w, isActive: w.id === top.id }));
      }
      if (filtered.length === 0) setActiveWindowId(null);
      return filtered;
    });
  }, [activeWindowId]);

  const minimizeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: true, isActive: false } : w));
    setWindows(prev => {
      const visible = prev.filter(w => !w.isMinimized && w.id !== id);
      if (visible.length > 0) {
        const top = visible.reduce((a, b) => a.zIndex > b.zIndex ? a : b);
        setActiveWindowId(top.id);
        return prev.map(w => ({ ...w, isActive: w.id === top.id }));
      }
      setActiveWindowId(null);
      return prev;
    });
  }, []);

  const maximizeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMaximized: true } : w));
  }, []);

  const restoreWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: false, isMaximized: false, isActive: true } : w));
    setActiveWindowId(id);
  }, []);

  const focusWindow = useCallback((id: string) => {
    setZIndexCounter(prev => {
      const newZ = prev + 1;
      setWindows(ws => ws.map(w => ({
        ...w,
        isActive: w.id === id,
        zIndex: w.id === id ? newZ : w.zIndex,
      })));
      setActiveWindowId(id);
      return newZ;
    });
  }, []);

  const updateWindowPosition = useCallback((id: string, x: number, y: number) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, x, y } : w));
  }, []);

  const updateWindowSize = useCallback((id: string, width: number, height: number) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, width, height } : w));
  }, []);

  const setWallpaper = useCallback((url: string) => {
    setWallpaperState(url);
    localStorage.setItem('chargeros_wallpaper', url);
  }, []);

  return (
    <DesktopContext.Provider value={{
      windows, icons, activeWindowId, wallpaper,
      openApp, closeWindow, minimizeWindow, maximizeWindow, restoreWindow,
      focusWindow, updateWindowPosition, updateWindowSize, getApp, setWallpaper, appRegistry,
    }}>
      {children}
    </DesktopContext.Provider>
  );
}

export function useDesktop() {
  const ctx = useContext(DesktopContext);
  if (!ctx) throw new Error('useDesktop must be used within DesktopProvider');
  return ctx;
}
