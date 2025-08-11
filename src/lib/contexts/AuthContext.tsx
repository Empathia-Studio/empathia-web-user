'use client';

import User from '@/features/auth/model/users';
import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  setAuthState: (isLoggedIn: boolean, user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr && userStr !== 'undefined' && userStr !== 'null') {
        const parsedUser = JSON.parse(userStr);
        setIsLoggedIn(true);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error('Error parsing user data from localStorage:', error);
      localStorage.removeItem('user');
    }
  }, []);

  const setAuthState = (isLoggedIn: boolean, user: User | null) => {
    setIsLoggedIn(isLoggedIn);
    setUser(user);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, setAuthState }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 