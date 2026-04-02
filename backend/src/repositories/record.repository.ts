import { getPrismaClient } from "../config";
import { Prisma } from "@prisma/client";
import {
  CreateRecordDTO,
  FinancialRecord,
  RecordFilters,
  UpdateRecordDTO,
} from "../types";
import { NotFoundError } from "../utils/errors";

export class RecordRepository {
  private prisma = getPrismaClient();
  private toFinancialRecord(
    record: Prisma.FinancialRecordGetPayload<Record<string, never>>,
  ): FinancialRecord {
    return {
      ...record,
      amount: Number(record.amount),
    };
  }

  async create(
    userId: string,
    data: CreateRecordDTO,
  ): Promise<FinancialRecord> {
    const record = await this.prisma.financialRecord.create({
      data: {
        userId,
        amount: data.amount,
        type: data.type,
        category: data.category,
        date: new Date(data.date),
        notes: data.notes || null,
      },
    });

    return this.toFinancialRecord(record);
  }

  async findById(
    id: string,
    userId: string,
    includeDeleted: boolean = false,
  ): Promise<FinancialRecord | null> {
    const where: any = { id, userId };

    if (!includeDeleted) {
      where.deletedAt = null;
    }

    const record = await this.prisma.financialRecord.findFirst({
      where,
    });

    return record ? this.toFinancialRecord(record) : null;
  }

  async findAll(
    userId: string,
    page: number = 1,
    limit: number = 10,
    filters?: RecordFilters,
  ): Promise<{ records: FinancialRecord[]; total: number }> {
    const skip = (page - 1) * limit;

    const where: any = { userId };

    // Filter out soft-deleted records by default
    if (!filters?.includeDeleted) {
      where.deletedAt = null;
    }

    if (filters?.type) {
      where.type = filters.type;
    }

    if (filters?.category) {
      where.category = filters.category;
    }

    if (filters?.dateFrom || filters?.dateTo) {
      where.date = {};
      if (filters.dateFrom) {
        where.date.gte = new Date(filters.dateFrom);
      }
      if (filters.dateTo) {
        where.date.lte = new Date(filters.dateTo);
      }
    }

    const [records, total] = await Promise.all([
      this.prisma.financialRecord.findMany({
        where,
        skip,
        take: limit,
        orderBy: { date: "desc" },
      }),
      this.prisma.financialRecord.count({ where }),
    ]);

    return {
      records: records.map((record) => this.toFinancialRecord(record)),
      total,
    };
  }

  async update(
    id: string,
    userId: string,
    data: UpdateRecordDTO,
  ): Promise<FinancialRecord> {
    try {
      const updateData: any = {};
      if (data.amount !== undefined) updateData.amount = data.amount;
      if (data.type !== undefined) updateData.type = data.type;
      if (data.category !== undefined) updateData.category = data.category;
      if (data.date !== undefined) updateData.date = new Date(data.date);
      if (data.notes !== undefined) updateData.notes = data.notes;

      const record = await this.prisma.financialRecord.update({
        where: { id, userId },
        data: updateData,
      });

      return this.toFinancialRecord(record);
    } catch (error: any) {
      if (error.code === "P2025") {
        throw new NotFoundError("Record not found");
      }
      throw error;
    }
  }

  async delete(id: string, userId: string): Promise<void> {
    await this.prisma.financialRecord.update({
      where: { id, userId },
      data: { deletedAt: new Date() },
    });
  }

  async restore(id: string, userId: string): Promise<FinancialRecord> {
    // First verify the record is actually deleted
    const deletedRecord = await this.prisma.financialRecord.findFirst({
      where: {
        id,
        userId,
        deletedAt: { not: null },
      },
    });

    if (!deletedRecord) {
      throw new NotFoundError("Deleted record not found");
    }

    // Now restore it
    const record = await this.prisma.financialRecord.update({
      where: { id, userId },
      data: { deletedAt: null },
    });

    return this.toFinancialRecord(record);
  }

  async hardDelete(id: string, userId: string): Promise<void> {
    await this.prisma.financialRecord.delete({
      where: { id, userId },
    });
  }
}

export const recordRepository = new RecordRepository();
