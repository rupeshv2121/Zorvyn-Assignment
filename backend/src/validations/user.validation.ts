import { z } from "zod";

export const updateRoleSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid user ID"),
  }),
  body: z.object({
    role: z.enum(["viewer", "analyst", "admin"]),
  }),
});

export const updateStatusSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid user ID"),
  }),
  body: z.object({
    status: z.enum(["active", "inactive"]),
  }),
});

export const getUsersSchema = z.object({
  query: z.object({
    page: z.string().transform(Number).default("1"),
    limit: z.string().transform(Number).default("10"),
    role: z.enum(["viewer", "analyst", "admin"]).optional(),
    status: z.enum(["active", "inactive"]).optional(),
  }),
});
