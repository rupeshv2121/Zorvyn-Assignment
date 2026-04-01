import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../middleware";
import { userService } from "../services";
import { paginatedResponse, successResponse } from "../utils/response";

export class UserController {
  async getAllUsers(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const role = req.query.role as string | undefined;
      const status = req.query.status as string | undefined;

      const { users, total } = await userService.getAllUsers(page, limit, {
        role,
        status,
      });

      paginatedResponse(res, users, page, limit, total);
    } catch (error) {
      next(error);
    }
  }

  async getUserById(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;

      const user = await userService.getUserById(id);

      successResponse(res, user);
    } catch (error) {
      next(error);
    }
  }

  async updateUserRole(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const { role } = req.body;

      const user = await userService.updateUserRole(id, { role });

      successResponse(res, user);
    } catch (error) {
      next(error);
    }
  }

  async updateUserStatus(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const user = await userService.updateUserStatus(id, { status });

      successResponse(res, user);
    } catch (error) {
      next(error);
    }
  }
}

export const userController = new UserController();
