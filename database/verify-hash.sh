#!/bin/bash

# Verify password hash in database
# Tests if hash matches password

PASSWORD="admin123"
BACKEND_DIR="../backend"

echo "🔍 Verifying Password Hash"
echo "=========================="
echo ""

# Get hash from database
DB_HOST="localhost"
DB_PORT="5432"
DB_USER="postgres"
DB_PASSWORD="ShaninHanan23"
DB_NAME="digital_invitation"

HASH=$(PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -tAc "
SELECT password_hash FROM admin_users WHERE email = 'admin@krakatau.com';
")

if [ -z "$HASH" ]; then
    echo "❌ No hash found in database"
    exit 1
fi

echo "Hash from database:"
echo "$HASH"
echo ""

# Test with backend bcrypt
cd "$BACKEND_DIR"

if [ ! -d "node_modules/bcrypt" ]; then
    npm install bcrypt --save 2>&1 | grep -v "npm WARN" || true
fi

echo "Testing password match..."
node -e "
const bcrypt = require('bcrypt');
const hash = '$HASH';
const password = '$PASSWORD';

bcrypt.compare(password, hash)
    .then(result => {
        if (result) {
            console.log('✅ PASSWORD MATCHES!');
            process.exit(0);
        } else {
            console.log('❌ PASSWORD DOES NOT MATCH');
            console.log('');
            console.log('Generating new hash...');
            return bcrypt.hash(password, 10);
        }
    })
    .then(newHash => {
        if (newHash) {
            console.log('New hash:', newHash);
            console.log('');
            console.log('Run this SQL:');
            console.log(\"UPDATE admin_users SET password_hash = '\" + newHash + \"' WHERE email = 'admin@krakatau.com';\");
        }
        process.exit(0);
    })
    .catch(err => {
        console.error('Error:', err.message);
        process.exit(1);
    });
"

cd - > /dev/null

