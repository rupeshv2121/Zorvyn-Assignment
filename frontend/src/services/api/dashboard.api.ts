import { apiClient, ApiResponse } from './client';
import { FinancialRecord } from './records.api';

export interface DashboardSummary {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  period: string;
}

export interface CategoryBreakdown {
  category: string;
  total: number;
  percentage: number;
}

export interface MonthlyTrend {
  month: string;
  income: number;
  expense: number;
  net: number;
}

export const dashboardApi = {
  getSummary: async (): Promise<DashboardSummary> => {
    const response = await apiClient.get<ApiResponse<DashboardSummary>>('/dashboard/summary');
    return response.data.data!;
  },

  getCategoryBreakdown: async (): Promise<CategoryBreakdown[]> => {
    const response = await apiClient.get<ApiResponse<CategoryBreakdown[]>>('/dashboard/category-breakdown');
    return response.data.data!;
  },

  getMonthlyTrends: async (): Promise<MonthlyTrend[]> => {
    const response = await apiClient.get<ApiResponse<MonthlyTrend[]>>('/dashboard/trends');
    return response.data.data!;
  },

  getRecentRecords: async (limit?: number): Promise<FinancialRecord[]> => {
    const response = await apiClient.get<ApiResponse<FinancialRecord[]>>('/dashboard/recent', {
      params: { limit },
    });
    return response.data.data!;
  },
};
