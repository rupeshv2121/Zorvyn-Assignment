import { Response } from "express";

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: any;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export const successResponse = <T>(
  res: Response,
  data: T,
  statusCode: number = 200,
  meta?: ApiResponse["meta"],
): Response => {
  const response: ApiResponse<T> = {
    success: true,
    data,
  };

  if (meta) {
    response.meta = meta;
  }

  return res.status(statusCode).json(response);
};

export const errorResponse = (
  res: Response,
  message: string,
  statusCode: number = 500,
  code?: string,
  details?: any,
): Response => {
  const response: ApiResponse = {
    success: false,
    error: {
      message,
      code,
      details,
    },
  };

  return res.status(statusCode).json(response);
};

export const paginatedResponse = <T>(
  res: Response,
  data: T[],
  page: number,
  limit: number,
  total: number,
): Response => {
  const totalPages = Math.ceil(total / limit);

  return successResponse(res, data, 200, {
    page,
    limit,
    total,
    totalPages,
  });
};
