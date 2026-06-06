import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Trash2 } from 'lucide-react';
import type { CalendarEvent } from '@/types';

const STORAGE_KEY = 'chargeros_calendar_events';

export default function CalendarApp() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
    catch { return []; }
  });
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', time: '', description: '', color: '#4a9eff' });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  }, [events]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const today = new Date();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const getDateStr = (day: number) => `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const getEventsForDate = (day: number) => events.filter(e => e.date === getDateStr(day));

  const addEvent = () => {
    if (selectedDate && newEvent.title) {
      setEvents(prev => [...prev, { id: Date.now().toString(), date: selectedDate, ...newEvent }]);
      setNewEvent({ title: '', time: '', description: '', color: '#4a9eff' });
      setShowAddDialog(false);
    }
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  const colors = ['#4a9eff', '#ff6b6b', '#4ecdc4', '#f7b731', '#5f27cd', '#ff9ff3'];

  return (
    <div className="flex flex-col h-full bg-[#2d2d2d]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#252526] border-b border-[#333]">
        <div className="flex items-center gap-3">
          <button onClick={prevMonth} className="p-1 rounded-md hover:bg-white/10 text-white/60"><ChevronLeft size={18} /></button>
          <h2 className="text-white font-medium">{currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h2>
          <button onClick={nextMonth} className="p-1 rounded-md hover:bg-white/10 text-white/60"><ChevronRight size={18} /></button>
        </div>
        <button
          onClick={() => { setSelectedDate(getDateStr(today.getDate())); setShowAddDialog(true); }}
          className="px-3 py-1.5 bg-[#4a9eff] text-white text-sm rounded-md hover:bg-[#3d8de6] transition-colors flex items-center gap-1"
        >
          <Plus size={14} /> Add Event
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Calendar grid */}
        <div className="flex-1 p-4 overflow-auto">
          <div className="grid grid-cols-7 gap-1">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} className="text-center text-xs text-white/40 py-2 font-medium">{d}</div>
            ))}
            {Array.from({ length: firstDay }, (_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1;
              const dateStr = getDateStr(day);
              const dayEvents = getEventsForDate(day);
              const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
              const isSelected = selectedDate === dateStr;

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`aspect-square rounded-lg p-1 flex flex-col items-start transition-all ${
                    isSelected ? 'bg-[#4a9eff]/20 ring-1 ring-[#4a9eff]' :
                    isToday ? 'bg-[#4a9eff]/30' : 'hover:bg-white/5'
                  }`}
                >
                  <span className={`text-sm ${isToday ? 'text-[#4a9eff] font-bold' : 'text-white/80'}`}>{day}</span>
                  <div className="flex flex-wrap gap-0.5 mt-1">
                    {dayEvents.slice(0, 3).map(e => (
                      <div key={e.id} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: e.color }} />
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Event sidebar */}
        {selectedDate && (
          <div className="w-64 bg-[#252526] border-l border-[#333] p-4 overflow-y-auto">
            <h3 className="text-white font-medium mb-3">
              {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </h3>
            {getEventsForDate(parseInt(selectedDate.split('-')[2])).map(event => (
              <div key={event.id} className="mb-3 p-3 rounded-lg" style={{ backgroundColor: event.color + '20' }}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-white text-sm font-medium">{event.title}</p>
                    {event.time && <p className="text-white/40 text-xs">{event.time}</p>}
                    {event.description && <p className="text-white/60 text-xs mt-1">{event.description}</p>}
                  </div>
                  <button onClick={() => deleteEvent(event.id)} className="text-white/30 hover:text-red-400"><Trash2 size={12} /></button>
                </div>
              </div>
            ))}
            <button
              onClick={() => setShowAddDialog(true)}
              className="w-full py-2 border border-dashed border-white/20 rounded-lg text-white/40 text-sm hover:border-[#4a9eff] hover:text-[#4a9eff] transition-colors"
            >
              + Add Event
            </button>
          </div>
        )}
      </div>

      {/* Add event dialog */}
      {showAddDialog && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-[#2d2d2d] border border-[#444] rounded-xl p-6 w-80">
            <h3 className="text-white font-medium mb-4">Add Event</h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Event title"
                value={newEvent.title}
                onChange={e => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-[#4a9eff]/50"
              />
              <input
                type="time"
                value={newEvent.time}
                onChange={e => setNewEvent(prev => ({ ...prev, time: e.target.value }))}
                className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#4a9eff]/50"
              />
              <textarea
                placeholder="Description"
                value={newEvent.description}
                onChange={e => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-[#4a9eff]/50 resize-none h-16"
              />
              <div className="flex gap-2">
                {colors.map(c => (
                  <button
                    key={c}
                    onClick={() => setNewEvent(prev => ({ ...prev, color: c }))}
                    className={`w-6 h-6 rounded-full ${newEvent.color === c ? 'ring-2 ring-white' : ''}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
              <div className="flex gap-2 mt-4">
                <button onClick={() => setShowAddDialog(false)} className="flex-1 py-2 text-sm text-white/60 hover:bg-white/10 rounded-lg transition-colors">Cancel</button>
                <button onClick={addEvent} className="flex-1 py-2 text-sm bg-[#4a9eff] text-white rounded-lg hover:bg-[#3d8de6] transition-colors">Add</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
