#!/bin/bash

# Script to verify and fix admin password

DB_HOST=${DB_HOST:-"localhost"}
DB_PORT=${DB_PORT:-"5432"}
DB_USER=${DB_USER:-"postgres"}
DB_PASSWORD=${DB_PASSWORD:-"ShaninHanan23"}
DB_NAME="digital_invitation"
PASSWORD="admin123"

echo "🔐 Verifying Admin Password"
echo "==========================="
echo ""

# Check if backend directory exists
BACKEND_DIR="$(dirname "$0")/../backend"
if [ ! -d "$BACKEND_DIR" ]; then
    echo "❌ Backend directory not found: $BACKEND_DIR"
    exit 1
fi

echo "1. Generating hash with bcryptjs..."
cd "$BACKEND_DIR"

# Generate hash using bcryptjs
HASH=$(node -e "
const bcrypt = require('bcryptjs');
const hash = bcrypt.hashSync('$PASSWORD', 10);
console.log(hash);
")

if [ -z "$HASH" ]; then
    echo "❌ Failed to generate hash"
    exit 1
fi

echo "✅ Hash generated: $HASH"
echo ""

# Verify hash
echo "2. Verifying hash..."
VERIFY=$(node -e "
const bcrypt = require('bcryptjs');
const hash = '$HASH';
const result = bcrypt.compareSync('$PASSWORD', hash);
console.log(result ? 'true' : 'false');
")

if [ "$VERIFY" != "true" ]; then
    echo "❌ Hash verification failed!"
    exit 1
fi

echo "✅ Hash verified successfully!"
echo ""

# Check current password in database
echo "3. Checking current password in database..."
CURRENT_HASH=$(PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -t -c "SELECT password_hash FROM admin_users WHERE email = 'admin@krakatau.com';" | xargs)

if [ -z "$CURRENT_HASH" ]; then
    echo "❌ Admin user not found in database"
    exit 1
fi

# Use cut instead of bash substring for compatibility
HASH_PREVIEW=$(echo "$CURRENT_HASH" | cut -c1-20)
echo "Current hash: ${HASH_PREVIEW}..."
echo ""

# Verify current hash
echo "4. Verifying current password hash..."
CURRENT_VERIFY=$(node -e "
const bcrypt = require('bcryptjs');
const hash = '$CURRENT_HASH';
const result = bcrypt.compareSync('$PASSWORD', hash);
console.log(result ? 'true' : 'false');
")

if [ "$CURRENT_VERIFY" = "true" ]; then
    echo "✅ Current password hash is valid!"
    echo ""
    echo "Password is working correctly."
    exit 0
fi

echo "⚠️  Current password hash is invalid!"
echo ""
read -p "Update password hash? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "Update cancelled."
    exit 0
fi

# Update password
echo ""
echo "5. Updating password in database..."
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "
UPDATE admin_users 
SET password_hash = '$HASH', updated_at = CURRENT_TIMESTAMP 
WHERE email = 'admin@krakatau.com';
"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅✅✅ Password updated successfully! ✅✅✅"
    echo ""
    echo "Login credentials:"
    echo "  Email: admin@krakatau.com"
    echo "  Password: $PASSWORD"
else
    echo ""
    echo "❌ Failed to update password"
    exit 1
fi

