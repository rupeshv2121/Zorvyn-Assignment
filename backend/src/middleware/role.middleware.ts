import { NextFunction, Response } from "express";
import { ForbiddenError } from "../utils/errors";
import { AuthenticatedRequest } from "./auth.middleware";

export const requireRole = (allowedRoles: string[]) => {
  return (
    req: AuthenticatedRequest,
    _res: Response,
    next: NextFunction,
  ): void => {
    try {
      if (!req.user) {
        throw new ForbiddenError("User not authenticated");
      }

      if (!allowedRoles.includes(req.user.role)) {
        throw new ForbiddenError(
          `Access denied. Required roles: ${allowedRoles.join(", ")}`,
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
