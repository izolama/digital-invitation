#!/bin/bash

# Update Admin Password Script
# This script updates the admin password in the database

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Database credentials
DB_HOST=${DB_HOST:-"localhost"}
DB_PORT=${DB_PORT:-"5432"}
DB_USER=${DB_USER:-"postgres"}
DB_PASSWORD=${DB_PASSWORD:-"ShaninHanan23"}
DB_NAME="digital_invitation"

# Default password
NEW_PASSWORD=${1:-"admin123"}
ADMIN_EMAIL="admin@krakatau.com"

echo "🔐 Update Admin Password"
echo "======================="
echo ""
echo "Database: $DB_NAME"
echo "Admin Email: $ADMIN_EMAIL"
echo "New Password: $NEW_PASSWORD"
echo ""

# Check if Node.js is available for bcrypt
if command -v node &> /dev/null; then
    echo "Generating bcrypt hash..."
    
    # Generate bcrypt hash using Node.js
    HASH=$(node -e "
        const bcrypt = require('bcrypt');
        const password = '$NEW_PASSWORD';
        bcrypt.hash(password, 10).then(hash => {
            console.log(hash);
        }).catch(err => {
            console.error('Error:', err);
            process.exit(1);
        });
    " 2>/dev/null)
    
    if [ -z "$HASH" ]; then
        echo -e "${RED}❌ Failed to generate hash${NC}"
        echo ""
        echo "Please install bcrypt:"
        echo "  npm install bcrypt"
        echo ""
        echo "Or use online bcrypt generator:"
        echo "  https://bcrypt-generator.com/"
        echo "  Rounds: 10"
        echo "  Password: $NEW_PASSWORD"
        echo ""
        read -p "Enter bcrypt hash manually: " HASH
    fi
else
    echo -e "${YELLOW}⚠️  Node.js not found${NC}"
    echo ""
    echo "Please generate bcrypt hash manually:"
    echo "1. Go to: https://bcrypt-generator.com/"
    echo "2. Rounds: 10"
    echo "3. Password: $NEW_PASSWORD"
    echo "4. Copy the hash"
    echo ""
    read -p "Enter bcrypt hash: " HASH
fi

if [ -z "$HASH" ]; then
    echo -e "${RED}❌ Hash is required${NC}"
    exit 1
fi

echo ""
echo "Updating password in database..."

# Update password
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME <<EOF
UPDATE admin_users 
SET password_hash = '$HASH', updated_at = CURRENT_TIMESTAMP
WHERE email = '$ADMIN_EMAIL';

SELECT 
    id,
    name,
    email,
    CASE 
        WHEN password_hash IS NOT NULL THEN 'Password updated'
        ELSE 'No password'
    END as status
FROM admin_users 
WHERE email = '$ADMIN_EMAIL';
EOF

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✓ Password updated successfully!${NC}"
    echo ""
    echo "You can now login with:"
    echo "  Email: $ADMIN_EMAIL"
    echo "  Password: $NEW_PASSWORD"
else
    echo ""
    echo -e "${RED}❌ Failed to update password${NC}"
    exit 1
fi

