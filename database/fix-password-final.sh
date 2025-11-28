#!/bin/bash

# Final Fix Password - Generate Hash and Update Database

PASSWORD="admin123"
DB_HOST=${DB_HOST:-"localhost"}
DB_PORT=${DB_PORT:-"5432"}
DB_USER=${DB_USER:-"postgres"}
DB_PASSWORD=${DB_PASSWORD:-"ShaninHanan23"}
DB_NAME="digital_invitation"

# Get script directory and project root
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
BACKEND_DIR="$PROJECT_ROOT/backend"

echo "🔐 Final Password Fix"
echo "===================="
echo "Password: $PASSWORD"
echo ""

# Check if backend exists
if [ ! -d "$BACKEND_DIR" ]; then
    echo "❌ Backend directory not found: $BACKEND_DIR"
    echo "Current directory: $(pwd)"
    echo "Script directory: $SCRIPT_DIR"
    echo "Project root: $PROJECT_ROOT"
    exit 1
fi

echo "Backend directory: $BACKEND_DIR"

# Install bcryptjs if needed
if [ ! -d "$BACKEND_DIR/node_modules/bcryptjs" ]; then
    echo "Installing bcryptjs..."
    cd "$BACKEND_DIR"
    npm install bcryptjs 2>/dev/null
    cd - > /dev/null
fi

# Generate hash using backend's bcrypt
echo "Generating hash with backend bcrypt..."
cd "$BACKEND_DIR"

HASH=$(node -e "
const bcrypt = require('bcryptjs');
bcrypt.hash('$PASSWORD', 10)
    .then(hash => {
        console.log(hash);
        process.exit(0);
    })
    .catch(err => {
        console.error('Error:', err.message);
        process.exit(1);
    });
" 2>&1)

cd - > /dev/null

if [ -z "$HASH" ] || [ ${#HASH} -lt 50 ]; then
    echo "❌ Failed to generate hash"
    echo "Error: $HASH"
    exit 1
fi

echo "✅ Hash generated: $HASH"
echo ""

# Verify hash works
echo "Verifying hash..."
cd "$BACKEND_DIR"
VERIFY=$(node -e "
const bcrypt = require('bcryptjs');
bcrypt.compare('$PASSWORD', '$HASH')
    .then(result => {
        console.log(result ? 'true' : 'false');
        process.exit(result ? 0 : 1);
    })
    .catch(err => {
        console.error('Error:', err.message);
        process.exit(1);
    });
" 2>&1)

cd - > /dev/null

if [ "$VERIFY" != "true" ]; then
    echo "❌ Hash verification failed!"
    exit 1
fi

echo "✅ Hash verified successfully!"
echo ""

# Update database
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
    'Password updated successfully' as status,
    LEFT(password_hash, 10) as hash_preview
FROM admin_users 
WHERE email = 'admin@krakatau.com';
EOF

if [ $? -eq 0 ]; then
    echo ""
    echo "✅✅✅ PASSWORD FIXED! ✅✅✅"
    echo ""
    echo "Login credentials:"
    echo "  Email: admin@krakatau.com"
    echo "  Password: admin123"
    echo ""
    echo "Test login:"
    echo "  curl -X POST http://192.168.101.100:5001/api/admin/login \\"
    echo "    -H 'Content-Type: application/json' \\"
    echo "    -d '{\"email\":\"admin@krakatau.com\",\"password\":\"admin123\"}'"
else
    echo ""
    echo "❌ Database update failed"
    exit 1
fi

