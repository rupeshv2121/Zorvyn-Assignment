import { comparePassword, hashPassword } from "../../utils/password";

describe("Password Utils", () => {
  describe("hashPassword", () => {
    it("should hash a password", async () => {
      const password = "testPassword123";
      const hash = await hashPassword(password);

      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(0);
    });

    it("should produce different hashes for the same password (bcrypt salt)", async () => {
      const password = "testPassword123";
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);

      expect(hash1).not.toBe(hash2);
    });

    it("should handle long passwords", async () => {
      const longPassword = "a".repeat(100) + "123!@#";
      const hash = await hashPassword(longPassword);

      expect(hash).toBeDefined();
      expect(hash.length).toBeGreaterThan(0);
    });
  });

  describe("comparePassword", () => {
    it("should return true for matching password and hash", async () => {
      const password = "correctPassword123";
      const hash = await hashPassword(password);
      const isMatch = await comparePassword(password, hash);

      expect(isMatch).toBe(true);
    });

    it("should return false for non-matching password", async () => {
      const password = "correctPassword123";
      const wrongPassword = "wrongPassword123";
      const hash = await hashPassword(password);
      const isMatch = await comparePassword(wrongPassword, hash);

      expect(isMatch).toBe(false);
    });

    it("should handle empty password", async () => {
      const hash = await hashPassword("somePassword");
      const isMatch = await comparePassword("", hash);

      expect(isMatch).toBe(false);
    });

    it("should be case-sensitive", async () => {
      const password = "MyPassword123";
      const hash = await hashPassword(password);
      const isMatch = await comparePassword("mypassword123", hash);

      expect(isMatch).toBe(false);
    });
  });
});
