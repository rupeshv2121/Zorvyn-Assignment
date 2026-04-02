export type RecordType = "income" | "expense";

export interface FinancialRecord {
  id: string;
  userId: string; // Changed from user_id
  amount: number;
  type: RecordType;
  category: string;
  date: Date; // Changed from string to Date
  notes?: string | null;
  deletedAt?: Date | null; // Changed from deleted_at and string to Date
  createdAt: Date; // Changed from created_at and string to Date
  updatedAt: Date; // Changed from updated_at and string to Date
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
