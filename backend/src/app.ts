import compression from "compression";
import cors from "cors";
import express, { Application } from "express";
import helmet from "helmet";
import { env, logger } from "./config";
import { apiLimiter, errorHandler, notFoundHandler } from "./middleware";
import routes from "./routes";

export const createApp = (): Application => {
  const app = express();

  // Security middleware
  app.use(helmet());
  app.use(
    cors({
      origin: env.FRONTEND_URL,
      credentials: true,
    }),
  );

  // Body parsing middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Compression middleware
  app.use(compression());

  // Rate limiting (global)
  app.use(apiLimiter);

  // Request logging
  app.use((req, _res, next) => {
    logger.info(`${req.method} ${req.path}`);
    next();
  });

  // Health check endpoint
  app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // API routes
  app.use("/api", routes);

  // 404 handler
  app.use(notFoundHandler);

  // Error handler (must be last)
  app.use(errorHandler);

  return app;
};
