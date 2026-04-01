import React from 'react';
import { formatCurrency } from '../../utils';
import { Card } from '../common/Card';

interface SummaryCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  variant: 'income' | 'expense' | 'balance';
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, icon, variant }) => {
  const colors = {
    income: 'text-success-600 bg-success-100',
    expense: 'text-danger-600 bg-danger-100',
    balance: 'text-primary-600 bg-primary-100',
  };

  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold mt-1">{formatCurrency(value)}</p>
        </div>
        <div className={`p-3 rounded-full ${colors[variant]}`}>
          {icon}
        </div>
      </div>
    </Card>
  );
};
