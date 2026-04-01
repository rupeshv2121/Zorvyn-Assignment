export type UserRole = "viewer" | "analyst" | "admin";
export type UserStatus = "active" | "inactive";

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
