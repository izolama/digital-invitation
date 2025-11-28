# Fix 502 Bad Gateway Error

Error 502 berarti backend tidak bisa diakses atau tidak running.

## 🔍 Diagnosis Steps

### 1. Check Backend Container Status

```bash
docker ps | grep digital-invitation-backend
```

**Expected:** Container should show `Up X minutes (healthy)`

**If not running:**
```bash
docker-compose up -d backend
```

### 2. Check Backend Logs

```bash
docker logs digital-invitation-backend --tail 50
```

**Look for:**
- Error messages
- Database connection errors
- Port binding errors
- CORS errors

### 3. Test Backend Health

```bash
# From server
curl http://localhost:5001/health

# From external
curl https://backend-digital-invitation.nahsbyte.my.id/health
```

**Expected:** `{"success":true,"message":"Server is running",...}`

### 4. Check Port

```bash
netstat -tlnp | grep 5001
```

**Expected:** Port 5001 should be listening

---

## 🔧 Common Fixes

### Fix 1: Backend Not Running

```bash
cd /var/www/digital-invitation
docker-compose up -d backend
docker-compose logs -f backend
```

### Fix 2: Backend Crash on Startup

**Check logs for errors:**
```bash
docker logs digital-invitation-backend
```

**Common causes:**
- Database connection failed
- Missing environment variables
- Port already in use
- Module errors

**Fix:**
```bash
# Rebuild backend
docker-compose build --no-cache backend
docker-compose up -d backend
```

### Fix 3: Database Connection Issue

```bash
# Test database connection
PGPASSWORD=ShaninHanan23 psql -h localhost -U postgres -d digital_invitation -c "SELECT 1;"
```

**If fails:**
- Check PostgreSQL is running
- Verify credentials in docker-compose.yml
- Check `host.docker.internal` is accessible

### Fix 4: Port Conflict

```bash
# Check what's using port 5001
sudo lsof -i :5001

# Kill process if needed
sudo kill -9 <PID>
```

### Fix 5: Network Issue

```bash
# Check network exists
docker network ls | grep shared-network

# Recreate network if needed
docker network create shared-network

# Restart containers
docker-compose down
docker-compose up -d
```

---

## 🚀 Quick Fix Commands

### Full Restart

```bash
cd /var/www/digital-invitation

# Stop all
docker-compose down

# Rebuild backend
docker-compose build --no-cache backend

# Start all
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f backend
```

### Check Everything

```bash
# Run diagnostic script
chmod +x check-backend.sh
./check-backend.sh
```

---

## ✅ Verification

After fix, verify:

1. **Container running:**
```bash
docker ps | grep backend
```

2. **Health check:**
```bash
curl http://localhost:5001/health
```

3. **External access:**
```bash
curl https://backend-digital-invitation.nahsbyte.my.id/health
```

4. **CORS preflight:**
```bash
curl -X OPTIONS https://backend-digital-invitation.nahsbyte.my.id/api/admin/login \
  -H "Origin: https://digital-invitation.nahsbyte.my.id" \
  -H "Access-Control-Request-Method: POST" \
  -v
```

Should return 200 with CORS headers.

---

## 🐛 Debug Mode

**Enable verbose logging in backend:**

Edit `backend/server.js` and add:
```javascript
// Add before routes
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, {
    origin: req.headers.origin,
    headers: req.headers
  });
  next();
});
```

Then rebuild and check logs:
```bash
docker-compose build backend
docker-compose up -d backend
docker-compose logs -f backend
```

---

**Most Common Fix:** Restart backend container!

```bash
docker-compose restart backend
```

