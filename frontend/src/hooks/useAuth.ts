import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi, LoginRequest, RegisterRequest } from '../services/api';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

export const useLogin = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (data) => {
      login(data.user, data.accessToken, data.refreshToken);
      toast.success('Login successful!');
      navigate('/dashboard');
    },
    onError: (error: any) => {
      const message = error.response?.data?.error?.message || 'Login failed';
      toast.error(message);
    },
  });
};

export const useRegister = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
    onSuccess: (data) => {
      login(data.user, data.accessToken, data.refreshToken);
      toast.success('Registration successful!');
      navigate('/dashboard');
    },
    onError: (error: any) => {
      const message = error.response?.data?.error?.message || 'Registration failed';
      toast.error(message);
    },
  });
};

export const useLogout = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const queryClient = useQueryClient();

  return () => {
    logout();
    queryClient.clear();
    toast.success('Logged out successfully');
    navigate('/login');
  };
};
