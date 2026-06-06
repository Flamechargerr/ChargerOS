import { useState, useEffect, useRef } from 'react';
import { Send, Hash } from 'lucide-react';

interface Message {
  id: string;
  channel: string;
  sender: string;
  text: string;
  time: string;
}

const initialMessages: Message[] = [
  { id: '1', channel: 'general', sender: 'System', text: 'Welcome to #general! Be respectful and have fun.', time: '09:00' },
  { id: '2', channel: 'general', sender: 'Alice', text: 'Hey everyone! How is the new OS working for you?', time: '09:05' },
  { id: '3', channel: 'general', sender: 'Bob', text: 'It\'s amazing! Love the terminal and games.', time: '09:07' },
  { id: '4', channel: 'random', sender: 'System', text: 'Welcome to #random! Share anything here.', time: '09:00' },
  { id: '5', channel: 'help', sender: 'System', text: 'Welcome to #help! Ask questions here.', time: '09:00' },
];

const botResponses = [
  'That\'s interesting!',
  'I agree with that.',
  'Have you tried the new features?',
  'Nice setup!',
  'Welcome to ChargerOS!',
  'The terminal has some cool commands.',
  'Check out the games section!',
];

const channels = ['general', 'random', 'help'];

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [activeChannel, setActiveChannel] = useState('general');
  const [input, setInput] = useState('');
  const [nickname] = useState('User');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeChannel]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const users = ['Alice', 'Bob', 'Charlie', 'Diana'];
        const user = users[Math.floor(Math.random() * users.length)];
        const text = botResponses[Math.floor(Math.random() * botResponses.length)];
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          channel: 'general',
          sender: user,
          text,
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        }]);
      }
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMsg: Message = {
      id: Date.now().toString(),
      channel: activeChannel,
      sender: nickname,
      text: input,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
  };

  const channelMessages = messages.filter(m => m.channel === activeChannel);

  return (
    <div className="flex h-full bg-[#2d2d2d]">
      {/* Channel list */}
      <div className="w-44 bg-[#252526] border-r border-[#333] py-2">
        <p className="text-white/30 text-xs uppercase px-4 py-2">Channels</p>
        {channels.map(ch => (
          <button
            key={ch}
            onClick={() => setActiveChannel(ch)}
            className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 transition-colors ${
              activeChannel === ch ? 'bg-[#37373d] text-white' : 'text-white/60 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Hash size={14} /> {ch}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 flex flex-col">
        <div className="px-4 py-3 bg-[#252526] border-b border-[#333]">
          <p className="text-white font-medium flex items-center gap-1"><Hash size={14} /> {activeChannel}</p>
        </div>
        <div className="flex-1 overflow-auto p-4 space-y-3">
          {channelMessages.map(msg => (
            <div key={msg.id}>
              <div className="flex items-baseline gap-2">
                <span className={`text-sm font-medium ${msg.sender === 'System' ? 'text-[#4ecdc4]' : msg.sender === nickname ? 'text-[#4a9eff]' : 'text-[#ff9800]'}`}>{msg.sender}</span>
                <span className="text-white/20 text-[10px]">{msg.time}</span>
              </div>
              <p className="text-white/70 text-sm mt-0.5">{msg.text}</p>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
        <div className="p-3 bg-[#252526] border-t border-[#333] flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder={`Message #${activeChannel}`}
            className="flex-1 bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-[#4a9eff]/50"
          />
          <button onClick={sendMessage} className="p-2 bg-[#4a9eff] text-white rounded-lg hover:bg-[#3d8de6]"><Send size={14} /></button>
        </div>
      </div>
    </div>
  );
}
