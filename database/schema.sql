-- Digital Invitation Database Schema
-- PostgreSQL Database Setup Script
-- Created: 2025-11-26
-- Updated for existing PostgreSQL with user: postgres

-- Note: This script assumes you're already connected to digital_invitation database
-- If running manually: psql -U postgres -d digital_invitation -f schema.sql

-- Drop tables if they exist (for clean reinstall)
DROP TABLE IF EXISTS registrations CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;

-- Create Admin Users Table
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

-- Create Registrations Table
CREATE TABLE registrations (
    id SERIAL PRIMARY KEY,
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
-- Password: admin123 (bcrypt hashed, 10 rounds)
-- IMPORTANT: Change this password in production!
-- 
-- To update password, run:
--   ./update-password-simple.sh
--   OR
--   ./update-admin-password.sh [new_password]
INSERT INTO admin_users (name, email, password_hash) 
VALUES (
    'Admin', 
    'admin@krakatau.com', 
    '$2b$10$rCx0HwkQF9X3OBmZxmWNy.Mh9UqzGQpZDXX.jL9kXJ4NHJ4K3.hGa'
) ON CONFLICT (email) DO NOTHING;

-- Insert sample registrations for testing (optional)
INSERT INTO registrations (
    full_name, company_name, whatsapp_number, email, 
    food_restriction, allergies, confirmation_attendance, number_of_people,
    ip_address, user_agent
) VALUES 
    (
        'John Doe', 'PT ABC Industries', '08123456789', 'john@abc.com',
        'NON VEGAN', 'NO', 'YES', 2,
        '192.168.1.1', 'Mozilla/5.0 (Sample Data)'
    ),
    (
        'Jane Smith', 'PT XYZ Corporation', '08198765432', 'jane@xyz.com',
        'VEGAN', 'YES', 'YES', 1,
        '192.168.1.2', 'Mozilla/5.0 (Sample Data)'
    ),
    (
        'Bob Johnson', 'PT Steel Works', '08156789012', 'bob@steel.com',
        'NO RESTRICTION', 'NO', 'MAYBE', 3,
        '192.168.1.3', 'Mozilla/5.0 (Sample Data)'
    ),
    (
        'Alice Williams', 'PT Tech Solutions', '08145678901', 'alice@tech.com',
        'VEGETARIAN', 'NO', 'YES', 1,
        '192.168.1.4', 'Mozilla/5.0 (Sample Data)'
    ),
    (
        'Charlie Brown', 'PT Manufacturing', '08134567890', 'charlie@manu.com',
        'NON VEGAN', 'YES', 'NO', 0,
        '192.168.1.5', 'Mozilla/5.0 (Sample Data)'
    );

-- Permissions are already set for postgres user
-- No additional grants needed

-- Display success message
SELECT 'Database schema created successfully!' as status;
SELECT 'Default admin user created: admin@krakatau.com / admin123' as info;
SELECT 'Sample data inserted: ' || COUNT(*) || ' registrations' as sample_data 
FROM registrations;

