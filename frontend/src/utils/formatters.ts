import { format } from 'date-fns';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const formatDate = (date: string): string => {
  return format(new Date(date), 'MMM dd, yyyy');
};

export const formatDateTime = (date: string): string => {
  return format(new Date(date), 'MMM dd, yyyy HH:mm');
};

export const formatMonthYear = (month: string): string => {
  const [year, monthNum] = month.split('-');
  const date = new Date(parseInt(year), parseInt(monthNum) - 1);
  return format(date, 'MMM yyyy');
};
