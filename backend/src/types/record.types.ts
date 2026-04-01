export type RecordType = "income" | "expense";

export interface FinancialRecord {
  id: string;
  user_id: string;
  amount: number;
  type: RecordType;
  category: string;
  date: string;
  notes?: string;
  deleted_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateRecordDTO {
  amount: number;
  type: RecordType;
  category: string;
  date: string;
  notes?: string;
}

export interface UpdateRecordDTO {
  amount?: number;
  type?: RecordType;
  category?: string;
  date?: string;
  notes?: string;
}

export interface RecordFilters {
  type?: RecordType;
  category?: string;
  dateFrom?: string;
  dateTo?: string;
  includeDeleted?: boolean;
}
