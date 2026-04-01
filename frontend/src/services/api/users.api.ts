import { apiClient, ApiResponse } from './client';
import { User } from './auth.api';

export interface GetUsersParams {
  page?: number;
  limit?: number;
  role?: 'viewer' | 'analyst' | 'admin';
  status?: 'active' | 'inactive';
}

export interface GetUsersResponse {
  data: User[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const usersApi = {
  getAll: async (params?: GetUsersParams): Promise<GetUsersResponse> => {
    const response = await apiClient.get<ApiResponse<User[]>>('/users', { params });
    return {
      data: response.data.data!,
      meta: response.data.meta!,
    };
  },

  getById: async (id: string): Promise<User> => {
    const response = await apiClient.get<ApiResponse<User>>(`/users/${id}`);
    return response.data.data!;
  },

  updateRole: async (id: string, role: string): Promise<User> => {
    const response = await apiClient.patch<ApiResponse<User>>(`/users/${id}/role`, { role });
    return response.data.data!;
  },

  updateStatus: async (id: string, status: string): Promise<User> => {
    const response = await apiClient.patch<ApiResponse<User>>(`/users/${id}/status`, { status });
    return response.data.data!;
  },
};
