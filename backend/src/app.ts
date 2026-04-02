import compression from "compression";
import cors from "cors";
import express, { Application } from "express";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import { env, logger } from "./config";
import { swaggerSpec } from "./config/swagger";
import { apiLimiter, errorHandler, notFoundHandler } from "./middleware";
import routes from "./routes";

export const createApp = (): Application => {
  const app = express();
  const allowedOrigins = env.CORS_ORIGINS ?? [env.FRONTEND_URL];
  const corsOptions: cors.CorsOptions = {
    origin: (origin, callback) => {
      // Allow non-browser clients like curl/Postman (no Origin header)
      if (!origin) {
        callback(null, true);
        return;
      }

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  };

  // Security middleware
  app.use(
    helmet({
      contentSecurityPolicy: false, // Disable CSP for Swagger UI
    }),
  );
  app.use(cors(corsOptions));
  app.options("*", cors(corsOptions));

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

  // Swagger API Documentation
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customCss: ".swagger-ui .topbar { display: none }",
      customSiteTitle: "Finance Dashboard API Documentation",
    }),
  );

  // Swagger JSON
  app.get("/api-docs.json", (_req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  // API routes
  app.use("/api", routes);

  // 404 handler
  app.use(notFoundHandler);

  // Error handler (must be last)
  app.use(errorHandler);

  return app;
};
