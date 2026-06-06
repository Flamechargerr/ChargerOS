import { useState } from 'react';
import { Inbox, Send, FileText, Trash2, Plus, ArrowLeft, Reply, Star } from 'lucide-react';

interface Email {
  id: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  folder: string;
  read: boolean;
  starred: boolean;
  timestamp: string;
}

const mockEmails: Email[] = [
  { id: '1', from: 'welcome@chargeros.local', to: 'user@chargeros.local', subject: 'Welcome to ChargerOS!', body: 'Welcome to your new web-based operating system. Explore 59 built-in apps and enjoy the full Linux desktop experience in your browser.', folder: 'inbox', read: false, starred: true, timestamp: '2024-01-15 09:00' },
  { id: '2', from: 'noreply@github.com', to: 'user@chargeros.local', subject: 'New sign-in to your account', body: 'A new sign-in was detected from ChargerOS Browser. If this was you, no action is required.', folder: 'inbox', read: false, starred: false, timestamp: '2024-01-14 15:30' },
  { id: '3', from: 'newsletter@opensource.org', to: 'user@chargeros.local', subject: 'Weekly Open Source Digest', body: 'This week in open source: New kernel release, GNOME updates, and more community news...', folder: 'inbox', read: true, starred: false, timestamp: '2024-01-13 08:00' },
  { id: '4', from: 'user@chargeros.local', to: 'support@chargeros.local', subject: 'Feature Request: More Themes', body: 'Would love to see more desktop themes and customization options in the next update.', folder: 'sent', read: true, starred: false, timestamp: '2024-01-12 10:00' },
  { id: '5', from: 'alerts@chargeros.local', to: 'user@chargeros.local', subject: 'System Update Available', body: 'A new system update is available. Click here to install the latest security patches and features.', folder: 'inbox', read: true, starred: false, timestamp: '2024-01-10 06:00' },
];

