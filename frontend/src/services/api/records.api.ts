import { apiClient, ApiResponse } from "./client";

export interface FinancialRecord {
  id: string;
  user_id: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  date: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateRecordRequest {
  amount: number;
  type: "income" | "expense";
  category: string;
  date: string;
  notes?: string;
}

export interface UpdateRecordRequest {
  amount?: number;
  type?: "income" | "expense";
  category?: string;
  date?: string;
  notes?: string;
}

export interface GetRecordsParams {
  page?: number;
  limit?: number;
  type?: "income" | "expense";
  category?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface GetRecordsResponse {
  data: FinancialRecord[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const recordsApi = {
  create: async (data: CreateRecordRequest): Promise<FinancialRecord> => {
    const response = await apiClient.post<ApiResponse<FinancialRecord>>(
      "/records",
      data,
    );
    return response.data.data!;
  },

  getAll: async (params?: GetRecordsParams): Promise<GetRecordsResponse> => {
    const response = await apiClient.get<ApiResponse<FinancialRecord[]>>(
      "/records",
      { params },
    );
    return {
      data: response.data.data || [],
      meta: {
        page: response.data.meta?.page || 1,
        limit: response.data.meta?.limit || 10,
        total: response.data.meta?.total || 0,
        totalPages: response.data.meta?.totalPages || 0,
      },
    };
  },

  getById: async (id: string): Promise<FinancialRecord> => {
    const response = await apiClient.get<ApiResponse<FinancialRecord>>(
      `/records/${id}`,
    );
    return response.data.data!;
  },

  update: async (
    id: string,
    data: UpdateRecordRequest,
  ): Promise<FinancialRecord> => {
    const response = await apiClient.patch<ApiResponse<FinancialRecord>>(
      `/records/${id}`,
      data,
    );
    return response.data.data!;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/records/${id}`);
  },
};
