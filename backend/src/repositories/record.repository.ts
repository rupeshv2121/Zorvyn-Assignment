import { getDatabase } from "../config";
import {
  CreateRecordDTO,
  FinancialRecord,
  RecordFilters,
  UpdateRecordDTO,
} from "../types";
import { NotFoundError } from "../utils/errors";

export class RecordRepository {
  private db = getDatabase();

  async create(
    userId: string,
    data: CreateRecordDTO,
  ): Promise<FinancialRecord> {
    const { data: record, error } = await this.db
      .from("financial_records")
      .insert({
        user_id: userId,
        amount: data.amount,
        type: data.type,
        category: data.category,
        date: data.date,
        notes: data.notes || null,
      })
      .select()
      .single();

    if (error) throw error;
    return record as FinancialRecord;
  }

  async findById(
    id: string,
    userId: string,
    includeDeleted: boolean = false,
  ): Promise<FinancialRecord | null> {
    let query = this.db
      .from("financial_records")
      .select("*")
      .eq("id", id)
      .eq("user_id", userId);

    if (!includeDeleted) {
      query = query.is("deleted_at", null);
    }

    const { data, error } = await query.single();

    if (error && error.code !== "PGRST116") throw error;
    return data as FinancialRecord | null;
  }

  async findAll(
    userId: string,
    page: number = 1,
    limit: number = 10,
    filters?: RecordFilters,
  ): Promise<{ records: FinancialRecord[]; total: number }> {
    const offset = (page - 1) * limit;

    let query = this.db
      .from("financial_records")
      .select("*", { count: "exact" })
      .eq("user_id", userId);

    // Filter out soft-deleted records by default
    if (!filters?.includeDeleted) {
      query = query.is("deleted_at", null);
    }

    if (filters?.type) {
      query = query.eq("type", filters.type);
    }

    if (filters?.category) {
      query = query.eq("category", filters.category);
    }

    if (filters?.dateFrom) {
      query = query.gte("date", filters.dateFrom);
    }

    if (filters?.dateTo) {
      query = query.lte("date", filters.dateTo);
    }

    const { data, error, count } = await query
      .order("date", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return {
      records: data as FinancialRecord[],
      total: count || 0,
    };
  }

  async update(
    id: string,
    userId: string,
    data: UpdateRecordDTO,
  ): Promise<FinancialRecord> {
    const { data: record, error } = await this.db
      .from("financial_records")
      .update(data)
      .eq("id", id)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        throw new NotFoundError("Record not found");
      }
      throw error;
    }

    return record as FinancialRecord;
  }

  async delete(id: string, userId: string): Promise<void> {
    const { error } = await this.db
      .from("financial_records")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id)
      .eq("user_id", userId);

    if (error) throw error;
  }

  async restore(id: string, userId: string): Promise<FinancialRecord> {
    // First verify the record is actually deleted
    const { data: deletedRecord } = await this.db
      .from("financial_records")
      .select("*")
      .eq("id", id)
      .eq("user_id", userId)
      .not("deleted_at", "is", null)
      .single();

    if (!deletedRecord) {
      throw new NotFoundError("Deleted record not found");
    }

    // Now restore it
    const { data: record, error } = await this.db
      .from("financial_records")
      .update({ deleted_at: null })
      .eq("id", id)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) throw error;

    return record as FinancialRecord;
  }

  async hardDelete(id: string, userId: string): Promise<void> {
    const { error } = await this.db
      .from("financial_records")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) throw error;
  }
}

export const recordRepository = new RecordRepository();
