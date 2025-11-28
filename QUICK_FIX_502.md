# Quick Fix 502 Error on POST Requests

## 🔍 Problem
- ✅ Health check works (200)
- ✅ CORS preflight works (200)  
- ❌ POST requests return 502

This suggests database connection issue when POST endpoints try to query.

---

## 🚀 Quick Fix

### Step 1: Check Backend Logs

```bash
docker logs digital-invitation-backend --tail 50
```

Look for:
- Database connection errors
- Timeout errors
- "host.docker.internal" errors

### Step 2: Test Database Connection

```bash
# From server
PGPASSWORD=ShaninHanan23 psql -h localhost -U postgres -d digital_invitation -c "SELECT 1;"

# From inside backend container
docker exec digital-invitation-backend node /app/test-db-connection.js
```

### Step 3: Fix Database Host

**If using `host.docker.internal` and it's not working:**

**Option A: Use host network mode (if on same server)**
```yaml
# In docker-compose.yml backend service
network_mode: "host"
# Remove networks section
```

**Option B: Use actual IP**
```yaml
# In docker-compose.yml
environment:
  - DB_HOST=172.17.0.1  # Docker bridge gateway
  # OR
  - DB_HOST=<actual-server-ip>
```

**Option C: Use service name (if DB in Docker)**
```yaml
# If PostgreSQL is in Docker Compose
environment:
  - DB_HOST=postgres  # Service name
```

### Step 4: Increase Connection Timeout

Already fixed in `backend/config/database.js`:
- Changed from 2000ms to 10000ms

**Rebuild backend:**
```bash
docker-compose build --no-cache backend
docker-compose up -d backend
```

### Step 5: Test Again

```bash
./test-login.sh
```

---

## 🔧 Alternative: Use Host Network

If `host.docker.internal` doesn't work, use host network:

```yaml
backend:
  # ... other config ...
  network_mode: "host"
  # Remove: networks section
  environment:
    - DB_HOST=localhost  # Can use localhost with host network
```

**Then restart:**
```bash
docker-compose down
docker-compose up -d
```

---

## ✅ Verification

After fix, test:

```bash
# 1. Health check
curl https://backend-digital-invitation.nahsbyte.my.id/health

# 2. Login
curl -X POST https://backend-digital-invitation.nahsbyte.my.id/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@krakatau.com","password":"admin123"}'

# 3. Registration
curl -X POST https://backend-digital-invitation.nahsbyte.my.id/api/registrations \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test",
    "companyName": "PT Test",
    "email": "test@test.com",
    "foodRestriction": "NON VEGAN",
    "allergies": "NO",
    "confirmationAttendance": "YES",
    "numberOfPeople": 1
  }'
```

All should return 200/201, not 502.

---

**Most Likely Fix:** Database connection timeout or `host.docker.internal` not resolving.

**Quick Test:**
```bash
docker exec digital-invitation-backend ping -c 1 host.docker.internal
```

If this fails, use one of the alternatives above.

