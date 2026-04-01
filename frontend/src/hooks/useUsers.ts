import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi, GetUsersParams } from '../services/api';
import toast from 'react-hot-toast';

export const useUsers = (params?: GetUsersParams) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => usersApi.getAll(params),
  });
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) =>
      usersApi.updateRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User role updated successfully');
    },
    onError: (error: any) => {
      const message = error.response?.data?.error?.message || 'Failed to update role';
      toast.error(message);
    },
  });
};

export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      usersApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User status updated successfully');
    },
    onError: (error: any) => {
      const message = error.response?.data?.error?.message || 'Failed to update status';
      toast.error(message);
    },
  });
};
