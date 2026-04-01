import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { recordsApi, GetRecordsParams, CreateRecordRequest, UpdateRecordRequest } from '../services/api';
import toast from 'react-hot-toast';

export const useRecords = (params?: GetRecordsParams) => {
  return useQuery({
    queryKey: ['records', params],
    queryFn: () => recordsApi.getAll(params),
  });
};

export const useRecord = (id: string) => {
  return useQuery({
    queryKey: ['record', id],
    queryFn: () => recordsApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateRecord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRecordRequest) => recordsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['records'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Record created successfully');
    },
    onError: (error: any) => {
      const message = error.response?.data?.error?.message || 'Failed to create record';
      toast.error(message);
    },
  });
};

export const useUpdateRecord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRecordRequest }) =>
      recordsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['records'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Record updated successfully');
    },
    onError: (error: any) => {
      const message = error.response?.data?.error?.message || 'Failed to update record';
      toast.error(message);
    },
  });
};

export const useDeleteRecord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => recordsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['records'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Record deleted successfully');
    },
    onError: (error: any) => {
      const message = error.response?.data?.error?.message || 'Failed to delete record';
      toast.error(message);
    },
  });
};
