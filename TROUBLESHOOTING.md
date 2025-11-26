# Troubleshooting: Registration Form Error

## ❌ Error: "Sorry, there was an error submitting your registration"

### 🔍 Diagnosis Steps

**1. Check Backend is Running**
```bash
# Check container status
docker ps | grep digital-invitation-backend

# Should show: Up X minutes (healthy)
```

**2. Test Backend Health**
```bash
curl http://localhost:5001/health

# Expected: {"success":true,"message":"Server is running",...}
```

**3. Test Registration Endpoint Directly**
```bash
curl -X POST http://localhost:5001/api/registrations \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "companyName": "PT Test",
    "email": "test@test.com",
    "foodRestriction": "NON VEGAN",
    "allergies": "NO",
    "confirmationAttendance": "YES",
    "numberOfPeople": 1
  }'
```

**4. Check Backend Logs**
```bash
docker logs digital-invitation-backend --tail 50
```

**5. Check Browser Console**
- Open DevTools (F12)
- Go to Console tab
- Look for CORS errors or network errors
- Go to Network tab
- Try submitting form again
- Check failed request details

---

## 🔧 Solutions

### Solution 1: Rebuild Frontend with API Config

Frontend sudah diupdate untuk menggunakan API config. Rebuild frontend:

```bash
cd /var/www/digital-invitation

# Rebuild frontend
docker-compose build --no-cache frontend

# Restart
docker-compose up -d
```

### Solution 2: Update CORS in Backend

```bash
# Edit docker-compose.yml, update CORS_ORIGIN:
CORS_ORIGIN=http://localhost:5173,http://127.0.0.1:5173,http://your-server-ip:5173

# Restart backend
docker-compose restart backend
```

### Solution 3: Check Network Connectivity

```bash
# From frontend container, test backend
docker exec digital-invitation-frontend wget -O- http://localhost:5001/health

# Or test from host
curl http://localhost:5001/health
```

### Solution 4: Verify API Endpoint in Browser

1. Open browser DevTools (F12)
2. Go to Network tab
3. Submit form
4. Check the failed request:
   - What URL is it trying to hit?
   - What's the error message?
   - Check Response tab for details

---

## 📝 Common Issues

### Issue 1: CORS Error
**Error:** `Access to fetch at 'http://localhost:5001/api/registrations' from origin 'http://localhost:5173' has been blocked by CORS policy`

**Fix:**
```bash
# Update backend CORS_ORIGIN in docker-compose.yml
CORS_ORIGIN=http://localhost:5173,http://127.0.0.1:5173

# Restart backend
docker-compose restart backend
```

### Issue 2: Network Error
**Error:** `Failed to fetch` or `NetworkError`

**Fix:**
- Check backend is running: `docker ps | grep backend`
- Check backend health: `curl http://localhost:5001/health`
- Check firewall/port accessibility

### Issue 3: 404 Not Found
**Error:** `404 Not Found` when hitting API

**Fix:**
- Verify endpoint URL in `src/config/api.js`
- Check backend routes are registered
- Check backend logs for routing errors

### Issue 4: 500 Internal Server Error
**Error:** `500 Internal Server Error`

**Fix:**
```bash
# Check backend logs
docker logs digital-invitation-backend

# Common causes:
# - Database connection failed
# - Missing environment variables
# - Invalid request data
```

---

## ✅ Quick Fix Checklist

```bash
# 1. Ensure backend is running
docker ps | grep backend

# 2. Test backend health
curl http://localhost:5001/health

# 3. Rebuild frontend (after code changes)
docker-compose build frontend
docker-compose up -d frontend

# 4. Restart backend (after CORS changes)
docker-compose restart backend

# 5. Check logs
docker-compose logs -f backend
docker-compose logs -f frontend

# 6. Test from browser console
# Open DevTools > Console, then run:
fetch('http://localhost:5001/api/registrations', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    fullName: 'Test',
    companyName: 'PT Test',
    email: 'test@test.com',
    foodRestriction: 'NON VEGAN',
    allergies: 'NO',
    confirmationAttendance: 'YES',
    numberOfPeople: 1
  })
}).then(r => r.json()).then(console.log).catch(console.error)
```

---

## 🔍 Debug Mode

**Enable detailed logging:**

1. **Backend:** Already logs to console
2. **Frontend:** Check browser console
3. **Network:** Use browser DevTools Network tab

**Check API config:**
```javascript
// In browser console:
import { API_ENDPOINTS } from '@/config/api';
console.log(API_ENDPOINTS);
```

---

## 📞 Still Having Issues?

1. Check all logs: `docker-compose logs`
2. Verify database connection: `cd database && ./test-connection.sh`
3. Test backend directly: `curl http://localhost:5001/health`
4. Check browser console for specific error messages
5. Verify CORS configuration matches your frontend URL

---

**Most Common Fix:** Rebuild frontend after code changes!

```bash
docker-compose build --no-cache frontend
docker-compose up -d
```

