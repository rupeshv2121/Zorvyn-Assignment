import { createApp } from "./app";
import { env, initializeDatabase, logger } from "./config";

const startServer = async () => {
  try {
    // Initialize database
    initializeDatabase();

    // Create Express app
    const app = createApp();

    // Start server
    const server = app.listen(env.PORT, () => {
      logger.info(`🚀 Server running on port ${env.PORT}`);
      logger.info(`📝 Environment: ${env.NODE_ENV}`);
      logger.info(`🔗 Frontend URL: ${env.FRONTEND_URL}`);
      logger.info(`✅ Server is ready to accept connections`);
    });

    // Graceful shutdown
    const gracefulShutdown = (signal: string) => {
      logger.info(`\n${signal} received, closing server gracefully...`);

      server.close(() => {
        logger.info("Server closed");
        process.exit(0);
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        logger.error("Forcing shutdown after timeout");
        process.exit(1);
      }, 10000);
    };

    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
