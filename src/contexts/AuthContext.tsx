import React, { createContext, useContext, useState, useCallback } from 'react';

interface AuthContextType {
  isLoggedIn: boolean;
  isGuest: boolean;
  username: string;
  avatar: string;
  login: (username: string, password: string) => boolean;
  guestLogin: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [username, setUsername] = useState('');

  const login = useCallback((user: string, password: string) => {
    if (user.trim() && password.trim()) {
      setIsLoggedIn(true);
      setIsGuest(false);
      setUsername(user);
      localStorage.setItem('chargeros_lastUser', user);
      return true;
    }
    return false;
  }, []);

  const guestLogin = useCallback(() => {
    setIsLoggedIn(true);
    setIsGuest(true);
    setUsername('Guest');
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setIsGuest(false);
    setUsername('');
    window.location.reload();
  }, []);

  return (
    <AuthContext.Provider value={{
      isLoggedIn,
      isGuest,
      username,
      avatar: '/avatars/default.png',
      login,
      guestLogin,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
