import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/utils/password";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clear existing data
  await prisma.financialRecord.deleteMany();
  await prisma.user.deleteMany();

  // Create test users
  const adminHashedPassword = await hashPassword("password123");
  const analystHashedPassword = await hashPassword("password123");
  const viewerHashedPassword = await hashPassword("password123");

  const admin = await prisma.user.create({
    data: {
      email: "admin@example.com",
      passwordHash: adminHashedPassword,
      role: "admin",
      status: "active",
    },
  });

  const analyst = await prisma.user.create({
    data: {
      email: "analyst@example.com",
      passwordHash: analystHashedPassword,
      role: "analyst",
      status: "active",
    },
  });

  const viewer = await prisma.user.create({
    data: {
      email: "viewer@example.com",
      passwordHash: viewerHashedPassword,
      role: "viewer",
      status: "active",
    },
  });

  console.log("✅ Users created:", { admin, analyst, viewer });

  // Create sample financial records for analyst
  const records = await Promise.all([
    prisma.financialRecord.create({
      data: {
        userId: analyst.id,
        amount: 5000,
        type: "income",
        category: "Salary",
        date: new Date("2026-04-01"),
        notes: "Monthly salary",
      },
    }),
    prisma.financialRecord.create({
      data: {
        userId: analyst.id,
        amount: 1200,
        type: "expense",
        category: "Rent",
        date: new Date("2026-04-05"),
        notes: "Monthly rent",
      },
    }),
    prisma.financialRecord.create({
      data: {
        userId: analyst.id,
        amount: 150,
        type: "expense",
        category: "Groceries",
        date: new Date("2026-04-10"),
        notes: "Weekly groceries",
      },
    }),
    prisma.financialRecord.create({
      data: {
        userId: analyst.id,
        amount: 500,
        type: "income",
        category: "Freelance",
        date: new Date("2026-04-15"),
        notes: "Side project payment",
      },
    }),
  ]);

  console.log("✅ Records created:", records.length, "records");
  console.log("\n📊 Seed completed successfully!");
  console.log("Test credentials:");
  console.log("  Admin: admin@example.com / password123");
  console.log("  Analyst: analyst@example.com / password123");
  console.log("  Viewer: viewer@example.com / password123");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
