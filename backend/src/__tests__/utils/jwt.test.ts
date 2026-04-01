import jwt from "jsonwebtoken";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "../../utils/jwt";

describe("JWT Utils", () => {
  const testUserId = "test-user-123";
  const testRole = "analyst";

  describe("generateAccessToken", () => {
    it("should generate a valid access token", () => {
      const token = generateAccessToken(testUserId, testRole);

      expect(token).toBeDefined();
      expect(typeof token).toBe("string");
    });

    it("should contain correct payload", () => {
      const token = generateAccessToken(testUserId, testRole);
      const decoded = jwt.decode(token) as any;

      expect(decoded.userId).toBe(testUserId);
      expect(decoded.role).toBe(testRole);
    });

    it("should have exp claim", () => {
      const token = generateAccessToken(testUserId, testRole);
      const decoded = jwt.decode(token) as any;

      expect(decoded.exp).toBeDefined();
      expect(typeof decoded.exp).toBe("number");
    });
  });

  describe("generateRefreshToken", () => {
    it("should generate a valid refresh token", () => {
      const token = generateRefreshToken(testUserId);

      expect(token).toBeDefined();
      expect(typeof token).toBe("string");
    });

    it("should contain userId", () => {
      const token = generateRefreshToken(testUserId);
      const decoded = jwt.decode(token) as any;

      expect(decoded.userId).toBe(testUserId);
    });
  });

  describe("verifyAccessToken", () => {
    it("should verify a valid access token", () => {
      const token = generateAccessToken(testUserId, testRole);
      const result = verifyAccessToken(token);

      expect(result.userId).toBe(testUserId);
      expect(result.role).toBe(testRole);
    });

    it("should throw error for invalid token", () => {
      const invalidToken = "invalid.token.here";

      expect(() => verifyAccessToken(invalidToken)).toThrow();
    });

    it("should throw error for tampered token", () => {
      const token = generateAccessToken(testUserId, testRole);
      const tamperedToken = token.slice(0, -5) + "xxxxx";

      expect(() => verifyAccessToken(tamperedToken)).toThrow();
    });

    it("should throw error for empty token", () => {
      expect(() => verifyAccessToken("")).toThrow();
    });
  });

  describe("verifyRefreshToken", () => {
    it("should verify a valid refresh token", () => {
      const token = generateRefreshToken(testUserId);
      const result = verifyRefreshToken(token);

      expect(result.userId).toBe(testUserId);
    });

    it("should throw error for invalid refresh token", () => {
      const invalidToken = "invalid.token.here";

      expect(() => verifyRefreshToken(invalidToken)).toThrow();
    });
  });
});
