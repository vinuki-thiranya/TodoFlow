-- Add default admin and manager accounts
INSERT INTO users (id, full_name, email, user_role, is_email_verified, created_on, updated_on) 
VALUES 
  ('admin-default-001', 'System Admin', 'admin@todoflow.com', 'admin', true, NOW(), NOW()),
  ('manager-default-001', 'System Manager', 'manager@todoflow.com', 'manager', true, NOW(), NOW())
ON CONFLICT (email) DO UPDATE SET
  user_role = EXCLUDED.user_role,
  full_name = EXCLUDED.full_name,
  updated_on = NOW();