export default function Email() {
  const [emails, setEmails] = useState<Email[]>(mockEmails);
  const [folder, setFolder] = useState('inbox');
  const [selected, setSelected] = useState<Email | null>(null);
  const [compose, setCompose] = useState(false);
  const [newEmail, setNewEmail] = useState({ to: '', subject: '', body: '' });

  const folders = [
    { id: 'inbox', label: 'Inbox', icon: Inbox },
    { id: 'sent', label: 'Sent', icon: Send },
    { id: 'drafts', label: 'Drafts', icon: FileText },
    { id: 'trash', label: 'Trash', icon: Trash2 },
  ];

  const folderEmails = emails.filter(e => e.folder === folder);
  const unreadCount = emails.filter(e => e.folder === 'inbox' && !e.read).length;

  const toggleStar = (id: string) => {
    setEmails(prev => prev.map(e => e.id === id ? { ...e, starred: !e.starred } : e));
  };

  const sendEmail = () => {
    if (!newEmail.to || !newEmail.subject) return;
    const email: Email = {
      id: Date.now().toString(),
      from: 'user@chargeros.local',
      to: newEmail.to,
      subject: newEmail.subject,
      body: newEmail.body,
      folder: 'sent',
      read: true,
      starred: false,
      timestamp: new Date().toLocaleString(),
    };
    setEmails(prev => [email, ...prev]);
    setCompose(false);
    setNewEmail({ to: '', subject: '', body: '' });
  };

  if (compose) {
    return (
      <div className="flex flex-col h-full bg-[#2d2d2d]">
        <div className="flex items-center gap-3 px-4 py-3 bg-[#252526] border-b border-[#333]">
          <button onClick={() => setCompose(false)} className="text-white/60 hover:text-white"><ArrowLeft size={18} /></button>
          <span className="text-white font-medium">New Message</span>
          <button onClick={sendEmail} className="ml-auto px-4 py-1.5 bg-[#4a9eff] text-white text-sm rounded-lg hover:bg-[#3d8de6]">Send</button>
        </div>
        <div className="p-4 space-y-3">
          <input type="text" placeholder="To" value={newEmail.to} onChange={e => setNewEmail(p => ({ ...p, to: e.target.value }))} className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 outline-none" />
          <input type="text" placeholder="Subject" value={newEmail.subject} onChange={e => setNewEmail(p => ({ ...p, subject: e.target.value }))} className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 outline-none" />
          <textarea placeholder="Message body" value={newEmail.body} onChange={e => setNewEmail(p => ({ ...p, body: e.target.value }))} className="w-full flex-1 bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 outline-none resize-none h-64" />
        </div>
      </div>
    );
  }

  if (selected) {
    return (
      <div className="flex flex-col h-full bg-[#2d2d2d]">
        <div className="flex items-center gap-3 px-4 py-3 bg-[#252526] border-b border-[#333]">
          <button onClick={() => setSelected(null)} className="text-white/60 hover:text-white"><ArrowLeft size={18} /></button>
          <button onClick={() => setCompose(true)} className="text-white/60 hover:text-white"><Reply size={18} /></button>
        </div>
        <div className="p-6 overflow-auto">
          <h2 className="text-white text-lg font-medium mb-2">{selected.subject}</h2>
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/10">
            <div className="w-8 h-8 rounded-full bg-[#4a9eff] flex items-center justify-center text-white text-xs font-medium">
              {selected.from[0].toUpperCase()}
            </div>
            <div>
              <p className="text-white text-sm">{selected.from}</p>
              <p className="text-white/40 text-xs">{selected.timestamp}</p>
            </div>
          </div>
          <p className="text-white/80 text-sm leading-relaxed whitespace-pre-line">{selected.body}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full bg-[#2d2d2d]">
      {/* Sidebar */}
      <div className="w-44 bg-[#252526] border-r border-[#333] py-2">
        <button onClick={() => setCompose(true)} className="mx-3 mb-3 flex items-center gap-2 px-4 py-2 bg-[#4a9eff] text-white text-sm rounded-lg hover:bg-[#3d8de6] transition-colors">
          <Plus size={14} /> Compose
        </button>
        {folders.map(f => {
          const Icon = f.icon;
          return (
            <button
              key={f.id}
              onClick={() => setFolder(f.id)}
              className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 transition-colors ${
                folder === f.id ? 'bg-[#37373d] text-white' : 'text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon size={14} />
              {f.label}
              {f.id === 'inbox' && unreadCount > 0 && (
                <span className="ml-auto bg-[#4a9eff] text-white text-[10px] px-1.5 py-0.5 rounded-full">{unreadCount}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Email list */}
      <div className="flex-1 overflow-auto">
        {folderEmails.map(email => (
          <button
            key={email.id}
            onClick={() => { setSelected(email); if (!email.read) setEmails(prev => prev.map(e => e.id === email.id ? { ...e, read: true } : e)); }}
            className={`w-full text-left px-4 py-3 border-b border-white/5 hover:bg-white/5 transition-colors ${
              !email.read ? 'bg-white/[0.02]' : ''
            }`}
          >
            <div className="flex items-center gap-2">
              <button onClick={(e) => { e.stopPropagation(); toggleStar(email.id); }}>
                <Star size={12} className={email.starred ? 'text-[#ff9800] fill-[#ff9800]' : 'text-white/20'} />
              </button>
              <span className={`text-sm ${!email.read ? 'text-white font-medium' : 'text-white/60'}`}>{email.from}</span>
              <span className="text-white/40 text-xs ml-auto">{email.timestamp}</span>
            </div>
            <p className={`text-sm mt-0.5 ${!email.read ? 'text-white/90' : 'text-white/50'}`}>{email.subject}</p>
          </button>
        ))}
        {folderEmails.length === 0 && (
          <div className="flex items-center justify-center h-48 text-white/30 text-sm">No emails in {folder}</div>
        )}
      </div>
    </div>
  );
}
