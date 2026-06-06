import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { User, LogIn, ArrowRight } from 'lucide-react';

export default function LoginScreen() {
  const { login, guestLogin } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isUnlocking, setIsUnlocking] = useState(false);

  const handleLogin = () => {
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }
    if (!password.trim()) {
      setError('Please enter a password');
      return;
    }
    setIsUnlocking(true);
    setTimeout(() => {
      const success = login(username, password);
      if (!success) {
        setError('Invalid credentials');
        setIsUnlocking(false);
      }
    }, 300);
  };

  const handleGuest = () => {
    setIsUnlocking(true);
    setTimeout(() => {
      guestLogin();
    }, 300);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleLogin();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      style={{
        backgroundImage: 'url(/wallpapers/login-bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className={`flex flex-col items-center transition-all duration-500 ${isUnlocking ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
        {/* Avatar */}
        <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-8">
          <User size={48} className="text-white/80" />
        </div>

        {/* Login form */}
        <div className="bg-black/30 backdrop-blur-xl rounded-2xl border border-white/10 p-6 w-80">
          <h2 className="text-white text-lg font-medium text-center mb-6">Welcome to ChargerOS</h2>

          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg px-3 py-2 mb-4 text-red-300 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-3">
            <div>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => { setUsername(e.target.value); setError(''); }}
                onKeyDown={handleKeyDown}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-white/40 text-sm outline-none focus:border-[#4a9eff]/60 transition-colors"
                autoFocus
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                onKeyDown={handleKeyDown}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-white/40 text-sm outline-none focus:border-[#4a9eff]/60 transition-colors"
              />
            </div>
            <button
              onClick={handleLogin}
              className="w-full bg-[#4a9eff] hover:bg-[#3d8de6] text-white rounded-lg px-4 py-2.5 text-sm font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <LogIn size={16} />
              Unlock
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="mt-4 pt-4 border-t border-white/10">
            <button
              onClick={handleGuest}
              className="w-full text-white/60 hover:text-white text-sm transition-colors"
            >
              Log in as Guest
            </button>
          </div>
        </div>
      </div>

      {/* Time display */}
      <div className="absolute bottom-12 text-white/60 text-sm">
        {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
      </div>
    </div>
  );
}
