export interface FileNode {
  name: string;
  type: 'file' | 'folder';
  content?: string;
  children?: FileNode[];
  created: number;
  modified: number;
  size?: number;
  mimeType?: string;
}

export interface WindowState {
  id: string;
  appId: string;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isMinimized: boolean;
  isMaximized: boolean;
  isActive: boolean;
  zIndex: number;
  data?: any;
}

export interface AppDefinition {
  id: string;
  name: string;
  icon: string;
  category: string;
  description: string;
  component: string;
  defaultWidth: number;
  defaultHeight: number;
  minWidth?: number;
  minHeight?: number;
  singleInstance?: boolean;
}

export interface DesktopIcon {
  id: string;
  appId: string;
  name: string;
  x: number;
  y: number;
}

export interface CalendarEvent {
  id: string;
  date: string;
  title: string;
  time: string;
  description: string;
  color: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  color: string;
  pinned: boolean;
  created: number;
}

export interface TodoTask {
  id: string;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  list: string;
  created: number;
}

export interface ChatMessage {
  id: string;
  channel: string;
  sender: string;
  text: string;
  timestamp: number;
}

export interface EmailMessage {
  id: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  folder: string;
  read: boolean;
  timestamp: number;
}

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  path: string;
}

export interface BrowserTab {
  id: string;
  url: string;
  title: string;
}

export interface ProcessInfo {
  pid: number;
  name: string;
  cpu: number;
  memory: number;
  status: 'running' | 'sleeping' | 'zombie';
}

export interface UserCredentials {
  username: string;
  password: string;
  avatar?: string;
}

export interface SystemSettings {
  wallpaper: string;
  theme: 'dark' | 'light';
  accentColor: string;
  panelPosition: 'top' | 'bottom';
  showDesktopIcons: boolean;
  clockFormat: '12h' | '24h';
}
