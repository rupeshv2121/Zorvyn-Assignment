import React from 'react';
import { Table, Button } from '../common';
import { FinancialRecord } from '../../types';
import { formatCurrency, formatDate } from '../../utils';

interface RecordTableProps {
  records: FinancialRecord[];
  isLoading: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const RecordTable: React.FC<RecordTableProps> = ({
  records,
  isLoading,
  onEdit,
  onDelete,
}) => {
  const columns = [
    {
      key: 'date',
      header: 'Date',
      render: (row: FinancialRecord) => formatDate(row.date),
    },
    { key: 'category', header: 'Category' },
    {
      key: 'type',
      header: 'Type',
      render: (row: FinancialRecord) => (
        <span
          className={`px-2 py-1 text-xs font-semibold rounded-full ${
            row.type === 'income'
              ? 'bg-success-100 text-success-800'
              : 'bg-danger-100 text-danger-800'
          }`}
        >
          {row.type}
        </span>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (row: FinancialRecord) => (
        <span className={row.type === 'income' ? 'text-success-600' : 'text-danger-600'}>
          {row.type === 'income' ? '+' : '-'}
          {formatCurrency(row.amount)}
        </span>
      ),
    },
    { key: 'notes', header: 'Notes' },
    {
      key: 'actions',
      header: 'Actions',
      render: (row: FinancialRecord) => (
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => onEdit(row.id)}>
            Edit
          </Button>
          <Button variant="danger" onClick={() => onDelete(row.id)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return <Table data={records} columns={columns} isLoading={isLoading} />;
};
