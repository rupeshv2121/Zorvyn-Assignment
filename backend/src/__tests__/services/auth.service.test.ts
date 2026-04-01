import { userRepository } from "../../repositories";
import { AuthService } from "../../services/auth.service";
import { DuplicateError } from "../../utils/errors";
import * as jwtUtils from "../../utils/jwt";
import * as passwordUtils from "../../utils/password";

// Mock the dependencies
jest.mock("../../repositories");
jest.mock("../../utils/jwt");
jest.mock("../../utils/password");

describe("AuthService", () => {
  let authService: AuthService;
  let mockUserRepository: jest.Mocked<typeof userRepository>;
  let mockJwtUtils: jest.Mocked<typeof jwtUtils>;
  let mockPasswordUtils: jest.Mocked<typeof passwordUtils>;

  beforeEach(() => {
    jest.clearAllMocks();
    authService = new AuthService();
    mockUserRepository = userRepository as jest.Mocked<typeof userRepository>;
    mockJwtUtils = jwtUtils as jest.Mocked<typeof jwtUtils>;
    mockPasswordUtils = passwordUtils as jest.Mocked<typeof passwordUtils>;
  });

  describe("register", () => {
    const registerData = {
      email: "newuser@example.com",
      password: "SecurePassword123",
    };

    it("should register a new user successfully", async () => {
      const hashedPassword = "hashed_password_123";
      const mockTokens = {
        accessToken: "access_token_123",
        refreshToken: "refresh_token_123",
      };
      const mockUser = {
        id: "user-123",
        email: registerData.email,
        role: "viewer",
        status: "active",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      mockPasswordUtils.hashPassword.mockResolvedValue(hashedPassword);
      mockUserRepository.create.mockResolvedValue(mockUser as any);
      mockJwtUtils.generateAccessToken.mockReturnValue(mockTokens.accessToken);
      mockJwtUtils.generateRefreshToken.mockReturnValue(
        mockTokens.refreshToken,
      );

      const result = await authService.register(registerData);

      expect(result).toEqual({
        user: mockUser,
        tokens: mockTokens,
      });
      expect(mockPasswordUtils.hashPassword).toHaveBeenCalledWith(
        registerData.password,
      );
      expect(mockUserRepository.create).toHaveBeenCalled();
    });

    it("should throw error if email already exists", async () => {
      mockUserRepository.findByEmail.mockResolvedValue({} as any);

      await expect(authService.register(registerData)).rejects.toThrow(
        DuplicateError,
      );
    });

    it("should throw error for invalid email", async () => {
      const invalidData = {
        email: "not-an-email",
        password: "ValidPassword123",
      };

      await expect(authService.register(invalidData)).rejects.toThrow();
    });

    it("should throw error for weak password", async () => {
      const weakPasswordData = {
        email: "user@example.com",
        password: "weak",
      };

      await expect(authService.register(weakPasswordData)).rejects.toThrow();
    });
  });

  describe("login", () => {
    const loginData = {
      email: "user@example.com",
      password: "CorrectPassword123",
    };

    it("should login user successfully", async () => {
      const mockUser = {
        id: "user-123",
        email: loginData.email,
        password_hash: "hashed_password",
        role: "analyst",
        status: "active",
      };
      const mockTokens = {
        accessToken: "access_token_123",
        refreshToken: "refresh_token_123",
      };

      mockUserRepository.findByEmail.mockResolvedValue(mockUser as any);
      mockPasswordUtils.comparePassword.mockResolvedValue(true);
      mockJwtUtils.generateAccessToken.mockReturnValue(mockTokens.accessToken);
      mockJwtUtils.generateRefreshToken.mockReturnValue(
        mockTokens.refreshToken,
      );

      const result = await authService.login(loginData);

      expect(result.user.email).toBe(loginData.email);
      expect(result.tokens).toEqual(mockTokens);
    });

    it("should throw error for invalid credentials", async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);

      await expect(authService.login(loginData)).rejects.toThrow();
    });

    it("should throw error if password is incorrect", async () => {
      const mockUser = {
        id: "user-123",
        email: loginData.email,
        password_hash: "hashed_password",
        role: "analyst",
        status: "active",
      };

      mockUserRepository.findByEmail.mockResolvedValue(mockUser as any);
      mockPasswordUtils.comparePassword.mockResolvedValue(false);

      await expect(authService.login(loginData)).rejects.toThrow();
    });

    it("should throw error if user is inactive", async () => {
      const inactiveUser = {
        id: "user-123",
        email: loginData.email,
        password_hash: "hashed_password",
        role: "analyst",
        status: "inactive",
      };

      mockUserRepository.findByEmail.mockResolvedValue(inactiveUser as any);
      mockPasswordUtils.comparePassword.mockResolvedValue(true);

      await expect(authService.login(loginData)).rejects.toThrow();
    });
  });

  describe("refreshToken", () => {
    it("should refresh access token successfully", async () => {
      const oldRefreshToken = "old_refresh_token";
      const newTokens = {
        accessToken: "new_access_token",
        refreshToken: "new_refresh_token",
      };
      const mockUser = {
        id: "user-123",
        email: "user@example.com",
        role: "analyst",
        status: "active",
      };

      mockJwtUtils.verifyRefreshToken.mockReturnValue({ userId: "user-123" });
      mockUserRepository.findById.mockResolvedValue(mockUser as any);
      mockJwtUtils.generateAccessToken.mockReturnValue(newTokens.accessToken);
      mockJwtUtils.generateRefreshToken.mockReturnValue(newTokens.refreshToken);

      const result = await authService.refreshToken(oldRefreshToken);

      expect(result).toEqual(newTokens);
    });

    it("should throw error for invalid refresh token", () => {
      mockJwtUtils.verifyRefreshToken.mockImplementation(() => {
        throw new Error("Invalid token");
      });

      expect(() => authService.refreshToken("invalid_token")).toThrow();
    });
  });
});
