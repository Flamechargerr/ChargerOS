import { useState } from 'react';
import { useFileSystem } from '@/contexts/FileSystemContext';
import { useDesktop } from '@/contexts/DesktopContext';
import { FolderOpen, File, Home, Trash2, ArrowLeft, FolderPlus, FilePlus, Grid, List, Download } from 'lucide-react';

export default function FileManager() {
  const { listDir, readFile, writeFile, deleteFile, createFolder, getNode } = useFileSystem();
  const { openApp } = useDesktop();
  const [currentPath, setCurrentPath] = useState('/home/user');
  const [viewMode, setViewMode] = useState<'icon' | 'list'>('icon');
  const [searchQuery] = useState('');
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const items = listDir(currentPath);
  const filteredItems = searchQuery
    ? items.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : items;

  const navigateTo = (name: string) => {
    const newPath = currentPath === '/' ? `/${name}` : `${currentPath}/${name}`;
    const node = getNode(newPath);
    if (node?.type === 'folder') {
      setCurrentPath(newPath);
      setSelectedFile(null);
    } else if (node?.type === 'file') {
      openFile(newPath);
    }
  };

  const openFile = (path: string) => {
    const content = readFile(path);
    if (content !== null) {
      if (path.endsWith('.txt') || path.endsWith('.md')) {
        openApp('texteditor', { filePath: path, content });
      } else if (path.endsWith('.json') || path.endsWith('.js') || path.endsWith('.ts') || path.endsWith('.html') || path.endsWith('.css')) {
        openApp('codeeditor', { filePath: path, content });
      } else {
        setSelectedFile(path);
      }
    }
  };

  const goUp = () => {
    if (currentPath === '/') return;
    const parts = currentPath.split('/').filter(Boolean);
    parts.pop();
    setCurrentPath('/' + parts.join('/'));
  };

  const handleNewFolder = () => {
    const name = prompt('Folder name:');
    if (name) {
      const path = `${currentPath}/${name}`;
      createFolder(path);
    }
  };

  const handleNewFile = () => {
    const name = prompt('File name:');
    if (name) {
      const path = `${currentPath}/${name}`;
      writeFile(path, '');
    }
  };

  const handleDelete = () => {
    if (selectedFile) {
      if (confirm(`Delete ${selectedFile.split('/').pop()}?`)) {
        deleteFile(selectedFile);
        setSelectedFile(null);
      }
    }
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const content = ev.target?.result as string;
        const path = `${currentPath}/${file.name}`;
        writeFile(path, content);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#2d2d2d]">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-3 py-2 bg-[#252526] border-b border-[#333]">
        <button onClick={goUp} className="p-1.5 rounded-md hover:bg-white/10 text-white/60 hover:text-white"><ArrowLeft size={16} /></button>
        <button onClick={() => setCurrentPath('/home/user')} className="p-1.5 rounded-md hover:bg-white/10 text-white/60 hover:text-white"><Home size={16} /></button>
        <div className="flex-1 flex items-center bg-white/5 rounded-md px-3 py-1.5 text-sm text-white/80">
          <span className="text-white/40 mr-1">~</span>
          {currentPath.replace('/home/user', '') || '/'}
        </div>
        <button onClick={handleNewFolder} className="p-1.5 rounded-md hover:bg-white/10 text-white/60 hover:text-white" title="New Folder"><FolderPlus size={16} /></button>
        <button onClick={handleNewFile} className="p-1.5 rounded-md hover:bg-white/10 text-white/60 hover:text-white" title="New File"><FilePlus size={16} /></button>
        <label className="p-1.5 rounded-md hover:bg-white/10 text-white/60 hover:text-white cursor-pointer" title="Upload">
          <Download size={16} />
          <input type="file" className="hidden" onChange={handleUpload} />
        </label>
        <div className="flex bg-white/5 rounded-md overflow-hidden">
          <button onClick={() => setViewMode('icon')} className={`p-1.5 ${viewMode === 'icon' ? 'bg-white/20 text-white' : 'text-white/40'}`}><Grid size={14} /></button>
          <button onClick={() => setViewMode('list')} className={`p-1.5 ${viewMode === 'list' ? 'bg-white/20 text-white' : 'text-white/40'}`}><List size={14} /></button>
        </div>
        {selectedFile && (
          <button onClick={handleDelete} className="p-1.5 rounded-md hover:bg-red-500/20 text-red-400" title="Delete"><Trash2 size={16} /></button>
        )}
      </div>

      {/* Main area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-48 bg-[#252526] border-r border-[#333] py-2 overflow-y-auto scrollbar-thin">
          {['Home', 'Documents', 'Downloads', 'Music', 'Pictures', 'Videos', 'Desktop'].map(name => (
            <button
              key={name}
              onClick={() => setCurrentPath(`/home/user/${name}`)}
              className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 transition-colors ${
                currentPath === `/home/user/${name}` ? 'bg-[#37373d] text-white' : 'text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              <FolderOpen size={14} />
              {name}
            </button>
          ))}
          <div className="border-t border-white/10 mt-2 pt-2">
            <button
              onClick={() => setCurrentPath('/tmp')}
              className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 transition-colors text-white/60 hover:bg-white/10 hover:text-white`}
            >
              <Trash2 size={14} />
              Trash
            </button>
          </div>
        </div>

        {/* File list */}
        <div className="flex-1 overflow-auto p-4">
          {viewMode === 'icon' ? (
            <div className="grid grid-cols-6 gap-4">
              {filteredItems.map(item => (
                <button
                  key={item.name}
                  onClick={() => { setSelectedFile(`${currentPath}/${item.name}`); navigateTo(item.name); }}
                  onDoubleClick={() => navigateTo(item.name)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-lg transition-colors ${
                    selectedFile?.endsWith(item.name) ? 'bg-[#4a9eff]/20' : 'hover:bg-white/10'
                  }`}
                >
                  {item.type === 'folder' ? (
                    <FolderOpen size={40} className="text-[#4a9eff]" />
                  ) : (
                    <File size={40} className="text-[#ccc]" />
                  )}
                  <span className="text-xs text-white/80 text-center truncate w-full">{item.name}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="w-full">
              <div className="grid grid-cols-[1fr_80px_120px] gap-2 text-xs text-white/40 px-3 py-2 border-b border-white/10">
                <span>Name</span>
                <span>Size</span>
                <span>Modified</span>
              </div>
              {filteredItems.map(item => (
                <button
                  key={item.name}
                  onClick={() => { setSelectedFile(`${currentPath}/${item.name}`); navigateTo(item.name); }}
                  onDoubleClick={() => navigateTo(item.name)}
                  className={`w-full grid grid-cols-[1fr_80px_120px] gap-2 text-sm px-3 py-2 text-left transition-colors ${
                    selectedFile?.endsWith(item.name) ? 'bg-[#4a9eff]/20' : 'hover:bg-white/5'
                  }`}
                >
                  <span className="flex items-center gap-2 text-white/80 truncate">
                    {item.type === 'folder' ? <FolderOpen size={14} className="text-[#4a9eff]" /> : <File size={14} className="text-[#ccc]" />}
                    {item.name}
                  </span>
                  <span className="text-white/40">{item.size ? `${(item.size / 1024).toFixed(1)} KB` : '--'}</span>
                  <span className="text-white/40">{new Date(item.modified).toLocaleDateString()}</span>
                </button>
              ))}
            </div>
          )}
          {filteredItems.length === 0 && (
            <div className="flex items-center justify-center h-48 text-white/30 text-sm">Folder is empty</div>
          )}
        </div>
      </div>
    </div>
  );
}
