import { useState, useEffect } from 'react';
import { useDesktop } from '@/contexts/DesktopContext';
import { Volume2, Wifi, Battery, Settings, Power, Bell, Moon } from 'lucide-react';

export default function TopPanel() {
  const { openApp, windows } = useDesktop();
  const [time, setTime] = useState(new Date());
  const [showMenu, setShowMenu] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const openWindows = windows.filter(w => !w.isMinimized);

  return (
    <div className="fixed top-0 left-0 right-0 h-10 bg-[#1e1e1e]/90 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-3 z-[9990]">
      {/* Left: Activities */}
      <button
        onClick={() => openApp('filemanager')}
        className="text-white/80 hover:text-white text-sm font-medium px-3 py-1 rounded-md hover:bg-white/10 transition-colors"
      >
        Activities
      </button>

      {/* Center: Clock */}
      <div className="relative">
        <button
          onClick={() => setShowCalendar(!showCalendar)}
          className="text-white/80 hover:text-white text-sm px-4 py-1 rounded-md hover:bg-white/10 transition-colors tabular-nums"
        >
          {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
        </button>
        {showCalendar && (
          <>
            <div className="fixed inset-0 z-[9980]" onClick={() => setShowCalendar(false)} />
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-[#2d2d2d] border border-[#444] rounded-xl shadow-2xl p-4 z-[9991] w-72">
              <MiniCalendar />
            </div>
          </>
        )}
      </div>

      {/* Right: System indicators */}
      <div className="flex items-center gap-1">
        {openWindows.length > 0 && (
          <span className="text-white/40 text-xs mr-2">{openWindows.length} window{openWindows.length > 1 ? 's' : ''}</span>
        )}
        <button className="p-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded-md transition-colors">
          <Bell size={14} />
        </button>
        <button className="p-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded-md transition-colors">
          <Wifi size={14} />
        </button>
        <button className="p-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded-md transition-colors">
          <Volume2 size={14} />
        </button>
        <button className="p-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded-md transition-colors">
          <Battery size={14} />
        </button>
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded-md transition-colors"
          >
            <Power size={14} />
          </button>
          {showMenu && (
            <>
              <div className="fixed inset-0 z-[9980]" onClick={() => setShowMenu(false)} />
              <div className="absolute top-full right-0 mt-2 bg-[#2d2d2d] border border-[#444] rounded-xl shadow-2xl py-2 z-[9991] w-48">
                <button
                  onClick={() => { openApp('settings'); setShowMenu(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors text-left"
                >
                  <Settings size={14} />
                  Settings
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors text-left">
                  <Moon size={14} />
                  Dark Mode
                </button>
                <div className="border-t border-white/10 my-1" />
                <button
                  onClick={() => window.location.reload()}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors text-left"
                >
                  <Power size={14} />
                  Log Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function MiniCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const today = new Date();

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <div className="flex items-center justify-between mb-3">
        <button onClick={prevMonth} className="text-white/60 hover:text-white p-1">&lt;</button>
        <span className="text-white text-sm font-medium">
          {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </span>
        <button onClick={nextMonth} className="text-white/60 hover:text-white p-1">&gt;</button>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
          <div key={d} className="text-center text-[10px] text-white/40 py-1">{d}</div>
        ))}
        {days.map((day, i) => (
          <div
            key={i}
            className={`text-center text-xs py-1.5 rounded-md ${
              day === null ? '' :
              day === today.getDate() && currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear()
                ? 'bg-[#4a9eff] text-white'
                : 'text-white/70 hover:bg-white/10 cursor-pointer'
            }`}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  );
}
