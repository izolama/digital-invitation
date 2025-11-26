#!/bin/bash

# URGENT: Fix Admin Password
# Uses backend's bcrypt to generate compatible hash

set -e

PASSWORD="admin123"
BACKEND_DIR="../backend"

echo "🔐 FIXING ADMIN PASSWORD"
echo "========================"
echo ""

# Step 1: Install bcrypt in backend if needed
echo "1. Checking bcrypt in backend..."
cd "$BACKEND_DIR"

if [ ! -d "node_modules/bcrypt" ]; then
    echo "   Installing bcrypt..."
    npm install bcrypt --save 2>&1 | grep -v "npm WARN" || true
fi

# Step 2: Generate hash using backend's bcrypt
echo "2. Generating hash with backend bcrypt..."
HASH=$(node -e "
const bcrypt = require('bcrypt');
bcrypt.hash('$PASSWORD', 10)
    .then(hash => {
        console.log(hash);
        process.exit(0);
    })
    .catch(err => {
        console.error('ERROR:', err.message);
        process.exit(1);
    });
" 2>&1)

if [ $? -ne 0 ] || [ -z "$HASH" ] || [ ${#HASH} -lt 50 ]; then
    echo "   ❌ Failed to generate hash"
    echo "   Error: $HASH"
    exit 1
fi

echo "   ✅ Hash: $HASH"
cd - > /dev/null

# Step 3: Update database
echo "3. Updating database..."
DB_HOST="localhost"
DB_PORT="5432"
DB_USER="postgres"
DB_PASSWORD="ShaninHanan23"
DB_NAME="digital_invitation"

PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME <<EOF
UPDATE admin_users 
SET password_hash = '$HASH', updated_at = CURRENT_TIMESTAMP
WHERE email = 'admin@krakatau.com';

SELECT id, name, email, 'Updated' as status FROM admin_users WHERE email = 'admin@krakatau.com';
EOF

if [ $? -eq 0 ]; then
    echo ""
    echo "✅✅✅ PASSWORD FIXED! ✅✅✅"
    echo ""
    echo "Login:"
    echo "  Email: admin@krakatau.com"
    echo "  Password: admin123"
    echo ""
    echo "Test now:"
    echo "  curl -X POST https://backend-digital-invitation.nahsbyte.my.id/api/admin/login \\"
    echo "    -H 'Content-Type: application/json' \\"
    echo "    -d '{\"email\":\"admin@krakatau.com\",\"password\":\"admin123\"}'"
else
    echo "❌ Database update failed"
    exit 1
fi

