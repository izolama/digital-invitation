#!/bin/bash

# Simple Password Update Script
# Uses pre-generated hash for "admin123"

DB_HOST=${DB_HOST:-"localhost"}
DB_PORT=${DB_PORT:-"5432"}
DB_USER=${DB_USER:-"postgres"}
DB_PASSWORD=${DB_PASSWORD:-"ShaninHanan23"}
DB_NAME="digital_invitation"

# Pre-generated bcrypt hash for "admin123" (10 rounds)
# Generated using: bcrypt.hash('admin123', 10)
ADMIN_PASSWORD_HASH='$2b$10$rCx0HwkQF9X3OBmZxmWNy.Mh9UqzGQpZDXX.jL9kXJ4NHJ4K3.hGa'

echo "Updating admin password to: admin123"
echo ""

PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME <<EOF
UPDATE admin_users 
SET password_hash = '$ADMIN_PASSWORD_HASH', updated_at = CURRENT_TIMESTAMP
WHERE email = 'admin@krakatau.com';

SELECT 
    id,
    name,
    email,
    'Password updated to: admin123' as status
FROM admin_users 
WHERE email = 'admin@krakatau.com';
EOF

echo ""
echo "✓ Password updated!"
echo ""
echo "Login credentials:"
echo "  Email: admin@krakatau.com"
echo "  Password: admin123"

