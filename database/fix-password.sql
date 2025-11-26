-- Fix Admin Password to admin123
-- Run: PGPASSWORD=ShaninHanan23 psql -h localhost -U postgres -d digital_invitation -f fix-password.sql

-- Verified bcrypt hash for password "admin123" (10 rounds)
-- Generated and tested
UPDATE admin_users 
SET 
    password_hash = '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    updated_at = CURRENT_TIMESTAMP
WHERE email = 'admin@krakatau.com';

-- Verify update
SELECT 
    id,
    name,
    email,
    CASE 
        WHEN password_hash IS NOT NULL THEN 'Password updated'
        ELSE 'No password set'
    END as status,
    updated_at
FROM admin_users 
WHERE email = 'admin@krakatau.com';

