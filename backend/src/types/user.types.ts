export type UserRole = "viewer" | "analyst" | "admin";
export type UserStatus = "active" | "inactive";

export interface User {
  id: string;
  email: string;
  passwordHash: string; // Changed from password_hash to match Prisma
  role: UserRole;
  status: UserStatus;
  createdAt: Date; // Changed from created_at and string to Date
  updatedAt: Date; // Changed from updated_at and string to Date
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
