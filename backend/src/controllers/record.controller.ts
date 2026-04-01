import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../middleware";
import { recordService } from "../services";
import { paginatedResponse, successResponse } from "../utils/response";

export class RecordController {
  async createRecord(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user!.userId;
      const data = req.body;

      const record = await recordService.createRecord(userId, data);

      successResponse(res, record, 201);
    } catch (error) {
      next(error);
    }
  }

  async getRecordById(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { id } = req.params;

      const record = await recordService.getRecordById(id, userId);

      successResponse(res, record);
    } catch (error) {
      next(error);
    }
  }

  async getAllRecords(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user!.userId;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const filters = {
        type: req.query.type as "income" | "expense" | undefined,
        category: req.query.category as string | undefined,
        dateFrom: req.query.dateFrom as string | undefined,
        dateTo: req.query.dateTo as string | undefined,
      };

      const { records, total } = await recordService.getAllRecords(
        userId,
        page,
        limit,
        filters,
      );

      paginatedResponse(res, records, page, limit, total);
    } catch (error) {
      next(error);
    }
  }

  async updateRecord(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { id } = req.params;
      const data = req.body;

      const record = await recordService.updateRecord(id, userId, data);

      successResponse(res, record);
    } catch (error) {
      next(error);
    }
  }

  async deleteRecord(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { id } = req.params;

      await recordService.deleteRecord(id, userId);

      successResponse(res, { message: "Record deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
}

export const recordController = new RecordController();
