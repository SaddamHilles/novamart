import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import api from '../api';
import type { AuthResponse, PublicUser } from '../types';

type AuthContextValue = {
  user: PublicUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<PublicUser>;
  register: (name: string, email: string, password: string) => Promise<PublicUser>;
  completeOAuth: (token: string) => Promise<PublicUser>;
  refreshUser: (user: PublicUser) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('novamart_token');
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get<{ user: PublicUser }>('/auth/me')
      .then(({ data }) => setUser(data.user))
      .catch(() => localStorage.removeItem('novamart_token'))
      .finally(() => setLoading(false));
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      async login(email, password) {
        const { data } = await api.post<AuthResponse>('/auth/login', { email, password });
        localStorage.setItem('novamart_token', data.token);
        setUser(data.user);
        return data.user;
      },
      async register(name, email, password) {
        const { data } = await api.post<AuthResponse>('/auth/register', { name, email, password });
        localStorage.setItem('novamart_token', data.token);
        setUser(data.user);
        return data.user;
      },
      async completeOAuth(token) {
        localStorage.setItem('novamart_token', token);
        const { data } = await api.get<{ user: PublicUser }>('/auth/me');
        setUser(data.user);
        return data.user;
      },
      refreshUser(next) {
        setUser(next);
      },
      logout() {
        localStorage.removeItem('novamart_token');
        setUser(null);
      },
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
