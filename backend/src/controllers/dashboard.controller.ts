import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../middleware";
import { dashboardService } from "../services";
import { successResponse } from "../utils/response";

export class DashboardController {
  async getSummary(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user!.userId;

      const summary = await dashboardService.getSummary(userId);

      successResponse(res, summary);
    } catch (error) {
      next(error);
    }
  }

  async getCategoryBreakdown(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user!.userId;

      const breakdown = await dashboardService.getCategoryBreakdown(userId);

      successResponse(res, breakdown);
    } catch (error) {
      next(error);
    }
  }

  async getMonthlyTrends(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user!.userId;

      const trends = await dashboardService.getMonthlyTrends(userId);

      successResponse(res, trends);
    } catch (error) {
      next(error);
    }
  }

  async getRecentRecords(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user!.userId;
      const limit = Number(req.query.limit) || 10;

      const records = await dashboardService.getRecentRecords(userId, limit);

      successResponse(res, records);
    } catch (error) {
      next(error);
    }
  }
}

export const dashboardController = new DashboardController();
