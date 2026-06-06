import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Plus, Bell } from 'lucide-react';

type Tab = 'clock' | 'alarm' | 'stopwatch' | 'timer';

export default function Clock() {
  const [activeTab, setActiveTab] = useState<Tab>('clock');

  const tabs: { id: Tab; label: string }[] = [
    { id: 'clock', label: 'Clock' },
    { id: 'alarm', label: 'Alarm' },
    { id: 'stopwatch', label: 'Stopwatch' },
    { id: 'timer', label: 'Timer' },
  ];

  return (
    <div className="flex flex-col h-full bg-[#2d2d2d]">
      <div className="flex border-b border-[#333]">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-3 text-sm transition-colors ${
              activeTab === tab.id ? 'text-[#4a9eff] border-b-2 border-[#4a9eff]' : 'text-white/40 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-auto p-4">
        {activeTab === 'clock' && <WorldClock />}
        {activeTab === 'alarm' && <Alarm />}
        {activeTab === 'stopwatch' && <Stopwatch />}
        {activeTab === 'timer' && <Timer />}
      </div>
    </div>
  );
}

function WorldClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const cities = [
    { name: 'Local', tz: undefined },
    { name: 'New York', tz: 'America/New_York' },
    { name: 'London', tz: 'Europe/London' },
    { name: 'Tokyo', tz: 'Asia/Tokyo' },
    { name: 'Sydney', tz: 'Australia/Sydney' },
  ];

  return (
    <div className="space-y-4">
      <div className="text-center py-6">
        <div className="text-5xl text-white font-light tabular-nums">
          {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
        </div>
        <div className="text-white/40 text-sm mt-2">
          {time.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </div>
      </div>
      <div className="space-y-2">
        {cities.map(city => (
          <div key={city.name} className="flex items-center justify-between px-4 py-3 bg-[#252526] rounded-lg">
            <span className="text-white text-sm">{city.name}</span>
            <span className="text-white/60 text-sm tabular-nums">
              {time.toLocaleTimeString('en-US', { timeZone: city.tz, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Alarm() {
  const [alarms, setAlarms] = useState<{ id: number; time: string; label: string; active: boolean }[]>(() => {
    try { return JSON.parse(localStorage.getItem('chargeros_alarms') || '[]'); }
    catch { return []; }
  });
  const [showAdd, setShowAdd] = useState(false);
  const [newAlarm, setNewAlarm] = useState({ time: '08:00', label: 'Alarm' });

  useEffect(() => {
    localStorage.setItem('chargeros_alarms', JSON.stringify(alarms));
  }, [alarms]);

  const addAlarm = () => {
    setAlarms(prev => [...prev, { id: Date.now(), ...newAlarm, active: true }]);
    setShowAdd(false);
  };

  return (
    <div>
      <button onClick={() => setShowAdd(true)} className="w-full py-3 border border-dashed border-white/20 rounded-lg text-white/40 hover:border-[#4a9eff] hover:text-[#4a9eff] transition-colors flex items-center justify-center gap-2 mb-4">
        <Plus size={16} /> Add Alarm
      </button>
      <div className="space-y-2">
        {alarms.map(alarm => (
          <div key={alarm.id} className="flex items-center justify-between px-4 py-3 bg-[#252526] rounded-lg">
            <div className="flex items-center gap-3">
              <Bell size={16} className={alarm.active ? 'text-[#ff9800]' : 'text-white/20'} />
              <div>
                <p className="text-white text-lg tabular-nums">{alarm.time}</p>
                <p className="text-white/40 text-xs">{alarm.label}</p>
              </div>
            </div>
            <button
              onClick={() => setAlarms(prev => prev.map(a => a.id === alarm.id ? { ...a, active: !a.active } : a))}
              className={`w-10 h-6 rounded-full relative cursor-pointer transition-colors ${alarm.active ? 'bg-[#4a9eff]' : 'bg-white/20'}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${alarm.active ? 'right-1' : 'left-1'}`} />
            </button>
          </div>
        ))}
      </div>
      {showAdd && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-[#2d2d2d] border border-[#444] rounded-xl p-6 w-72">
            <h3 className="text-white font-medium mb-4">Add Alarm</h3>
            <div className="space-y-3">
              <input type="time" value={newAlarm.time} onChange={e => setNewAlarm(prev => ({ ...prev, time: e.target.value }))} className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm text-white" />
              <input type="text" value={newAlarm.label} onChange={e => setNewAlarm(prev => ({ ...prev, label: e.target.value }))} className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30" placeholder="Label" />
              <div className="flex gap-2 mt-4">
                <button onClick={() => setShowAdd(false)} className="flex-1 py-2 text-sm text-white/60 hover:bg-white/10 rounded-lg">Cancel</button>
                <button onClick={addAlarm} className="flex-1 py-2 text-sm bg-[#4a9eff] text-white rounded-lg hover:bg-[#3d8de6]">Add</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Stopwatch() {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const startTime = useRef(0);
  const raf = useRef(0);

  useEffect(() => {
    if (running) {
      startTime.current = Date.now() - elapsed;
      const tick = () => {
        setElapsed(Date.now() - startTime.current);
        raf.current = requestAnimationFrame(tick);
      };
      raf.current = requestAnimationFrame(tick);
    }
    return () => cancelAnimationFrame(raf.current);
  }, [running]);

  const format = (ms: number) => {
    const m = Math.floor(ms / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    const cs = Math.floor((ms % 1000) / 10);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(cs).padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center">
      <div className="text-5xl text-white font-light tabular-nums my-8">{format(elapsed)}</div>
      <div className="flex gap-3 mb-6">
        <button onClick={() => setRunning(!running)} className="w-14 h-14 rounded-full bg-[#4a9eff] text-white flex items-center justify-center hover:bg-[#3d8de6] transition-colors">
          {running ? <Pause size={20} /> : <Play size={20} />}
        </button>
        <button onClick={() => { if (elapsed > 0) setLaps(prev => [elapsed, ...prev]); }} className="w-14 h-14 rounded-full bg-[#333] text-white flex items-center justify-center hover:bg-[#444]">
          <RotateCcw size={18} />
        </button>
        <button onClick={() => { setRunning(false); setElapsed(0); setLaps([]); }} className="w-14 h-14 rounded-full bg-[#333] text-red-400 flex items-center justify-center hover:bg-[#444]">
          Reset
        </button>
      </div>
      <div className="w-full max-h-48 overflow-y-auto space-y-1">
        {laps.map((lap, i) => (
          <div key={i} className="flex justify-between px-4 py-2 bg-[#252526] rounded text-sm">
            <span className="text-white/40">Lap {laps.length - i}</span>
            <span className="text-white tabular-nums">{format(lap)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Timer() {
  const [seconds, setSeconds] = useState(300);
  const [inputMinutes, setInputMinutes] = useState(5);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(0);

  useEffect(() => {
    if (running && seconds > 0) {
      intervalRef.current = window.setInterval(() => {
        setSeconds(s => {
          if (s <= 1) { setRunning(false); return 0; }
          return s - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, seconds]);

  const format = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center">
      <div className="text-5xl text-white font-light tabular-nums my-8">{format(seconds)}</div>
      {!running && seconds === 0 && (
        <div className="text-center mb-4">
          <input
            type="number"
            min={1}
            max={120}
            value={inputMinutes}
            onChange={e => setInputMinutes(parseInt(e.target.value) || 1)}
            className="w-20 bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-white text-center text-lg"
          />
          <span className="text-white/40 ml-2">minutes</span>
        </div>
      )}
      <div className="flex gap-3">
        <button onClick={() => { if (!running && seconds === 0) setSeconds(inputMinutes * 60); setRunning(!running); }} className="px-6 py-2 bg-[#4a9eff] text-white rounded-lg hover:bg-[#3d8de6]">
          {running ? 'Pause' : seconds === 0 ? 'Start' : 'Resume'}
        </button>
        <button onClick={() => { setRunning(false); setSeconds(inputMinutes * 60); }} className="px-6 py-2 bg-[#333] text-white rounded-lg hover:bg-[#444]">Reset</button>
      </div>
    </div>
  );
}
