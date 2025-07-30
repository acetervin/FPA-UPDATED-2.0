import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface User {
  id: number;
  username: string;
  role: 'admin' | 'volunteer' | 'donor';
}

interface AuthState {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  setAuth: (token: string, user: User) => void;
  clearAuth: () => void;
  setLoading: (isLoading: boolean) => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isLoading: false,
      setAuth: (token, user) => set({ token, user, isLoading: false }),
      clearAuth: () => set({ token: null, user: null }),
      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export function useAuthenticatedUser() {
  const isLoading = useAuth((state) => state.isLoading);
  const user = useAuth((state) => state.user);
  const token = useAuth((state) => state.token);
  
  return {
    isAuthenticated: !!token && !!user,
    isLoading,
    user
  };
}

export function useIsAdmin() {
  const user = useAuth((state) => state.user);
  return user?.role === 'admin';
}

export async function login(username: string, password: string) {
  const auth = useAuth.getState();
  auth.setLoading(true);
  
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password })
    });

    if (!response.ok) {
      throw new Error('Invalid credentials');
    }

    const data = await response.json();
    auth.setAuth(data.token, data.user);
    return data;
  } catch (error) {
    auth.clearAuth();
    throw error;
  } finally {
    auth.setLoading(false);
  }
}

export async function logout() {
  const auth = useAuth.getState();
  auth.clearAuth();
}
