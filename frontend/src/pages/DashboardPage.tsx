import React from 'react';
import { Layout } from '../components/layout';
import { SummaryCard, CategoryPieChart, TrendsLineChart } from '../components/charts';
import { Spinner } from '../components/common';
import {
  useDashboardSummary,
  useCategoryBreakdown,
  useMonthlyTrends,
} from '../hooks/useDashboard';

export const DashboardPage: React.FC = () => {
  const { data: summary, isLoading: summaryLoading } = useDashboardSummary();
  const { data: categoryData, isLoading: categoryLoading } = useCategoryBreakdown();
  const { data: trendsData, isLoading: trendsLoading } = useMonthlyTrends();

  if (summaryLoading || categoryLoading || trendsLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <Spinner size="lg" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SummaryCard
            title="Total Income"
            value={summary?.totalIncome || 0}
            icon="💰"
            variant="income"
          />
          <SummaryCard
            title="Total Expenses"
            value={summary?.totalExpense || 0}
            icon="💸"
            variant="expense"
          />
          <SummaryCard
            title="Net Balance"
            value={summary?.netBalance || 0}
            icon="📊"
            variant="balance"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {categoryData && categoryData.length > 0 && (
            <CategoryPieChart data={categoryData} />
          )}
          {trendsData && trendsData.length > 0 && (
            <TrendsLineChart data={trendsData} />
          )}
        </div>
      </div>
    </Layout>
  );
};
