import { create } from 'zustand';
import { User } from '../services/api';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  login: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set) => {
  // Load from localStorage on init
  const storedUser = localStorage.getItem('user');
  const storedAccessToken = localStorage.getItem('accessToken');
  const storedRefreshToken = localStorage.getItem('refreshToken');

  return {
    user: storedUser ? JSON.parse(storedUser) : null,
    accessToken: storedAccessToken,
    refreshToken: storedRefreshToken,
    isAuthenticated: !!storedAccessToken,

    login: (user, accessToken, refreshToken) => {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      
      set({
        user,
        accessToken,
        refreshToken,
        isAuthenticated: true,
      });
    },

    logout: () => {
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      
      set({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
      });
    },

    updateUser: (user) => {
      localStorage.setItem('user', JSON.stringify(user));
      set({ user });
    },
  };
});
