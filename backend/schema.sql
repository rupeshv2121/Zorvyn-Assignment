-- Finance Dashboard Database Schema
-- PostgreSQL / Supabase

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- USERS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('viewer', 'analyst', 'admin')),
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster email lookups (login)
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Index for role-based queries
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Index for status filtering
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);

-- =============================================
-- FINANCIAL RECORDS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS financial_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(15, 2) NOT NULL CHECK (amount > 0),
  type VARCHAR(10) NOT NULL CHECK (type IN ('income', 'expense')),
  category VARCHAR(100) NOT NULL,
  date DATE NOT NULL,
  notes TEXT,
  deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for user-based queries (most common access pattern)
CREATE INDEX IF NOT EXISTS idx_records_user_id ON financial_records(user_id);

-- Composite index for filtered queries (user + date range)
CREATE INDEX IF NOT EXISTS idx_records_user_date ON financial_records(user_id, date DESC);

-- Index for category aggregations
CREATE INDEX IF NOT EXISTS idx_records_category ON financial_records(category);

-- Index for type filtering (income vs expense)
CREATE INDEX IF NOT EXISTS idx_records_type ON financial_records(type);

-- Composite index for dashboard queries (user + type + date)
CREATE INDEX IF NOT EXISTS idx_records_user_type_date ON financial_records(user_id, type, date DESC);

-- Index for soft delete filtering (hide deleted records from queries)
CREATE INDEX IF NOT EXISTS idx_records_deleted_at ON financial_records(deleted_at);

-- =============================================
-- TRIGGERS FOR UPDATED_AT
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for users table
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for financial_records table
DROP TRIGGER IF EXISTS update_financial_records_updated_at ON financial_records;
CREATE TRIGGER update_financial_records_updated_at
  BEFORE UPDATE ON financial_records
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- ROW LEVEL SECURITY (Optional - if using Supabase Auth)
-- Currently disabled as we're using custom JWT auth
-- =============================================

-- Enable RLS (uncomment if needed)
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE financial_records ENABLE ROW LEVEL SECURITY;

-- Example policy for financial_records (users can only see their own records)
-- CREATE POLICY "Users can view own records" ON financial_records
--   FOR SELECT USING (auth.uid() = user_id);

-- CREATE POLICY "Users can insert own records" ON financial_records
--   FOR INSERT WITH CHECK (auth.uid() = user_id);

-- CREATE POLICY "Users can update own records" ON financial_records
--   FOR UPDATE USING (auth.uid() = user_id);

-- CREATE POLICY "Users can delete own records" ON financial_records
--   FOR DELETE USING (auth.uid() = user_id);
