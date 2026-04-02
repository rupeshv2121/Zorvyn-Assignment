import { PrismaClient } from "@prisma/client";
import { env } from "../config/env";

let prisma: PrismaClient;

export const getPrismaClient = (): PrismaClient => {
  if (!prisma) {
    prisma = new PrismaClient({
      log:
        env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    });
  }
  return prisma;
};

export const initializePrisma = async (): Promise<void> => {
  const client = getPrismaClient();
  try {
    await client.$connect();
    console.log("✅ Prisma database connection established");
  } catch (error) {
    console.error("❌ Failed to connect to database with Prisma:", error);
    throw error;
  }
};

export const disconnectPrisma = async (): Promise<void> => {
  if (prisma) {
    await prisma.$disconnect();
  }
};

export default getPrismaClient();
