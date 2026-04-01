const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Finance Dashboard Backend - Step 3\n');

// Directory structure
const dirs = [
  'src',
  'src/config',
  'src/types',
  'src/validations',
  'src/middleware',
  'src/repositories',
  'src/services',
  'src/controllers',
  'src/routes',
  'src/utils',
  'logs'
];

// Files to create with their content
const files = {
  // ========== CONFIG FILES ==========
  'src/config/env.ts': `import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('5000'),
  
  // Supabase
  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  
  // JWT
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_ACCESS_EXPIRY: z.string().default('15m'),
  JWT_REFRESH_EXPIRY: z.string().default('7d'),
  
  // CORS
  FRONTEND_URL: z.string().url().default('http://localhost:5173'),
  
  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.string().transform(Number).default('900000'),
  RATE_LIMIT_MAX_REQUESTS: z.string().transform(Number).default('5'),
  
  // Logging
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
});

export type Env = z.infer<typeof envSchema>;

let env: Env;

try {
  env = envSchema.parse(process.env);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error('❌ Environment validation failed:');
    console.error(error.errors.map(e => \`  - \${e.path.join('.')}: \${e.message}\`).join('\\n'));
    process.exit(1);
  }
  throw error;
}

export { env };
`,

  'src/config/database.ts': `import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env } from './env';
import { logger } from './logger';

let supabase: SupabaseClient;

export const initializeDatabase = (): SupabaseClient => {
  try {
    supabase = createClient(
      env.SUPABASE_URL,
      env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    logger.info('✅ Database connection initialized');
    return supabase;
  } catch (error) {
    logger.error('❌ Failed to initialize database:', error);
    throw error;
  }
};

export const getDatabase = (): SupabaseClient => {
  if (!supabase) {
    return initializeDatabase();
  }
  return supabase;
};

export { supabase };
`,

  'src/config/logger.ts': `import winston from 'winston';
import { env } from './env';

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  debug: 'blue',
};

winston.addColors(colors);

const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

const consoleFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(
    (info) => \`\${info.timestamp} \${info.level}: \${info.message}\`
  )
);

const transports = [
  new winston.transports.Console({
    format: consoleFormat,
  }),
];

// Add file transport in production
if (env.NODE_ENV === 'production') {
  transports.push(
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  );
}

export const logger = winston.createLogger({
  level: env.LOG_LEVEL,
  levels,
  format,
  transports,
  exitOnError: false,
});

// Handle uncaught exceptions and rejections
if (env.NODE_ENV === 'production') {
  logger.exceptions.handle(
    new winston.transports.File({ filename: 'logs/exceptions.log' })
  );

  logger.rejections.handle(
    new winston.transports.File({ filename: 'logs/rejections.log' })
  );
}
`,

  'src/config/index.ts': `export { env } from './env';
export { getDatabase, initializeDatabase } from './database';
export { logger } from './logger';
`,

  // ========== UTILS - ERROR HANDLING ==========
  'src/utils/errors.ts': `export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public isOperational: boolean = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string = 'Bad Request') {
    super(message, 400);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden') {
    super(message, 403);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Conflict') {
    super(message, 409);
  }
}

export class ValidationError extends AppError {
  constructor(message: string = 'Validation failed') {
    super(message, 422);
  }
}

export class InternalServerError extends AppError {
  constructor(message: string = 'Internal server error') {
    super(message, 500, false);
  }
}
`,

  'src/utils/response.ts': `import { Response } from 'express';

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
  meta?: ApiResponse['meta']
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
  details?: any
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
  total: number
): Response => {
  const totalPages = Math.ceil(total / limit);

  return successResponse(res, data, 200, {
    page,
    limit,
    total,
    totalPages,
  });
};
`,

  'src/utils/jwt.ts': `import jwt from 'jsonwebtoken';
import { env } from '../config';
import { UnauthorizedError } from './errors';

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

export const generateAccessToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRY,
  });
};

export const generateRefreshToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRY,
  });
};

export const verifyAccessToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedError('Access token expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new UnauthorizedError('Invalid access token');
    }
    throw new UnauthorizedError('Token verification failed');
  }
};

export const verifyRefreshToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, env.JWT_REFRESH_SECRET) as JwtPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedError('Refresh token expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new UnauthorizedError('Invalid refresh token');
    }
    throw new UnauthorizedError('Token verification failed');
  }
};
`,

  'src/utils/password.ts': `import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

export const comparePassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};
`,

  'src/utils/index.ts': `export * from './errors';
export * from './response';
export * from './jwt';
export * from './password';
`,

  // ========== MIDDLEWARE ==========
  'src/middleware/error.middleware.ts': `import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/errors';
import { errorResponse } from '../utils/response';
import { logger } from '../config';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): Response => {
  // Zod validation errors
  if (err instanceof ZodError) {
    const errors = err.errors.map(e => ({
      field: e.path.join('.'),
      message: e.message,
    }));

    logger.warn('Validation error:', { errors, path: req.path });

    return errorResponse(
      res,
      'Validation failed',
      422,
      'VALIDATION_ERROR',
      errors
    );
  }

  // Custom application errors
  if (err instanceof AppError) {
    logger.warn('Application error:', {
      message: err.message,
      statusCode: err.statusCode,
      path: req.path,
    });

    return errorResponse(res, err.message, err.statusCode);
  }

  // Unexpected errors
  logger.error('Unexpected error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
  });

  return errorResponse(
    res,
    'An unexpected error occurred',
    500,
    'INTERNAL_ERROR'
  );
};

export const notFoundHandler = (req: Request, res: Response): Response => {
  return errorResponse(
    res,
    \`Route \${req.method} \${req.path} not found\`,
    404,
    'NOT_FOUND'
  );
};
`,

  'src/middleware/auth.middleware.ts': `import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../utils/errors';
import { verifyAccessToken } from '../utils/jwt';

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

export const requireAuth = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('No token provided');
    }

    const token = authHeader.substring(7);
    const payload = verifyAccessToken(token);

    req.user = {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    };

    next();
  } catch (error) {
    next(error);
  }
};
`,

  'src/middleware/role.middleware.ts': `import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth.middleware';
import { ForbiddenError } from '../utils/errors';

export const requireRole = (allowedRoles: string[]) => {
  return (
    req: AuthenticatedRequest,
    _res: Response,
    next: NextFunction
  ): void => {
    try {
      if (!req.user) {
        throw new ForbiddenError('User not authenticated');
      }

      if (!allowedRoles.includes(req.user.role)) {
        throw new ForbiddenError(
          \`Access denied. Required roles: \${allowedRoles.join(', ')}\`
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
`,

  'src/middleware/validate.middleware.ts': `import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

export const validate = (schema: AnyZodObject) => {
  return async (
    req: Request,
    _res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(error);
      } else {
        next(new Error('Validation failed'));
      }
    }
  };
};
`,

  'src/middleware/rateLimiter.middleware.ts': `import rateLimit from 'express-rate-limit';
import { env } from '../config';

export const authLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX_REQUESTS,
  message: 'Too many login attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});
`,

  'src/middleware/index.ts': `export * from './auth.middleware';
export * from './role.middleware';
export * from './validate.middleware';
export * from './error.middleware';
export * from './rateLimiter.middleware';
`,

  // ========== VALIDATION SCHEMAS ==========
  'src/validations/auth.validation.ts': `import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    role: z.enum(['viewer', 'analyst', 'admin']).default('viewer'),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});

export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, 'Refresh token is required'),
  }),
});
`,

  'src/validations/user.validation.ts': `import { z } from 'zod';

export const updateRoleSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid user ID'),
  }),
  body: z.object({
    role: z.enum(['viewer', 'analyst', 'admin']),
  }),
});

export const updateStatusSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid user ID'),
  }),
  body: z.object({
    status: z.enum(['active', 'inactive']),
  }),
});

export const getUsersSchema = z.object({
  query: z.object({
    page: z.string().transform(Number).default('1'),
    limit: z.string().transform(Number).default('10'),
    role: z.enum(['viewer', 'analyst', 'admin']).optional(),
    status: z.enum(['active', 'inactive']).optional(),
  }),
});
`,

  'src/validations/record.validation.ts': `import { z } from 'zod';

export const createRecordSchema = z.object({
  body: z.object({
    amount: z.number().positive('Amount must be positive'),
    type: z.enum(['income', 'expense']),
    category: z.string().min(1, 'Category is required').max(100),
    date: z.string().regex(/^\\d{4}-\\d{2}-\\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
    notes: z.string().max(500, 'Notes too long').optional(),
  }),
});

export const updateRecordSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid record ID'),
  }),
  body: z.object({
    amount: z.number().positive('Amount must be positive').optional(),
    type: z.enum(['income', 'expense']).optional(),
    category: z.string().min(1).max(100).optional(),
    date: z.string().regex(/^\\d{4}-\\d{2}-\\d{2}$/, 'Invalid date format').optional(),
    notes: z.string().max(500).optional(),
  }),
});

export const getRecordsSchema = z.object({
  query: z.object({
    page: z.string().transform(Number).default('1'),
    limit: z.string().transform(Number).default('10'),
    type: z.enum(['income', 'expense']).optional(),
    category: z.string().optional(),
    dateFrom: z.string().regex(/^\\d{4}-\\d{2}-\\d{2}$/).optional(),
    dateTo: z.string().regex(/^\\d{4}-\\d{2}-\\d{2}$/).optional(),
  }),
});

export const getRecordByIdSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid record ID'),
  }),
});

export const deleteRecordSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid record ID'),
  }),
});
`,

  'src/validations/index.ts': `export * from './auth.validation';
export * from './user.validation';
export * from './record.validation';
`,

  // ========== TYPES ==========
  'src/types/user.types.ts': `export type UserRole = 'viewer' | 'analyst' | 'admin';
export type UserStatus = 'active' | 'inactive';

export interface User {
  id: string;
  email: string;
  password_hash: string;
  role: UserRole;
  status: UserStatus;
  created_at: string;
  updated_at: string;
}

export interface UserDTO {
  id: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  created_at: string;
}

export interface CreateUserDTO {
  email: string;
  password: string;
  role?: UserRole;
}

export interface UpdateUserRoleDTO {
  role: UserRole;
}

export interface UpdateUserStatusDTO {
  status: UserStatus;
}
`,

  'src/types/record.types.ts': `export type RecordType = 'income' | 'expense';

export interface FinancialRecord {
  id: string;
  user_id: string;
  amount: number;
  type: RecordType;
  category: string;
  date: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateRecordDTO {
  amount: number;
  type: RecordType;
  category: string;
  date: string;
  notes?: string;
}

export interface UpdateRecordDTO {
  amount?: number;
  type?: RecordType;
  category?: string;
  date?: string;
  notes?: string;
}

export interface RecordFilters {
  type?: RecordType;
  category?: string;
  dateFrom?: string;
  dateTo?: string;
}
`,

  'src/types/dashboard.types.ts': `export interface DashboardSummary {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  period: string;
}

export interface CategoryBreakdown {
  category: string;
  total: number;
  percentage: number;
}

export interface MonthlyTrend {
  month: string;
  income: number;
  expense: number;
  net: number;
}
`,

  'src/types/express.d.ts': `import { JwtPayload } from '../utils/jwt';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
`,

  'src/types/index.ts': `export * from './user.types';
export * from './record.types';
export * from './dashboard.types';
`,
};

// Create directories
console.log('📁 Creating directory structure...\n');
dirs.forEach(dir => {
  const fullPath = path.join(__dirname, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`  ✓ Created: ${dir}`);
  }
});

// Create files
console.log('\n📝 Creating implementation files...\n');
Object.entries(files).forEach(([filePath, content]) => {
  const fullPath = path.join(__dirname, filePath);
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`  ✓ Created: ${filePath}`);
});

console.log('\n✅ Step 3 Backend Core Implementation Complete!\n');
console.log('Created:');
console.log('  - 4 config files (env, database, logger, index)');
console.log('  - 4 utility files (errors, response, jwt, password)');
console.log('  - 5 middleware files (auth, role, validate, error, rate limiter)');
console.log('  - 3 validation files (auth, user, record)');
console.log('  - 4 type files (user, record, dashboard, express)');
console.log('\nTotal: 20 files created!\n');
console.log('Next: Step 4 - Authentication & User Management');
