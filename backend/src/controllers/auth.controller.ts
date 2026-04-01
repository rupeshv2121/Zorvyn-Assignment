import { NextFunction, Request, Response } from "express";
import { authService } from "../services";
import { successResponse } from "../utils/response";

export class AuthController {
  async register(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { email, password, role } = req.body;

      const result = await authService.register({ email, password, role });

      successResponse(res, result, 201);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;

      const result = await authService.login(email, password);

      successResponse(res, result);
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { refreshToken } = req.body;

      const result = await authService.refreshToken(refreshToken);

      successResponse(res, result);
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
