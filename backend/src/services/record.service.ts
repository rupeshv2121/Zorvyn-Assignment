import { recordRepository } from "../repositories";
import {
  CreateRecordDTO,
  FinancialRecord,
  RecordFilters,
  UpdateRecordDTO,
} from "../types";
import { NotFoundError } from "../utils/errors";

export class RecordService {
  async createRecord(
    userId: string,
    data: CreateRecordDTO,
  ): Promise<FinancialRecord> {
    return recordRepository.create(userId, data);
  }

  async getRecordById(id: string, userId: string): Promise<FinancialRecord> {
    const record = await recordRepository.findById(id, userId);

    if (!record) {
      throw new NotFoundError("Record not found");
    }

    return record;
  }

  async getAllRecords(
    userId: string,
    page: number = 1,
    limit: number = 10,
    filters?: RecordFilters,
  ): Promise<{ records: FinancialRecord[]; total: number }> {
    return recordRepository.findAll(userId, page, limit, filters);
  }

  async updateRecord(
    id: string,
    userId: string,
    data: UpdateRecordDTO,
  ): Promise<FinancialRecord> {
    return recordRepository.update(id, userId, data);
  }

  async deleteRecord(id: string, userId: string): Promise<void> {
    // Verify record exists first
    const record = await recordRepository.findById(id, userId, false);

    if (!record) {
      throw new NotFoundError("Record not found");
    }

    await recordRepository.delete(id, userId);
  }

  async restoreRecord(id: string, userId: string): Promise<FinancialRecord> {
    // Verify deleted record exists
    const record = await recordRepository.findById(id, userId, true);

    if (!record || !record.deletedAt) {
      throw new NotFoundError("Deleted record not found");
    }

    return recordRepository.restore(id, userId);
  }

  async deleteRecordPermanently(id: string, userId: string): Promise<void> {
    // Verify record exists first (including soft-deleted)
    const record = await recordRepository.findById(id, userId, true);

    if (!record) {
      throw new NotFoundError("Record not found");
    }

    await recordRepository.hardDelete(id, userId);
  }
}

export const recordService = new RecordService();
