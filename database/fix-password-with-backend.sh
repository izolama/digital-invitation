#!/bin/bash

# Fix Password using Backend to Generate Correct Hash
# This ensures hash is compatible with backend's bcrypt

PASSWORD=${1:-"admin123"}
BACKEND_DIR="../backend"

echo "🔐 Fixing Admin Password (Using Backend Bcrypt)"
echo "================================================"
echo ""

# Check if backend exists
if [ ! -d "$BACKEND_DIR" ]; then
    echo "❌ Backend directory not found"
    exit 1
fi

# Install bcrypt if needed
if [ ! -d "$BACKEND_DIR/node_modules/bcrypt" ]; then
    echo "Installing bcrypt..."
    cd "$BACKEND_DIR"
    npm install bcrypt 2>/dev/null
    cd - > /dev/null
fi

# Generate hash using backend's bcrypt
echo "Generating hash with backend bcrypt..."
cd "$BACKEND_DIR"

HASH=$(node -e "
const bcrypt = require('bcrypt');
bcrypt.hash('$PASSWORD', 10)
    .then(hash => {
        console.log(hash);
        process.exit(0);
    })
    .catch(err => {
        console.error('Error:', err.message);
        process.exit(1);
    });
")

cd - > /dev/null

if [ -z "$HASH" ] || [ ${#HASH} -lt 50 ]; then
    echo "❌ Failed to generate hash"
    exit 1
fi

echo "✅ Hash generated: $HASH"
echo ""

# Update database
DB_HOST=${DB_HOST:-"localhost"}
DB_PORT=${DB_PORT:-"5432"}
DB_USER=${DB_USER:-"postgres"}
DB_PASSWORD=${DB_PASSWORD:-"ShaninHanan23"}
DB_NAME="digital_invitation"

echo "Updating password in database..."

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
    'Password updated' as status
FROM admin_users 
WHERE email = 'admin@krakatau.com';
EOF

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Password updated successfully!"
    echo ""
    echo "Login credentials:"
    echo "  Email: admin@krakatau.com"
    echo "  Password: $PASSWORD"
    echo ""
    echo "Test login:"
    echo "  curl -X POST https://backend-digital-invitation.nahsbyte.my.id/api/admin/login \\"
    echo "    -H 'Content-Type: application/json' \\"
    echo "    -d '{\"email\":\"admin@krakatau.com\",\"password\":\"$PASSWORD\"}'"
else
    echo ""
    echo "❌ Failed to update password"
    exit 1
fi

