import React from 'react';
import { Card } from '../common/Card';
import { formatCurrency } from '../../utils';

interface SummaryCardProps {
  title: string;
  value: number;
  icon: string;
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
          <span className="text-2xl">{icon}</span>
        </div>
      </div>
    </Card>
  );
};
