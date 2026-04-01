import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card } from '../common/Card';
import { formatCurrency, formatMonthYear } from '../../utils';

interface TrendData {
  month: string;
  income: number;
  expense: number;
  net: number;
}

interface TrendsLineChartProps {
  data: TrendData[];
}

export const TrendsLineChart: React.FC<TrendsLineChartProps> = ({ data }) => {
  const formattedData = data.map((item) => ({
    ...item,
    month: formatMonthYear(item.month),
  }));

  return (
    <Card title="Monthly Trends">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip formatter={(value: number) => formatCurrency(value)} />
          <Legend />
          <Line type="monotone" dataKey="income" stroke="#10B981" name="Income" />
          <Line type="monotone" dataKey="expense" stroke="#EF4444" name="Expense" />
          <Line type="monotone" dataKey="net" stroke="#3B82F6" name="Net" />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};
