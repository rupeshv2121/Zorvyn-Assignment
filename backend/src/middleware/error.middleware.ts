import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { logger } from "../config";
import { AppError } from "../utils/errors";
import { errorResponse } from "../utils/response";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): Response => {
  // Zod validation errors
  if (err instanceof ZodError) {
    const errors = err.errors.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));

    logger.warn("Validation error:", { errors, path: req.path });

    return errorResponse(
      res,
      "Validation failed",
      422,
      "VALIDATION_ERROR",
      errors,
    );
  }

  // Custom application errors
  if (err instanceof AppError) {
    logger.warn("Application error:", {
      message: err.message,
      statusCode: err.statusCode,
      path: req.path,
    });

    return errorResponse(res, err.message, err.statusCode);
  }

  // Unexpected errors
  logger.error("Unexpected error:", {
    message: err.message,
    stack: err.stack,
    path: req.path,
  });

  return errorResponse(
    res,
    "An unexpected error occurred",
    500,
    "INTERNAL_ERROR",
  );
};

export const notFoundHandler = (req: Request, res: Response): Response => {
  return errorResponse(
    res,
    `Route ${req.method} ${req.path} not found`,
    404,
    "NOT_FOUND",
  );
};
