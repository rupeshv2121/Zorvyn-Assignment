import { getDatabase } from "../config";
import { CategoryBreakdown, DashboardSummary, MonthlyTrend } from "../types";

export class DashboardRepository {
  private db = getDatabase();

  async getSummary(userId: string): Promise<DashboardSummary> {
    const { data, error } = await this.db
      .from("financial_records")
      .select("type, amount")
      .eq("user_id", userId);

    if (error) throw error;

    const records = data || [];
    const totalIncome = records
      .filter((r) => r.type === "income")
      .reduce((sum, r) => sum + Number(r.amount), 0);

    const totalExpense = records
      .filter((r) => r.type === "expense")
      .reduce((sum, r) => sum + Number(r.amount), 0);

    return {
      totalIncome,
      totalExpense,
      netBalance: totalIncome - totalExpense,
      period: "all-time",
    };
  }

  async getCategoryBreakdown(userId: string): Promise<CategoryBreakdown[]> {
    const { data, error } = await this.db
      .from("financial_records")
      .select("category, amount, type")
      .eq("user_id", userId)
      .eq("type", "expense");

    if (error) throw error;

    const records = data || [];
    const categoryTotals: { [key: string]: number } = {};
    let total = 0;

    records.forEach((record) => {
      const amount = Number(record.amount);
      categoryTotals[record.category] =
        (categoryTotals[record.category] || 0) + amount;
      total += amount;
    });

    return Object.entries(categoryTotals).map(([category, amount]) => ({
      category,
      total: amount,
      percentage: total > 0 ? (amount / total) * 100 : 0,
    }));
  }

  async getMonthlyTrends(userId: string): Promise<MonthlyTrend[]> {
    const { data, error } = await this.db
      .from("financial_records")
      .select("date, type, amount")
      .eq("user_id", userId)
      .order("date", { ascending: true });

    if (error) throw error;

    const records = data || [];
    const monthlyData: { [key: string]: { income: number; expense: number } } =
      {};

    records.forEach((record) => {
      const month = record.date.substring(0, 7); // YYYY-MM
      if (!monthlyData[month]) {
        monthlyData[month] = { income: 0, expense: 0 };
      }

      const amount = Number(record.amount);
      if (record.type === "income") {
        monthlyData[month].income += amount;
      } else {
        monthlyData[month].expense += amount;
      }
    });

    return Object.entries(monthlyData).map(([month, data]) => ({
      month,
      income: data.income,
      expense: data.expense,
      net: data.income - data.expense,
    }));
  }

  async getRecentRecords(userId: string, limit: number = 10) {
    const { data, error } = await this.db
      .from("financial_records")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }
}

export const dashboardRepository = new DashboardRepository();
