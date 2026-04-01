-- Seed data for testing
-- Password for all users: "password123" (hashed with bcrypt)

-- Insert test users (admin, analyst, viewer)
INSERT INTO users (id, email, password_hash, role, status) VALUES
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'admin@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzpLaEg7HK', 'admin', 'active'),
  ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'analyst@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzpLaEg7HK', 'analyst', 'active'),
  ('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'viewer@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzpLaEg7HK', 'viewer', 'active')
ON CONFLICT (email) DO NOTHING;

-- Insert sample financial records for the analyst user
INSERT INTO financial_records (user_id, amount, type, category, date, notes) VALUES
  -- Income records
  ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 5000.00, 'income', 'Salary', '2024-01-15', 'Monthly salary'),
  ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 500.00, 'income', 'Freelance', '2024-01-20', 'Web development project'),
  ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 5000.00, 'income', 'Salary', '2024-02-15', 'Monthly salary'),
  ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 800.00, 'income', 'Freelance', '2024-02-25', 'Consulting work'),
  ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 5000.00, 'income', 'Salary', '2024-03-15', 'Monthly salary'),
  
  -- Expense records
  ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 1200.00, 'expense', 'Rent', '2024-01-01', 'Monthly rent payment'),
  ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 300.00, 'expense', 'Groceries', '2024-01-10', 'Weekly groceries'),
  ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 150.00, 'expense', 'Utilities', '2024-01-05', 'Electricity and water'),
  ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 50.00, 'expense', 'Entertainment', '2024-01-12', 'Movie tickets'),
  ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 1200.00, 'expense', 'Rent', '2024-02-01', 'Monthly rent payment'),
  ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 350.00, 'expense', 'Groceries', '2024-02-10', 'Weekly groceries'),
  ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 160.00, 'expense', 'Utilities', '2024-02-05', 'Electricity and water'),
  ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 200.00, 'expense', 'Transportation', '2024-02-15', 'Gas and maintenance'),
  ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 1200.00, 'expense', 'Rent', '2024-03-01', 'Monthly rent payment'),
  ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 320.00, 'expense', 'Groceries', '2024-03-10', 'Weekly groceries'),
  ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 145.00, 'expense', 'Utilities', '2024-03-05', 'Electricity and water'),
  ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 100.00, 'expense', 'Entertainment', '2024-03-20', 'Concert tickets')
ON CONFLICT DO NOTHING;
