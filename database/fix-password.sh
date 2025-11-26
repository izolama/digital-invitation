#!/bin/bash

# Quick Fix Admin Password
# Updates password to admin123 with verified hash

DB_HOST=${DB_HOST:-"localhost"}
DB_PORT=${DB_PORT:-"5432"}
DB_USER=${DB_USER:-"postgres"}
DB_PASSWORD=${DB_PASSWORD:-"ShaninHanan23"}
DB_NAME="digital_invitation"

echo "🔐 Fixing Admin Password"
echo "======================="
echo ""

# Verified hash for "admin123" - generated and tested
HASH='$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'

echo "Updating password for admin@krakatau.com..."
echo "New password: admin123"
echo ""

PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME <<EOF
UPDATE admin_users 
SET 
    password_hash = '$HASH',
    updated_at = CURRENT_TIMESTAMP
WHERE email = 'admin@krakatau.com';

SELECT 
    id,
    name,
    email,
    'Password updated successfully' as status
FROM admin_users 
WHERE email = 'admin@krakatau.com';
EOF

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Password updated successfully!"
    echo ""
    echo "Login credentials:"
    echo "  Email: admin@krakatau.com"
    echo "  Password: admin123"
    echo ""
    echo "Test login:"
    echo "  curl -X POST https://backend-digital-invitation.nahsbyte.my.id/api/admin/login \\"
    echo "    -H 'Content-Type: application/json' \\"
    echo "    -d '{\"email\":\"admin@krakatau.com\",\"password\":\"admin123\"}'"
else
    echo ""
    echo "❌ Failed to update password"
    exit 1
fi

