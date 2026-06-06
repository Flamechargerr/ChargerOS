import { useState, useEffect } from 'react';
import { Plus, Trash2, Check } from 'lucide-react';
import type { TodoTask } from '@/types';

const STORAGE_KEY = 'chargeros_todos';
const LISTS = ['Inbox', 'Today', 'Upcoming', 'Personal', 'Work'];

export default function Todo() {
  const [tasks, setTasks] = useState<TodoTask[]>(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
    catch { return []; }
  });
  const [activeList, setActiveList] = useState('Inbox');
  const [newTask, setNewTask] = useState('');

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)); }, [tasks]);

  const addTask = () => {
    if (!newTask.trim()) return;
    setTasks(prev => [{
      id: Date.now().toString(), title: newTask, completed: false, priority: 'medium', list: activeList, created: Date.now(),
    }, ...prev]);
    setNewTask('');
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const filtered = activeList === 'Today'
    ? tasks.filter(t => !t.completed)
    : tasks.filter(t => t.list === activeList);

  return (
    <div className="flex h-full bg-[#2d2d2d]">
      <div className="w-40 bg-[#252526] border-r border-[#333] py-2">
        {LISTS.map(list => {
          const count = list === 'Today' ? tasks.filter(t => !t.completed).length : tasks.filter(t => t.list === list && !t.completed).length;
          return (
            <button
              key={list}
              onClick={() => setActiveList(list)}
              className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between transition-colors ${
                activeList === list ? 'bg-[#37373d] text-white' : 'text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span>{list}</span>
              {count > 0 && <span className="text-white/30 text-xs">{count}</span>}
            </button>
          );
        })}
      </div>
      <div className="flex-1 flex flex-col">
        <div className="px-4 py-3 bg-[#252526] border-b border-[#333]">
          <h3 className="text-white font-medium">{activeList}</h3>
          <p className="text-white/40 text-xs">{filtered.filter(t => !t.completed).length} tasks remaining</p>
        </div>
        <div className="p-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={newTask}
              onChange={e => setNewTask(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addTask()}
              placeholder="Add a task..."
              className="flex-1 bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 outline-none"
            />
            <button onClick={addTask} className="p-2 bg-[#4a9eff] text-white rounded-lg hover:bg-[#3d8de6]"><Plus size={16} /></button>
          </div>
        </div>
        <div className="flex-1 overflow-auto">
          {filtered.map(task => (
            <div key={task.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors group">
              <button
                onClick={() => toggleTask(task.id)}
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                  task.completed ? 'bg-[#4a9eff] border-[#4a9eff]' : 'border-white/30 hover:border-[#4a9eff]'
                }`}
              >
                {task.completed && <Check size={12} className="text-white" />}
              </button>
              <span className={`flex-1 text-sm ${task.completed ? 'text-white/30 line-through' : 'text-white/80'}`}>{task.title}</span>
              <button onClick={() => deleteTask(task.id)} className="opacity-0 group-hover:opacity-100 text-white/20 hover:text-red-400 transition-opacity"><Trash2 size={12} /></button>
            </div>
          ))}
          {filtered.length === 0 && <div className="text-center text-white/30 text-sm mt-8">No tasks yet</div>}
        </div>
      </div>
    </div>
  );
}
