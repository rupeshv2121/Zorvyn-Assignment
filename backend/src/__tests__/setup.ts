// Global test setup for backend tests
// Add custom matchers or global configurations here

// Mock environment variables for tests
process.env.JWT_SECRET = "test-secret-key";
process.env.REFRESH_TOKEN_SECRET = "test-refresh-secret";
process.env.JWT_EXPIRES_IN = "15m";
process.env.REFRESH_TOKEN_EXPIRES_IN = "7d";
process.env.NODE_ENV = "test";
process.env.SUPABASE_URL = "https://test.supabase.co";
process.env.SUPABASE_KEY = "test-key";
