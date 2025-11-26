#!/bin/bash

# Generate Bcrypt Hash using Backend Node.js
# This script uses backend's bcrypt to generate hash

PASSWORD=${1:-"admin123"}
BACKEND_DIR="../backend"

echo "🔑 Generating Bcrypt Hash"
echo "========================"
echo "Password: $PASSWORD"
echo ""

# Check if backend directory exists
if [ ! -d "$BACKEND_DIR" ]; then
    echo "❌ Backend directory not found: $BACKEND_DIR"
    echo ""
    echo "Please run from database directory:"
    echo "  cd /var/www/digital-invitation/database"
    exit 1
fi

# Check if node_modules exists in backend
if [ ! -d "$BACKEND_DIR/node_modules" ]; then
    echo "Installing bcrypt in backend..."
    cd "$BACKEND_DIR"
    npm install bcrypt 2>/dev/null || {
        echo "❌ Failed to install bcrypt"
        exit 1
    }
    cd - > /dev/null
fi

# Generate hash
echo "Generating hash..."
HASH=$(cd "$BACKEND_DIR" && node -e "
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

if [ $? -eq 0 ] && [ ! -z "$HASH" ]; then
    echo ""
    echo "✅ Hash generated:"
    echo "$HASH"
    echo ""
    echo "SQL Update Command:"
    echo "UPDATE admin_users SET password_hash = '$HASH' WHERE email = 'admin@krakatau.com';"
    echo ""
    echo "Or use fix-password.sh with this hash"
else
    echo ""
    echo "❌ Failed to generate hash"
    exit 1
fi

