export interface FinancialRecord {
  id: string;
  user_id: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}
