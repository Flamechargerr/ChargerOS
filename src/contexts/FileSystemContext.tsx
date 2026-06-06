import React, { createContext, useContext, useState, useCallback } from 'react';
import type { FileNode } from '@/types';

const defaultFileSystem: FileNode = {
  name: '/',
  type: 'folder',
  created: Date.now(),
  modified: Date.now(),
  children: [
    {
      name: 'home',
      type: 'folder',
      created: Date.now(),
      modified: Date.now(),
      children: [
        {
          name: 'user',
          type: 'folder',
          created: Date.now(),
          modified: Date.now(),
          children: [
            {
              name: 'Documents',
              type: 'folder',
              created: Date.now(),
              modified: Date.now(),
              children: [
                { name: 'readme.txt', type: 'file', content: 'Welcome to ChargerOS!\n\nThis is a fully functional web-based Linux desktop environment with 59 built-in apps.\n\nExplore the system and have fun!', created: Date.now(), modified: Date.now(), size: 128 },
                { name: 'todo.txt', type: 'file', content: '- Explore all 59 apps\n- Try the Terminal commands\n- Play some games\n- Customize your desktop', created: Date.now(), modified: Date.now(), size: 72 },
              ],
            },
            { name: 'Downloads', type: 'folder', created: Date.now(), modified: Date.now(), children: [] },
            { name: 'Music', type: 'folder', created: Date.now(), modified: Date.now(), children: [] },
            { name: 'Pictures', type: 'folder', created: Date.now(), modified: Date.now(), children: [] },
            { name: 'Videos', type: 'folder', created: Date.now(), modified: Date.now(), children: [] },
            {
              name: 'Desktop',
              type: 'folder',
              created: Date.now(),
              modified: Date.now(),
              children: [],
            },
          ],
        },
      ],
    },
    {
      name: 'bin',
      type: 'folder',
      created: Date.now(),
      modified: Date.now(),
      children: [],
    },
    {
      name: 'etc',
      type: 'folder',
      created: Date.now(),
      modified: Date.now(),
      children: [
        { name: 'hostname', type: 'file', content: 'chargeros', created: Date.now(), modified: Date.now(), size: 12 },
        { name: 'os-release', type: 'file', content: 'NAME="ChargerOS"\nVERSION="1.0"\nID=chargeros\nPRETTY_NAME="ChargerOS 1.0"', created: Date.now(), modified: Date.now(), size: 64 },
      ],
    },
    {
      name: 'tmp',
      type: 'folder',
      created: Date.now(),
      modified: Date.now(),
      children: [],
    },
    {
      name: 'var',
      type: 'folder',
      created: Date.now(),
      modified: Date.now(),
      children: [
        { name: 'log', type: 'folder', created: Date.now(), modified: Date.now(), children: [] },
      ],
    },
    {
      name: 'usr',
      type: 'folder',
      created: Date.now(),
      modified: Date.now(),
      children: [
        {
          name: 'share',
          type: 'folder',
          created: Date.now(),
          modified: Date.now(),
          children: [
            {
              name: 'applications',
              type: 'folder',
              created: Date.now(),
              modified: Date.now(),
              children: [],
            },
            {
              name: 'wallpapers',
              type: 'folder',
              created: Date.now(),
              modified: Date.now(),
              children: [],
            },
          ],
        },
      ],
    },
  ],
};

interface FileSystemContextType {
  fs: FileNode;
  readFile: (path: string) => string | null;
  writeFile: (path: string, content: string) => void;
  deleteFile: (path: string) => void;
  createFolder: (path: string) => void;
  listDir: (path: string) => FileNode[];
  fileExists: (path: string) => boolean;
  getNode: (path: string) => FileNode | null;
  rename: (oldPath: string, newName: string) => void;
  move: (srcPath: string, dstPath: string) => void;
  getSize: (path: string) => number;
}

const FileSystemContext = createContext<FileSystemContextType | null>(null);

function getPathParts(path: string): string[] {
  return path.split('/').filter(p => p.length > 0);
}

function findNode(root: FileNode, path: string): FileNode | null {
  if (path === '/' || path === '') return root;
  const parts = getPathParts(path);
  let current = root;
  for (const part of parts) {
    if (!current.children) return null;
    const child = current.children.find(c => c.name === part);
    if (!child) return null;
    current = child;
  }
  return current;
}

function findParent(root: FileNode, path: string): FileNode | null {
  const parts = getPathParts(path);
  if (parts.length === 0) return null;
  const parentPath = '/' + parts.slice(0, -1).join('/');
  return findNode(root, parentPath);
}

