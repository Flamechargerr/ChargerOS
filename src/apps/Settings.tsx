import { useState } from 'react';
import { useDesktop } from '@/contexts/DesktopContext';
import { useAuth } from '@/contexts/AuthContext';
import { Palette, Image, Type, Clock, Monitor, Wifi, Bluetooth, Bell, Shield, User, Globe, Volume2 } from 'lucide-react';

const categories = [
  { id: 'appearance', name: 'Appearance', icon: Palette },
  { id: 'background', name: 'Background', icon: Image },
  { id: 'network', name: 'Network', icon: Wifi },
  { id: 'bluetooth', name: 'Bluetooth', icon: Bluetooth },
  { id: 'notifications', name: 'Notifications', icon: Bell },
  { id: 'display', name: 'Display', icon: Monitor },
  { id: 'sound', name: 'Sound', icon: Volume2 },
  { id: 'privacy', name: 'Privacy', icon: Shield },
  { id: 'users', name: 'Users', icon: User },
  { id: 'language', name: 'Language', icon: Globe },
  { id: 'datetime', name: 'Date & Time', icon: Clock },
  { id: 'about', name: 'About', icon: Type },
];

const wallpapers = [
  '/wallpapers/desktop-default.jpg',
  '/wallpapers/login-bg.jpg',
  'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
  'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
  'linear-gradient(135deg, #000428 0%, #004e92 100%)',
  'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
  'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
  'linear-gradient(135deg, #232526 0%, #414345 100%)',
];

export default function Settings() {
  const [activeCategory, setActiveCategory] = useState('appearance');
  const { wallpaper, setWallpaper } = useDesktop();
  const { username } = useAuth();
  const [accentColor, setAccentColor] = useState('#4a9eff');

  const colors = ['#4a9eff', '#ff6b6b', '#4ecdc4', '#45b7d1', '#f7b731', '#5f27cd', '#00d2d3', '#ff9ff3', '#54a0ff'];

  const renderContent = () => {
    switch (activeCategory) {
      case 'appearance':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-white font-medium mb-3">Accent Color</h3>
              <div className="flex gap-3">
                {colors.map(c => (
                  <button
                    key={c}
                    onClick={() => setAccentColor(c)}
                    className={`w-8 h-8 rounded-full transition-transform hover:scale-110 ${accentColor === c ? 'ring-2 ring-white ring-offset-2 ring-offset-[#2d2d2d]' : ''}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-white font-medium mb-3">Theme</h3>
              <div className="flex gap-3">
                <button className="flex-1 bg-[#252526] border border-[#4a9eff] rounded-lg p-4 text-center">
                  <div className="w-full h-16 bg-[#1e1e1e] rounded mb-2" />
                  <span className="text-white text-sm">Dark</span>
                </button>
                <button className="flex-1 bg-[#f0f0f0] border border-[#ccc] rounded-lg p-4 text-center opacity-50 cursor-not-allowed">
                  <div className="w-full h-16 bg-white rounded mb-2" />
                  <span className="text-gray-800 text-sm">Light (N/A)</span>
                </button>
              </div>
            </div>
          </div>
        );
      case 'background':
        return (
          <div>
            <h3 className="text-white font-medium mb-3">Wallpaper</h3>
            <div className="grid grid-cols-4 gap-3">
              {wallpapers.map((wp, i) => (
                <button
                  key={i}
                  onClick={() => setWallpaper(wp)}
                  className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
                    wallpaper === wp ? 'border-[#4a9eff]' : 'border-transparent'
                  }`}
                  style={wp.startsWith('linear') ? { background: wp } : {
                    backgroundImage: `url(${wp})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  {wallpaper === wp && (
                    <div className="absolute top-1 right-1 w-4 h-4 bg-[#4a9eff] rounded-full flex items-center justify-center">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                        <path d="M5 12l5 5L20 7" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        );
      case 'users':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-[#252526] rounded-lg">
              <div className="w-16 h-16 rounded-full bg-[#4a9eff] flex items-center justify-center text-white text-2xl font-medium">
                {username?.[0]?.toUpperCase() || 'U'}
              </div>
              <div>
                <h3 className="text-white font-medium">{username || 'User'}</h3>
                <p className="text-white/40 text-sm">Administrator</p>
              </div>
            </div>
          </div>
        );
      case 'about':
        return (
          <div className="space-y-4">
            <div className="text-center py-8">
              <h2 className="text-2xl text-white font-bold mb-2">ChargerOS</h2>
              <p className="text-white/40">Version 1.0</p>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b border-white/10"><span className="text-white/60">OS Name</span><span className="text-white">ChargerOS</span></div>
              <div className="flex justify-between py-2 border-b border-white/10"><span className="text-white/60">Kernel</span><span className="text-white">simulated-browser</span></div>
              <div className="flex justify-between py-2 border-b border-white/10"><span className="text-white/60">Shell</span><span className="text-white">websh</span></div>
              <div className="flex justify-between py-2 border-b border-white/10"><span className="text-white/60">Browser</span><span className="text-white">{navigator.userAgent.split(' ').slice(-1)[0]?.replace('/', ' ')}</span></div>
              <div className="flex justify-between py-2 border-b border-white/10"><span className="text-white/60">Resolution</span><span className="text-white">{window.innerWidth}x{window.innerHeight}</span></div>
              <div className="flex justify-between py-2 border-b border-white/10"><span className="text-white/60">Language</span><span className="text-white">{navigator.language}</span></div>
              <div className="flex justify-between py-2"><span className="text-white/60">Platform</span><span className="text-white">{navigator.platform}</span></div>
            </div>
          </div>
        );
      case 'network':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-[#252526] rounded-lg">
              <div className="flex items-center gap-3">
                <Wifi size={20} className="text-[#4a9eff]" />
                <div>
                  <p className="text-white text-sm">Wi-Fi</p>
                  <p className="text-white/40 text-xs">Connected</p>
                </div>
              </div>
              <div className="w-10 h-6 bg-[#4a9eff] rounded-full relative cursor-pointer">
                <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1" />
              </div>
            </div>
            <div className="p-4 bg-[#252526] rounded-lg">
              <p className="text-white/60 text-xs mb-2">Network Name</p>
              <p className="text-white text-sm">HomeNetwork_5G</p>
            </div>
          </div>
        );
      case 'notifications':
        return (
          <div className="space-y-4">
            {['App Notifications', 'System Sounds', 'Do Not Disturb', 'Show on Lock Screen'].map((setting, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-[#252526] rounded-lg">
                <span className="text-white text-sm">{setting}</span>
                <div className={`w-10 h-6 rounded-full relative cursor-pointer ${i < 2 ? 'bg-[#4a9eff]' : 'bg-white/20'}`}>
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${i < 2 ? 'right-1' : 'left-1'}`} />
                </div>
              </div>
            ))}
          </div>
        );
      default:
        return (
          <div className="text-center py-12 text-white/40">
            <p>This settings page is coming soon.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-full bg-[#2d2d2d]">
      {/* Sidebar */}
      <div className="w-56 bg-[#252526] border-r border-[#333] py-2 overflow-y-auto scrollbar-thin">
        {categories.map(cat => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 transition-colors ${
                activeCategory === cat.id ? 'bg-[#37373d] text-white' : 'text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon size={16} />
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <h2 className="text-xl text-white font-medium mb-6">
          {categories.find(c => c.id === activeCategory)?.name}
        </h2>
        {renderContent()}
      </div>
    </div>
  );
}
