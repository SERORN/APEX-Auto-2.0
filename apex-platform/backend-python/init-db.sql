-- Initialize Apex Database
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_rfc ON users(rfc);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

CREATE INDEX IF NOT EXISTS idx_wallets_user_id ON wallets(user_id);
CREATE INDEX IF NOT EXISTS idx_wallets_status ON wallets(status);

CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at);

CREATE INDEX IF NOT EXISTS idx_invoices_issuer_id ON invoices(issuer_id);
CREATE INDEX IF NOT EXISTS idx_invoices_receiver_id ON invoices(receiver_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_cfdi_uuid ON invoices(cfdi_uuid);

CREATE INDEX IF NOT EXISTS idx_credit_lines_user_id ON credit_lines(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_lines_status ON credit_lines(status);

CREATE INDEX IF NOT EXISTS idx_autoparts_sku ON autoparts(sku);
CREATE INDEX IF NOT EXISTS idx_autoparts_part_number ON autoparts(part_number);
CREATE INDEX IF NOT EXISTS idx_autoparts_brand ON autoparts(brand);
CREATE INDEX IF NOT EXISTS idx_autoparts_category ON autoparts(category);
CREATE INDEX IF NOT EXISTS idx_autoparts_status ON autoparts(status);

-- Insert sample data for development
-- Sample admin user
INSERT INTO users (
    email, hashed_password, first_name, last_name, role, 
    is_active, is_verified, kyc_status, credit_score
) VALUES (
    'admin@apex.com.mx', 
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeX.nohpFqU8X9FJC', -- password: admin123
    'Admin', 'Apex', 'admin', 
    true, true, 'approved', 850
) ON CONFLICT (email) DO NOTHING;

-- Sample business user
INSERT INTO users (
    email, hashed_password, first_name, last_name, business_name, rfc, role,
    is_active, is_verified, kyc_status, credit_score, monthly_income
) VALUES (
    'business@example.com',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeX.nohpFqU8X9FJC', -- password: admin123
    'Juan', 'Pérez', 'AutoPartes del Norte SA', 'APN010101ABC', 'provider',
    true, true, 'approved', 750, 85000.00
) ON CONFLICT (email) DO NOTHING;

-- Sample customer
INSERT INTO users (
    email, hashed_password, first_name, last_name, role,
    is_active, is_verified, kyc_status, credit_score, monthly_income
) VALUES (
    'customer@example.com',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeX.nohpFqU8X9FJC', -- password: admin123
    'María', 'González', 'customer',
    true, true, 'approved', 680, 45000.00
) ON CONFLICT (email) DO NOTHING;
