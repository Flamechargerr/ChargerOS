import { useState, useEffect } from 'react';
import { Plus, Pin, Trash2 } from 'lucide-react';
import type { Note } from '@/types';

const COLORS = ['#ffeb3b', '#ff9800', '#4caf50', '#2196f3', '#9c27b0', '#f44336', '#00bcd4', '#ff5722'];

const STORAGE_KEY = 'chargeros_notes';

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
    catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  const addNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'New Note',
      content: '',
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      pinned: false,
      created: Date.now(),
    };
    setNotes(prev => [newNote, ...prev]);
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, ...updates } : n));
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  const sorted = [...notes].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

  return (
    <div className="flex flex-col h-full bg-[#2d2d2d]">
      <div className="flex items-center justify-between px-4 py-3 bg-[#252526] border-b border-[#333]">
        <h2 className="text-white font-medium">Notes</h2>
        <button onClick={addNote} className="p-2 bg-[#4a9eff] text-white rounded-lg hover:bg-[#3d8de6]"><Plus size={16} /></button>
      </div>
      <div className="flex-1 overflow-auto p-4">
        {sorted.length === 0 ? (
          <div className="text-center text-white/30 text-sm mt-12">No notes yet. Click + to create one.</div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {sorted.map(note => (
              <div key={note.id} className="rounded-lg p-3 shadow-lg relative group" style={{ backgroundColor: note.color + '20', border: `1px solid ${note.color}40` }}>
                <div className="flex items-center justify-between mb-2">
                  <input
                    value={note.title}
                    onChange={e => updateNote(note.id, { title: e.target.value })}
                    className="bg-transparent text-white text-sm font-medium outline-none w-full"
                  />
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => updateNote(note.id, { pinned: !note.pinned })} className={`p-1 rounded ${note.pinned ? 'text-[#ff9800]' : 'text-white/40 hover:text-white'}`}><Pin size={12} /></button>
                    <button onClick={() => deleteNote(note.id)} className="p-1 rounded text-white/40 hover:text-red-400"><Trash2 size={12} /></button>
                  </div>
                </div>
                <textarea
                  value={note.content}
                  onChange={e => updateNote(note.id, { content: e.target.value })}
                  className="w-full bg-transparent text-white/80 text-xs outline-none resize-none h-20"
                  placeholder="Type your note..."
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
