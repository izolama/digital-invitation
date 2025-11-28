# Quick Fix: Login Hang Issue

## 🔍 Problem
Backend hang setelah "Starting bcrypt.compare..." dan restart.

## 🧪 Test Steps

### 1. Test Bcrypt Directly (Already Works)
```bash
cd backend
node test-bcrypt.js
# ✅ Works: 85ms, returns false (hash doesn't match)
```

### 2. Test Login Endpoint from Container
```bash
docker exec digital-invitation-backend node /app/test-login-endpoint.js
```

### 3. Check if Backend Crashes
```bash
docker logs digital-invitation-backend --tail 100 | grep -i "error\|crash\|exception"
```

## 🔧 Possible Solutions

### Solution 1: Rebuild Backend (Clean Install)
```bash
cd /var/www/digital-invitation
docker-compose build --no-cache backend
docker-compose up -d backend
```

### Solution 2: Test Hash Match
Hash di database: `$2b$10$pj/s6RM9.4rcngH3c.o61ekKSQjCHZS6ZNoGzpT6pyhLapoXTQXkC`

Test:
```bash
cd backend
node -e "const bcrypt = require('bcrypt'); bcrypt.compare('admin123', '\$2b\$10\$pj/s6RM9.4rcngH3c.o61ekKSQjCHZS6ZNoGzpT6pyhLapoXTQXkC').then(r => console.log('Match:', r));"
```

**Expected:** `Match: true`

### Solution 3: Check JWT_SECRET
```bash
docker exec digital-invitation-backend env | grep JWT_SECRET
```

If missing or invalid, JWT.sign() might fail.

### Solution 4: Simplify Route Handler
Temporary bypass bcrypt to test:
```javascript
// In routes/auth.js, temporarily:
const validPassword = true; // Skip bcrypt for testing
```

If this works, problem is with bcrypt.compare() in route context.

## 🚀 Next Steps

1. **Rebuild backend:**
   ```bash
   docker-compose build --no-cache backend
   docker-compose up -d backend
   ```

2. **Test login:**
   ```bash
   curl -X POST http://192.168.101.100:5001/api/admin/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@krakatau.com","password":"admin123"}' \
     -v
   ```

3. **Monitor logs:**
   ```bash
   docker-compose logs -f backend
   ```

---

**Most likely:** Need to rebuild backend with latest code changes.

