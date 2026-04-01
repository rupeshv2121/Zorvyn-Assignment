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
