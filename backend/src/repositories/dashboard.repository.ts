import { getPrismaClient } from "../config";
import { CategoryBreakdown, DashboardSummary, MonthlyTrend } from "../types";

export class DashboardRepository {
  private prisma = getPrismaClient();

  async getSummary(userId: string): Promise<DashboardSummary> {
    const records = await this.prisma.financialRecord.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      select: {
        type: true,
        amount: true,
      },
    });

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
    const records = await this.prisma.financialRecord.findMany({
      where: {
        userId,
        type: "expense",
        deletedAt: null,
      },
      select: {
        category: true,
        amount: true,
      },
    });

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
    const records = await this.prisma.financialRecord.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      select: {
        date: true,
        type: true,
        amount: true,
      },
      orderBy: {
        date: "asc",
      },
    });

    const monthlyData: { [key: string]: { income: number; expense: number } } =
      {};

    records.forEach((record) => {
      const date = new Date(record.date);
      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`; // YYYY-MM

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
    const records = await this.prisma.financialRecord.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    });

    return records;
  }
}

export const dashboardRepository = new DashboardRepository();
