import { dashboardRepository } from "../repositories";
import { CategoryBreakdown, DashboardSummary, MonthlyTrend } from "../types";

export class DashboardService {
  async getSummary(userId: string): Promise<DashboardSummary> {
    return dashboardRepository.getSummary(userId);
  }

  async getCategoryBreakdown(userId: string): Promise<CategoryBreakdown[]> {
    return dashboardRepository.getCategoryBreakdown(userId);
  }

  async getMonthlyTrends(userId: string): Promise<MonthlyTrend[]> {
    return dashboardRepository.getMonthlyTrends(userId);
  }

  async getRecentRecords(userId: string, limit: number = 10) {
    return dashboardRepository.getRecentRecords(userId, limit);
  }
}

export const dashboardService = new DashboardService();
