import swaggerJsdoc from "swagger-jsdoc";
import { env } from "./env";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Finance Dashboard API",
    version: "1.0.0",
    description:
      "Production-quality Finance Dashboard API with RBAC (Role-Based Access Control)",
    contact: {
      name: "API Support",
    },
    license: {
      name: "MIT",
      url: "https://opensource.org/licenses/MIT",
    },
  },
  servers: [
    {
      url: `http://localhost:${env.PORT}/api`,
      description: "Development server",
    },
    {
      url: `${env.FRONTEND_URL}/api`,
      description: "Production server",
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Enter your JWT token",
      },
    },
    schemas: {
      Error: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
            example: false,
          },
          error: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "Error message",
              },
              code: {
                type: "string",
                example: "ERROR_CODE",
              },
            },
          },
        },
      },
      User: {
        type: "object",
        properties: {
          id: {
            type: "string",
            format: "uuid",
            example: "550e8400-e29b-41d4-a716-446655440000",
          },
          email: {
            type: "string",
            format: "email",
            example: "user@example.com",
          },
          role: {
            type: "string",
            enum: ["viewer", "analyst", "admin"],
            example: "viewer",
          },
          status: {
            type: "string",
            enum: ["active", "inactive"],
            example: "active",
          },
          created_at: {
            type: "string",
            format: "date-time",
            example: "2024-01-01T00:00:00.000Z",
          },
        },
      },
      FinancialRecord: {
        type: "object",
        properties: {
          id: {
            type: "string",
            format: "uuid",
            example: "550e8400-e29b-41d4-a716-446655440000",
          },
          userId: {
            type: "string",
            format: "uuid",
            example: "550e8400-e29b-41d4-a716-446655440000",
          },
          amount: {
            type: "number",
            format: "decimal",
            example: 1500.5,
          },
          type: {
            type: "string",
            enum: ["income", "expense"],
            example: "income",
          },
          category: {
            type: "string",
            example: "Salary",
          },
          date: {
            type: "string",
            format: "date",
            example: "2024-01-15",
          },
          notes: {
            type: "string",
            nullable: true,
            example: "Monthly salary payment",
          },
          deletedAt: {
            type: "string",
            format: "date-time",
            nullable: true,
            example: null,
          },
          createdAt: {
            type: "string",
            format: "date-time",
            example: "2024-01-01T00:00:00.000Z",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
            example: "2024-01-01T00:00:00.000Z",
          },
        },
      },
    },
  },
  tags: [
    {
      name: "Authentication",
      description: "User authentication and authorization endpoints",
    },
    {
      name: "Users",
      description: "User management endpoints (Admin only)",
    },
    {
      name: "Records",
      description: "Financial records management (Analyst & Admin)",
    },
    {
      name: "Dashboard",
      description:
        "Dashboard analytics and statistics (All authenticated users)",
    },
  ],
};

const options: swaggerJsdoc.Options = {
  swaggerDefinition,
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
