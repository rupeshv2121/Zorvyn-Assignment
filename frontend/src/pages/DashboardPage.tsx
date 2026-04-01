import { Currency, TrendingUpDown } from 'lucide-react';
import React from 'react';
import { CategoryPieChart, SummaryCard, TrendsLineChart } from '../components/charts';
import { Spinner } from '../components/common';
import { Layout } from '../components/layout';
import {
  useCategoryBreakdown,
  useDashboardSummary,
  useMonthlyTrends,
} from '../hooks/useDashboard';
import { useAuthStore } from '../store/authStore';

export const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const { data: summary, isLoading: summaryLoading } = useDashboardSummary();
  const { data: categoryData, isLoading: categoryLoading } = useCategoryBreakdown();
  const { data: trendsData, isLoading: trendsLoading } = useMonthlyTrends();

  const userName = user?.email?.split('@')[0] || 'User';
  const formattedName = userName.charAt(0).toUpperCase() + userName.slice(1);

  const ICONS = {
    income: <Currency className="w-6 h-6 text-green-600" />,
    expense: <Currency className="w-6 h-6 text-red-600" />,
    balance: <TrendingUpDown className="w-6 h-6 text-blue-600" />,
  };

  if (summaryLoading || categoryLoading || trendsLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <Spinner size="lg" />
        </div>
      </Layout>
    );
  }

  const hasData = summary || (categoryData && categoryData.length > 0) || (trendsData && trendsData.length > 0);

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {formattedName}!</h1>
          <p className="text-gray-600">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {hasData ? (
          <>
            {/* Summary Cards */}
            <div>
              <h2 className="mb-4 text-lg font-semibold text-gray-900">Financial Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SummaryCard
                  title="Total Income"
                  value={summary?.totalIncome || 0}
                  icon={ICONS.income}
                  variant="income"
                />
                <SummaryCard
                  title="Total Expenses"
                  value={summary?.totalExpense || 0}
                  icon={ICONS.expense}
                  variant="expense"
                />
                <SummaryCard
                  title="Net Balance"
                  value={summary?.netBalance || 0}
                  icon={ICONS.balance}
                  variant="balance"
                />
              </div>
            </div>

            {/* Charts */}
            <div>
              <h2 className="mb-4 text-lg font-semibold text-gray-900">Analysis</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {categoryData && categoryData.length > 0 && (
                  <CategoryPieChart data={categoryData} />
                )}
                {trendsData && trendsData.length > 0 && (
                  <TrendsLineChart data={trendsData} />
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="rounded-lg bg-gray-50 p-12 text-center">
            <p className="text-lg text-gray-600">
              No financial data yet. Start by adding your first record to see insights here.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};
