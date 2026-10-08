import { useEffect, useState, type ReactNode } from 'react';
import { api, ApiError, tokenStorage } from '../api/client';
import type { AuthResponse, User } from '../api/types';
import { AuthContext, type AuthState } from './context';
import { useQueryClient } from '@tanstack/react-query';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(() => tokenStorage.get() !== null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!tokenStorage.get()) {
      return;
    }

    api<{ data: User }>('/me')
      .then((res) => setUser(res.data))
      .catch((error) => {
        if (error instanceof ApiError && error.status === 401) {
          tokenStorage.clear();
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const value: AuthState = {
    user,
    loading,
    login: async (email, password) => {
      const res = await api<AuthResponse>('/login', {
        method: 'POST',
        body: { email, password, device_name: 'web' },
      });
      tokenStorage.set(res.token);
      setUser(res.user);
    },
    register: async (data) => {
      const res = await api<AuthResponse>('/register', { method: 'POST', body: data });
      tokenStorage.set(res.token);
      setUser(res.user);
    },
    logout: async () => {
      try {
        await api('/logout', { method: 'POST' });
      } finally {
        tokenStorage.clear();
        queryClient.clear();
        setUser(null);        
      }
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}