function cloneFs(fs: FileNode): FileNode {
  return JSON.parse(JSON.stringify(fs));
}

export function FileSystemProvider({ children }: { children: React.ReactNode }) {
  const [fs, setFs] = useState<FileNode>(() => {
    try {
      const saved = localStorage.getItem('chargeros_files');
      if (saved) return JSON.parse(saved);
    } catch { /* ignore */ }
    return cloneFs(defaultFileSystem);
  });

  const persist = useCallback((newFs: FileNode) => {
    setFs(newFs);
    try {
      localStorage.setItem('chargeros_files', JSON.stringify(newFs));
    } catch { /* ignore quota errors */ }
  }, []);

  const readFile = useCallback((path: string): string | null => {
    const node = findNode(fs, path);
    if (node && node.type === 'file') return node.content || '';
    return null;
  }, [fs]);

  const writeFile = useCallback((path: string, content: string) => {
    const newFs = cloneFs(fs);
    const parts = getPathParts(path);
    const fileName = parts[parts.length - 1];
    const parentPath = '/' + parts.slice(0, -1).join('/');
    const parent = findNode(newFs, parentPath);
    if (!parent || !parent.children) return;
    const existing = parent.children.find(c => c.name === fileName);
    if (existing) {
      existing.content = content;
      existing.modified = Date.now();
      existing.size = new Blob([content]).size;
    } else {
      parent.children.push({
        name: fileName,
        type: 'file',
        content,
        created: Date.now(),
        modified: Date.now(),
        size: new Blob([content]).size,
      });
    }
    persist(newFs);
  }, [fs, persist]);

  const deleteFile = useCallback((path: string) => {
    const newFs = cloneFs(fs);
    const parent = findParent(newFs, path);
    if (!parent || !parent.children) return;
    const parts = getPathParts(path);
    const fileName = parts[parts.length - 1];
    parent.children = parent.children.filter(c => c.name !== fileName);
    persist(newFs);
  }, [fs, persist]);

  const createFolder = useCallback((path: string) => {
    const newFs = cloneFs(fs);
    const parts = getPathParts(path);
    const folderName = parts[parts.length - 1];
    const parentPath = '/' + parts.slice(0, -1).join('/');
    const parent = findNode(newFs, parentPath);
    if (!parent || !parent.children) return;
    if (!parent.children.find(c => c.name === folderName)) {
      parent.children.push({
        name: folderName,
        type: 'folder',
        created: Date.now(),
        modified: Date.now(),
        children: [],
      });
    }
    persist(newFs);
  }, [fs, persist]);

  const listDir = useCallback((path: string): FileNode[] => {
    const node = findNode(fs, path);
    if (node && node.type === 'folder' && node.children) {
      return [...node.children];
    }
    return [];
  }, [fs]);

  const fileExists = useCallback((path: string): boolean => {
    return findNode(fs, path) !== null;
  }, [fs]);

  const getNode = useCallback((path: string): FileNode | null => {
    return findNode(fs, path);
  }, [fs]);

  const rename = useCallback((oldPath: string, newName: string) => {
    const newFs = cloneFs(fs);
    const node = findNode(newFs, oldPath);
    if (node) {
      node.name = newName;
      node.modified = Date.now();
    }
    persist(newFs);
  }, [fs, persist]);

  const move = useCallback((srcPath: string, dstPath: string) => {
    const newFs = cloneFs(fs);
    const srcNode = findNode(newFs, srcPath);
    if (!srcNode) return;
    const srcParent = findParent(newFs, srcPath);
    if (srcParent && srcParent.children) {
      srcParent.children = srcParent.children.filter(c => c.name !== srcNode.name);
    }
    const dstNode = findNode(newFs, dstPath);
    if (dstNode && dstNode.type === 'folder' && dstNode.children) {
      dstNode.children.push(srcNode);
    }
    persist(newFs);
  }, [fs, persist]);

  const getSize = useCallback((path: string): number => {
    const node = findNode(fs, path);
    if (!node) return 0;
    if (node.type === 'file') return node.size || 0;
    if (node.children) {
      return node.children.reduce((sum, child) => sum + getSize(path + '/' + child.name), 0);
    }
    return 0;
  }, [fs]);

  return (
    <FileSystemContext.Provider value={{
      fs, readFile, writeFile, deleteFile, createFolder, listDir, fileExists, getNode, rename, move, getSize,
    }}>
      {children}
    </FileSystemContext.Provider>
  );
}

export function useFileSystem() {
  const ctx = useContext(FileSystemContext);
  if (!ctx) throw new Error('useFileSystem must be used within FileSystemProvider');
  return ctx;
}
