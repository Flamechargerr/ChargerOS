import { useState } from 'react';
import { ArrowLeft, ArrowRight, RefreshCw, Home, Plus, X, Globe, Star, StarOff, Clock } from 'lucide-react';

export default function Browser() {
  const [tabs, setTabs] = useState([{ id: '1', url: 'https://www.wikipedia.org', title: 'Wikipedia' }]);
  const [activeTab, setActiveTab] = useState('1');
  const [addressBar, setAddressBar] = useState('https://www.wikipedia.org');
  const [bookmarks, setBookmarks] = useState<{ title: string; url: string }[]>(() => {
    try { return JSON.parse(localStorage.getItem('chargeros_bookmarks') || '[]'); }
    catch { return []; }
  });
  const [showBookmarks, setShowBookmarks] = useState(false);

  const activeTabData = tabs.find(t => t.id === activeTab);

  const navigate = () => {
    let url = addressBar.trim();
    if (!url) return;
    if (!url.startsWith('http')) {
      if (url.includes('.') && !url.includes(' ')) {
        url = 'https://' + url;
      } else {
        url = 'https://duckduckgo.com/?q=' + encodeURIComponent(url);
      }
    }
    setTabs(prev => prev.map(t => t.id === activeTab ? { ...t, url, title: url } : t));
    setAddressBar(url);
  };

  const addTab = () => {
    const newTab = { id: Date.now().toString(), url: 'https://www.wikipedia.org', title: 'New Tab' };
    setTabs(prev => [...prev, newTab]);
    setActiveTab(newTab.id);
    setAddressBar(newTab.url);
  };

  const closeTab = (id: string) => {
    if (tabs.length === 1) return;
    const idx = tabs.findIndex(t => t.id === id);
    const newTabs = tabs.filter(t => t.id !== id);
    setTabs(newTabs);
    if (activeTab === id) {
      const newActive = newTabs[Math.min(idx, newTabs.length - 1)];
      setActiveTab(newActive.id);
      setAddressBar(newActive.url);
    }
  };

  const toggleBookmark = () => {
    if (!activeTabData) return;
    const exists = bookmarks.find(b => b.url === activeTabData.url);
    if (exists) {
      setBookmarks(prev => prev.filter(b => b.url !== activeTabData.url));
    } else {
      const newBm = [...bookmarks, { title: activeTabData.title, url: activeTabData.url }];
      setBookmarks(newBm);
      localStorage.setItem('chargeros_bookmarks', JSON.stringify(newBm));
    }
  };

  const isBookmarked = bookmarks.some(b => b.url === activeTabData?.url);

  return (
    <div className="flex flex-col h-full bg-[#2d2d2d]">
      {/* Tab bar */}
      <div className="flex items-center bg-[#1e1e1e] px-1 pt-1 gap-0.5 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setAddressBar(tab.url); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-t-lg min-w-[100px] max-w-[180px] transition-colors ${
              activeTab === tab.id ? 'bg-[#2d2d2d] text-white' : 'text-white/40 hover:bg-[#333] hover:text-white/60'
            }`}
          >
            <Globe size={10} />
            <span className="truncate flex-1 text-left">{tab.title}</span>
            <X size={10} onClick={(e) => { e.stopPropagation(); closeTab(tab.id); }} className="hover:text-red-400" />
          </button>
        ))}
        <button onClick={addTab} className="p-1.5 text-white/40 hover:text-white rounded hover:bg-white/10"><Plus size={14} /></button>
      </div>

      {/* Address bar */}
      <div className="flex items-center gap-2 px-3 py-2 bg-[#2d2d2d] border-b border-[#333]">
        <button onClick={() => {}} className="text-white/30 hover:text-white"><ArrowLeft size={14} /></button>
        <button onClick={() => {}} className="text-white/30 hover:text-white"><ArrowRight size={14} /></button>
        <button onClick={() => navigate()} className="text-white/30 hover:text-white"><RefreshCw size={14} /></button>
        <button onClick={() => { setAddressBar('https://www.wikipedia.org'); navigate(); }} className="text-white/30 hover:text-white"><Home size={14} /></button>
        <div className="flex-1 flex items-center bg-[#1e1e1e] rounded-lg px-3 py-1">
          <Globe size={12} className="text-white/20 mr-2" />
          <input
            type="text"
            value={addressBar}
            onChange={e => setAddressBar(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && navigate()}
            className="flex-1 bg-transparent text-white text-xs outline-none"
          />
        </div>
        <button onClick={toggleBookmark} className={isBookmarked ? 'text-[#ff9800]' : 'text-white/30 hover:text-white'}>
          {isBookmarked ? <Star size={14} fill="#ff9800" /> : <StarOff size={14} />}
        </button>
        <button onClick={() => setShowBookmarks(!showBookmarks)} className="text-white/30 hover:text-white relative">
          <Clock size={14} />
          {showBookmarks && (
            <div className="absolute top-full right-0 mt-2 bg-[#2d2d2d] border border-[#444] rounded-xl shadow-2xl py-2 w-56 z-50">
              {bookmarks.length === 0 && <p className="text-white/30 text-xs text-center py-3">No bookmarks</p>}
              {bookmarks.map((bm, i) => (
                <button
                  key={i}
                  onClick={() => { setAddressBar(bm.url); navigate(); setShowBookmarks(false); }}
                  className="w-full text-left px-4 py-2 text-xs text-white/70 hover:bg-white/10 hover:text-white truncate"
                >
                  {bm.title}
                </button>
              ))}
            </div>
          )}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 bg-white">
        {tabs.map(tab => (
          <iframe
            key={tab.id}
            src={tab.url}
            className="w-full h-full border-none"
            style={{ display: activeTab === tab.id ? 'block' : 'none' }}
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            title={tab.title}
          />
        ))}
      </div>
    </div>
  );
}
