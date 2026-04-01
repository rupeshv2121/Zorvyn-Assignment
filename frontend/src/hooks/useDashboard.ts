import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../services/api';

export const useDashboardSummary = () => {
  return useQuery({
    queryKey: ['dashboard', 'summary'],
    queryFn: () => dashboardApi.getSummary(),
  });
};

export const useCategoryBreakdown = () => {
  return useQuery({
    queryKey: ['dashboard', 'category-breakdown'],
    queryFn: () => dashboardApi.getCategoryBreakdown(),
  });
};

export const useMonthlyTrends = () => {
  return useQuery({
    queryKey: ['dashboard', 'trends'],
    queryFn: () => dashboardApi.getMonthlyTrends(),
  });
};

export const useRecentRecords = (limit?: number) => {
  return useQuery({
    queryKey: ['dashboard', 'recent', limit],
    queryFn: () => dashboardApi.getRecentRecords(limit),
  });
};
