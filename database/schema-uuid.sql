-- Digital Invitation Database Schema (UUID Version)
-- PostgreSQL Database Setup Script with UUID
-- Created: 2025-11-28

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop tables if they exist (for clean reinstall)
DROP TABLE IF EXISTS registrations CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;

-- Create Admin Users Table (keep SERIAL for admin, or change to UUID if needed)
CREATE TABLE admin_users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- Create Registrations Table with UUID
CREATE TABLE registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(255) NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    whatsapp_number VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    food_restriction VARCHAR(50) NOT NULL,
    allergies VARCHAR(10) NOT NULL,
    confirmation_attendance VARCHAR(10) NOT NULL,
    number_of_people INTEGER NOT NULL DEFAULT 1,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Indexes for better performance
CREATE INDEX idx_registrations_email ON registrations(email);
CREATE INDEX idx_registrations_company ON registrations(company_name);
CREATE INDEX idx_registrations_created_at ON registrations(created_at DESC);
CREATE INDEX idx_registrations_attendance ON registrations(confirmation_attendance);
CREATE INDEX idx_registrations_full_name ON registrations(full_name);

CREATE INDEX idx_admin_users_email ON admin_users(email);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_admin_users_updated_at 
    BEFORE UPDATE ON admin_users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_registrations_updated_at 
    BEFORE UPDATE ON registrations 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default admin user
-- Password: admin123 (bcryptjs hashed, 10 rounds)
INSERT INTO admin_users (name, email, password_hash) 
VALUES (
    'Admin', 
    'admin@krakatau.com', 
    '$2b$10$pj/s6RM9.4rcngH3c.o61ekKSQjCHZS6ZNoGzpT6pyhLapoXTQXkC'
) ON CONFLICT (email) DO UPDATE 
SET password_hash = EXCLUDED.password_hash;

-- Display success message
SELECT 'Database schema created successfully with UUID!' as status;
SELECT 'Default admin user created: admin@krakatau.com / admin123' as info;

