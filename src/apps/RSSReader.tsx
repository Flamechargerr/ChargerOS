import { useState, useEffect } from 'react';
import { Rss, Plus } from 'lucide-react';

interface FeedItem {
  title: string;
  link: string;
  date: string;
  summary: string;
}

interface Feed {
  name: string;
  url: string;
  items: FeedItem[];
}

const defaultFeeds: Feed[] = [
  {
    name: 'Linux News',
    url: 'https://linux.org',
    items: [
      { title: 'Linux Kernel 6.8 Released with New Features', link: '#', date: '2024-03-10', summary: 'The latest kernel release brings improved hardware support and performance optimizations...' },
      { title: 'Ubuntu 24.04 LTS Beta Now Available', link: '#', date: '2024-03-08', summary: 'The next long-term support release of Ubuntu is now in beta with GNOME 46...' },
      { title: 'Rust in Linux: Progress Report', link: '#', date: '2024-03-05', summary: 'The integration of Rust into the Linux kernel continues with new driver support...' },
    ],
  },
  {
    name: 'Tech News',
    url: 'https://techcrunch.com',
    items: [
      { title: 'WebAssembly: The Future of Web Development', link: '#', date: '2024-03-09', summary: 'WebAssembly is gaining traction as a portable compilation target for web applications...' },
      { title: 'Open Source Security Best Practices', link: '#', date: '2024-03-07', summary: 'A comprehensive guide to securing your open source projects and dependencies...' },
    ],
  },
  {
    name: 'Programming',
    url: 'https://dev.to',
    items: [
      { title: 'Building a Desktop Environment in the Browser', link: '#', date: '2024-03-06', summary: 'How to create a fully functional OS-like experience using modern web technologies...' },
      { title: 'TypeScript Tips for Large Projects', link: '#', date: '2024-03-04', summary: 'Advanced TypeScript patterns for maintaining type safety at scale...' },
      { title: 'React Performance Optimization Guide', link: '#', date: '2024-03-02', summary: 'Techniques for improving React app performance including memoization and code splitting...' },
    ],
  },
];

export default function RSSReader() {
  const [feeds, setFeeds] = useState<Feed[]>(() => {
    try { return JSON.parse(localStorage.getItem('chargeros_feeds') || '[]'); }
    catch { return []; }
  });
  const [activeFeed, setActiveFeed] = useState(0);
  const [selectedItem, setSelectedItem] = useState<FeedItem | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newUrl, setNewUrl] = useState('');

  useEffect(() => {
    if (feeds.length === 0) setFeeds(defaultFeeds);
  }, []);

  const allFeeds = feeds.length > 0 ? feeds : defaultFeeds;

  return (
    <div className="flex h-full bg-[#2d2d2d]">
      <div className="w-52 bg-[#252526] border-r border-[#333] py-2 overflow-y-auto">
        <div className="flex items-center justify-between px-4 py-2">
          <span className="text-white/40 text-xs uppercase">Feeds</span>
          <button onClick={() => setShowAdd(true)} className="text-white/40 hover:text-[#4a9eff]"><Plus size={14} /></button>
        </div>
        {allFeeds.map((feed, i) => (
          <button
            key={i}
            onClick={() => { setActiveFeed(i); setSelectedItem(null); }}
            className={`w-full text-left px-4 py-2 text-sm transition-colors ${
              activeFeed === i ? 'bg-[#37373d] text-white' : 'text-white/60 hover:bg-white/10 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <Rss size={12} className={activeFeed === i ? 'text-[#ff9800]' : 'text-white/30'} />
              {feed.name}
            </div>
            <span className="text-white/30 text-[10px] ml-5">{feed.items.length} items</span>
          </button>
        ))}
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {selectedItem ? (
          <div className="flex-1 overflow-auto p-6">
            <button onClick={() => setSelectedItem(null)} className="text-[#4a9eff] text-sm mb-4">&larr; Back</button>
            <h2 className="text-white text-lg font-medium mb-2">{selectedItem.title}</h2>
            <p className="text-white/40 text-xs mb-4">{selectedItem.date}</p>
            <p className="text-white/70 text-sm leading-relaxed">{selectedItem.summary}</p>
          </div>
        ) : (
          <div className="flex-1 overflow-auto">
            <div className="px-4 py-3 bg-[#252526] border-b border-[#333]">
              <h3 className="text-white font-medium">{allFeeds[activeFeed]?.name}</h3>
            </div>
            {allFeeds[activeFeed]?.items.map((item, i) => (
              <button
                key={i}
                onClick={() => setSelectedItem(item)}
                className="w-full text-left px-4 py-3 border-b border-white/5 hover:bg-white/5 transition-colors"
              >
                <p className="text-white text-sm font-medium">{item.title}</p>
                <p className="text-white/40 text-xs mt-1">{item.date}</p>
                <p className="text-white/50 text-xs mt-1 line-clamp-2">{item.summary}</p>
              </button>
            ))}
          </div>
        )}
      </div>

      {showAdd && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-[#2d2d2d] border border-[#444] rounded-xl p-6 w-80">
            <h3 className="text-white font-medium mb-4">Add Feed</h3>
            <input type="text" placeholder="Feed URL" value={newUrl} onChange={e => setNewUrl(e.target.value)} className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 outline-none mb-4" />
            <div className="flex gap-2">
              <button onClick={() => setShowAdd(false)} className="flex-1 py-2 text-sm text-white/60 hover:bg-white/10 rounded-lg">Cancel</button>
              <button onClick={() => { setFeeds(prev => [...prev, { name: 'New Feed', url: newUrl, items: [] }]); setShowAdd(false); }} className="flex-1 py-2 text-sm bg-[#4a9eff] text-white rounded-lg">Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

