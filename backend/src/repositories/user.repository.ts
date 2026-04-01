import { getDatabase } from "../config";
import {
  CreateUserDTO,
  UpdateUserRoleDTO,
  UpdateUserStatusDTO,
  User,
  UserDTO,
} from "../types";
import { ConflictError, NotFoundError } from "../utils/errors";

export class UserRepository {
  private db = getDatabase();

  async create(data: CreateUserDTO & { password_hash: string }): Promise<User> {
    const { data: existingUser } = await this.db
      .from("users")
      .select("id")
      .eq("email", data.email)
      .single();

    if (existingUser) {
      throw new ConflictError("Email already exists");
    }

    const { data: user, error } = await this.db
      .from("users")
      .insert({
        email: data.email,
        password_hash: data.password_hash,
        role: data.role || "viewer",
        status: "active",
      })
      .select()
      .single();

    if (error) throw error;
    return user as User;
  }

  async findByEmail(email: string): Promise<User | null> {
    const { data, error } = await this.db
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return data as User | null;
  }

  async findById(id: string): Promise<User | null> {
    const { data, error } = await this.db
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return data as User | null;
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    filters?: { role?: string; status?: string },
  ): Promise<{ users: User[]; total: number }> {
    const offset = (page - 1) * limit;

    let query = this.db.from("users").select("*", { count: "exact" });

    if (filters?.role) {
      query = query.eq("role", filters.role);
    }

    if (filters?.status) {
      query = query.eq("status", filters.status);
    }

    const { data, error, count } = await query
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return {
      users: data as User[],
      total: count || 0,
    };
  }

  async updateRole(id: string, data: UpdateUserRoleDTO): Promise<User> {
    const { data: user, error } = await this.db
      .from("users")
      .update({ role: data.role })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        throw new NotFoundError("User not found");
      }
      throw error;
    }

    return user as User;
  }

  async updateStatus(id: string, data: UpdateUserStatusDTO): Promise<User> {
    const { data: user, error } = await this.db
      .from("users")
      .update({ status: data.status })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        throw new NotFoundError("User not found");
      }
      throw error;
    }

    return user as User;
  }

  toDTO(user: User): UserDTO {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      status: user.status,
      created_at: user.created_at,
    };
  }
}

export const userRepository = new UserRepository();
