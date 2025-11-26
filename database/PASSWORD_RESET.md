# Reset Admin Password

Panduan untuk reset/update password admin.

## 🚀 Quick Fix (Recommended)

```bash
cd /var/www/digital-invitation/database
chmod +x update-password-simple.sh
./update-password-simple.sh
```

Script ini akan update password ke `admin123` dengan hash yang sudah verified.

---

## 🔧 Manual Update

### Option 1: Using SQL Directly

```bash
PGPASSWORD=ShaninHanan23 psql -h localhost -U postgres -d digital_invitation
```

```sql
-- Update password to admin123
UPDATE admin_users 
SET password_hash = '$2b$10$rCx0HwkQF9X3OBmZxmWNy.Mh9UqzGQpZDXX.jL9kXJ4NHJ4K3.hGa',
    updated_at = CURRENT_TIMESTAMP
WHERE email = 'admin@krakatau.com';

-- Verify
SELECT id, name, email FROM admin_users WHERE email = 'admin@krakatau.com';
```

### Option 2: Generate New Hash

**If you want different password:**

```bash
# Install bcrypt (if not installed)
cd /var/www/digital-invitation/backend
npm install bcrypt

# Generate hash
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('your_new_password', 10).then(h => console.log(h));"
```

Then update in database:
```sql
UPDATE admin_users 
SET password_hash = 'YOUR_GENERATED_HASH_HERE'
WHERE email = 'admin@krakatau.com';
```

### Option 3: Using Update Script

```bash
cd database
chmod +x update-admin-password.sh
./update-admin-password.sh your_new_password
```

---

## ✅ Verify Password

After update, test login:

```bash
# Test login API
curl -X POST https://backend-digital-invitation.nahsbyte.my.id/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@krakatau.com","password":"admin123"}'
```

Expected response:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Admin",
    "email": "admin@krakatau.com",
    "token": "..."
  }
}
```

---

## 🔐 Change Password in Production

**For production, use strong password:**

```bash
# Generate hash for strong password
cd backend
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('YourStrongPassword123!', 10).then(h => console.log(h));"

# Update in database
PGPASSWORD=ShaninHanan23 psql -h localhost -U postgres -d digital_invitation -c "
UPDATE admin_users 
SET password_hash = 'GENERATED_HASH_HERE'
WHERE email = 'admin@krakatau.com';
"
```

---

## 🐛 Troubleshooting

### Password still not working

1. **Check hash in database:**
```sql
SELECT email, password_hash FROM admin_users WHERE email = 'admin@krakatau.com';
```

2. **Verify hash format:**
- Should start with `$2b$10$`
- Should be 60 characters long

3. **Test hash manually:**
```bash
cd backend
node -e "
const bcrypt = require('bcrypt');
const hash = 'YOUR_HASH_FROM_DATABASE';
bcrypt.compare('admin123', hash).then(result => {
  console.log('Match:', result);
});
"
```

4. **Check backend logs:**
```bash
docker logs digital-invitation-backend | grep -i login
```

---

## 📝 Current Hash for "admin123"

```
$2b$10$rCx0HwkQF9X3OBmZxmWNy.Mh9UqzGQpZDXX.jL9kXJ4NHJ4K3.hGa
```

This hash is verified and should work with password: `admin123`

---

**Quick Command:**
```bash
cd database && chmod +x update-password-simple.sh && ./update-password-simple.sh
```

