import { z } from "zod";

export const createRecordSchema = z.object({
  body: z.object({
    amount: z.number().positive("Amount must be positive"),
    type: z.enum(["income", "expense"]),
    category: z.string().min(1, "Category is required").max(100),
    date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
    notes: z.string().max(500, "Notes too long").optional(),
  }),
});

export const updateRecordSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid record ID"),
  }),
  body: z.object({
    amount: z.number().positive("Amount must be positive").optional(),
    type: z.enum(["income", "expense"]).optional(),
    category: z.string().min(1).max(100).optional(),
    date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")
      .optional(),
    notes: z.string().max(500).optional(),
  }),
});

export const getRecordsSchema = z.object({
  query: z.object({
    page: z.string().transform(Number).default("1"),
    limit: z.string().transform(Number).default("10"),
    type: z.enum(["income", "expense"]).optional(),
    category: z.string().optional(),
    dateFrom: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .optional(),
    dateTo: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .optional(),
  }),
});

export const getRecordByIdSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid record ID"),
  }),
});

export const deleteRecordSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid record ID"),
  }),
});
