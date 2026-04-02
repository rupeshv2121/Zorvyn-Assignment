import { getPrismaClient } from "../config";
import {
  CreateUserDTO,
  UpdateUserRoleDTO,
  UpdateUserStatusDTO,
  User,
  UserDTO,
} from "../types";
import { ConflictError, NotFoundError } from "../utils/errors";

export class UserRepository {
  private prisma = getPrismaClient();

  async create(data: CreateUserDTO & { password_hash: string }): Promise<User> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new ConflictError("Email already exists");
    }

    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        passwordHash: data.password_hash,
        role: data.role || "viewer",
        status: "active",
      },
    });

    return user as User;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    return user as User | null;
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    return user as User | null;
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    filters?: { role?: string; status?: string },
  ): Promise<{ users: User[]; total: number }> {
    const skip = (page - 1) * limit;

    const where: any = {};
    if (filters?.role) where.role = filters.role;
    if (filters?.status) where.status = filters.status;

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      users: users as User[],
      total,
    };
  }

  async updateRole(id: string, data: UpdateUserRoleDTO): Promise<User> {
    try {
      const user = await this.prisma.user.update({
        where: { id },
        data: { role: data.role },
      });

      return user as User;
    } catch (error: any) {
      if (error.code === "P2025") {
        throw new NotFoundError("User not found");
      }
      throw error;
    }
  }

  async updateStatus(id: string, data: UpdateUserStatusDTO): Promise<User> {
    try {
      const user = await this.prisma.user.update({
        where: { id },
        data: { status: data.status },
      });

      return user as User;
    } catch (error: any) {
      if (error.code === "P2025") {
        throw new NotFoundError("User not found");
      }
      throw error;
    }
  }

  toDTO(user: User): UserDTO {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      status: user.status,
      created_at: user.createdAt.toISOString(),
    };
  }
}

export const userRepository = new UserRepository();
