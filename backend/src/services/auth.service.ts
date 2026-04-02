import { userRepository } from "../repositories";
import { CreateUserDTO, UserDTO } from "../types";
import {
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
  hashPassword,
  verifyRefreshToken,
} from "../utils";
import { UnauthorizedError } from "../utils/errors";

export class AuthService {
  async register(
    data: CreateUserDTO,
  ): Promise<{ user: UserDTO; accessToken: string; refreshToken: string }> {
    // Hash password
    const passwordHash = await hashPassword(data.password);

    // Create user
    const user = await userRepository.create({
      ...data,
      password_hash: passwordHash,  // Repository expects snake_case for DB insert
    });

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user: userRepository.toDTO(user),
      accessToken,
      refreshToken,
    };
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ user: UserDTO; accessToken: string; refreshToken: string }> {
    // Find user
    const user = await userRepository.findByEmail(email);

    if (!user) {
      throw new UnauthorizedError("Invalid credentials");
    }

    // Check if user is active
    if (user.status !== "active") {
      throw new UnauthorizedError("Account is inactive");
    }

    // Verify password
    const isValidPassword = await comparePassword(password, user.passwordHash);

    if (!isValidPassword) {
      throw new UnauthorizedError("Invalid credentials");
    }

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user: userRepository.toDTO(user),
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      // Verify refresh token
      const payload = verifyRefreshToken(refreshToken);

      // Verify user still exists and is active
      const user = await userRepository.findById(payload.userId);

      if (!user) {
        throw new UnauthorizedError("User not found");
      }

      if (user.status !== "active") {
        throw new UnauthorizedError("Account is inactive");
      }

      // Generate new tokens
      const newAccessToken = generateAccessToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      const newRefreshToken = generateRefreshToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      throw new UnauthorizedError("Invalid refresh token");
    }
  }
}

export const authService = new AuthService();
