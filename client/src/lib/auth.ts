import React, { useEffect } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useLocation } from 'wouter';

interface AuthState {
  token: string | null;
  user: {
    id: number;
    username: string;
    role: 'admin' | 'volunteer' | 'donor';
  } | null;
  setAuth: (token: string, user: AuthState['user']) => void;
  clearAuth: () => void;
}

export const useAuth = create<AuthState>(
  persist(
    (set) => ({
      token: null,
      user: null,
      setAuth: (token: string, user: AuthState['user']) => set({ token, user }),
      clearAuth: () => set({ token: null, user: null }),
    }),
    {
      name: 'auth-storage',
    }
  ) as any
);

export async function login(username: string, password: string) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  const data = await response.json();
  useAuth.getState().setAuth(data.token, data.user);
  return data;
}

export async function logout() {
  await fetch('/api/auth/logout', {
    method: 'POST',
  });
  useAuth.getState().clearAuth();
}

export function useAuthenticatedUser() {
  const user = useAuth((state: AuthState) => state.user);
  const token = useAuth((state: AuthState) => state.token);
  return { user, token, isAuthenticated: !!token };
}

export function useIsAdmin() {
  const user = useAuth((state: AuthState) => state.user);
  return user?.role === 'admin';
}

export function requireAuth<P extends object>(Component: React.ComponentType<P>) {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated } = useAuthenticatedUser();
    const [, setLocation] = useLocation();

    useEffect(() => {
      if (!isAuthenticated) {
        setLocation('/admin/login');
      }
    }, [isAuthenticated, setLocation]);

    if (!isAuthenticated) {
      return null;
    }

    return React.createElement(Component, props);
  };
}
