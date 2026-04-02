import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.string().transform(Number).default("5000"),

  // Database (Prisma)
  DATABASE_URL: z.string().url(),

  // Supabase (Optional - only if using Supabase features)
  SUPABASE_URL: z
    .string()
    .url()
    .optional()
    .refine(
      (value) =>
        !value || value.startsWith("http://") || value.startsWith("https://"),
      {
        message:
          "Must be a valid HTTP or HTTPS URL (for example: https://<project-ref>.supabase.co)",
      },
    ),
  SUPABASE_ANON_KEY: z.string().min(1).optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),

  // JWT
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_ACCESS_EXPIRY: z.string().default("15m"),
  JWT_REFRESH_EXPIRY: z.string().default("7d"),

  // CORS
  FRONTEND_URL: z.string().url().default("http://localhost:5173"),
  CORS_ORIGINS: z
    .string()
    .optional()
    .transform((value, ctx) => {
      if (!value) {
        return undefined;
      }

      const origins = value
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean);

      if (origins.length === 0) {
        return undefined;
      }

      for (const origin of origins) {
        try {
          new URL(origin);
        } catch {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Invalid CORS origin URL: ${origin}`,
          });
          return z.NEVER;
        }
      }

      return origins;
    }),

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.string().transform(Number).default("900000"),
  RATE_LIMIT_MAX_REQUESTS: z.string().transform(Number).default("100"),

  // Logging
  LOG_LEVEL: z.enum(["error", "warn", "info", "debug"]).default("info"),
});

export type Env = z.infer<typeof envSchema>;

let env: Env;

try {
  env = envSchema.parse(process.env);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error("❌ Environment validation failed:");
    console.error(
      error.errors
        .map((e) => `  - ${e.path.join(".")}: ${e.message}`)
        .join("\n"),
    );
    process.exit(1);
  }
  throw error;
}

export { env };
