# Production Fix: Registration Form Error

## 🔍 Problem Analysis

Dari screenshot, request ke `https://digital-invitation.nahsbyte.my.id:5001/api/registrations` gagal.

**Kemungkinan Penyebab:**
1. ❌ **CORS Error** - Backend belum allow domain production
2. ❌ **Port 5001 tidak accessible** - Firewall/port tidak exposed
3. ❌ **HTTPS/HTTP mismatch** - Frontend HTTPS, backend HTTP
4. ❌ **Backend tidak running** - Container tidak jalan

---

## 🔧 Quick Fixes

### Fix 1: Update CORS di Backend

```bash
# Edit docker-compose.yml, update CORS_ORIGIN:
CORS_ORIGIN=https://digital-invitation.nahsbyte.my.id,http://digital-invitation.nahsbyte.my.id,http://localhost:5173

# Restart backend
docker-compose restart backend
```

### Fix 2: Check Backend Status

```bash
# Check if backend is running
docker ps | grep digital-invitation-backend

# Check backend logs
docker logs digital-invitation-backend --tail 50

# Test backend from server
curl http://localhost:5001/health
```

### Fix 3: Check Port Accessibility

```bash
# Check if port 5001 is listening
sudo netstat -tlnp | grep 5001

# Test from external (if accessible)
curl https://digital-invitation.nahsbyte.my.id:5001/health
```

### Fix 4: Setup Reverse Proxy (Recommended)

**Best Solution:** Setup reverse proxy agar frontend dan backend di same domain.

**Nginx Example:**
```nginx
server {
    listen 443 ssl;
    server_name digital-invitation.nahsbyte.my.id;

    # Frontend
    location / {
        proxy_pass http://localhost:5173;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**Benefits:**
- ✅ No CORS issues (same domain)
- ✅ No port exposure needed
- ✅ Better security
- ✅ Cleaner URLs

---

## 🚀 Recommended Solution: Reverse Proxy

### Option A: Nginx Reverse Proxy

1. **Install Nginx:**
```bash
sudo apt update
sudo apt install nginx
```

2. **Create config:**
```bash
sudo nano /etc/nginx/sites-available/digital-invitation
```

3. **Config content:**
```nginx
server {
    listen 80;
    server_name digital-invitation.nahsbyte.my.id;

    # Frontend
    location / {
        proxy_pass http://localhost:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

4. **Enable site:**
```bash
sudo ln -s /etc/nginx/sites-available/digital-invitation /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

5. **Update Frontend API Config:**
```javascript
// src/config/api.js - In production, use same origin
if (import.meta.env.DEV) {
  return ''; // Vite proxy
} else {
  return ''; // Same origin (reverse proxy handles /api)
}
```

### Option B: Caddy (Easier, Auto HTTPS)

Jika sudah pakai Caddy, tambahkan config:

```
digital-invitation.nahsbyte.my.id {
    reverse_proxy / localhost:5173
    reverse_proxy /api localhost:5001
}
```

---

## 🔍 Debug Steps

### 1. Check Browser Console
- Open DevTools (F12)
- Check Console untuk error detail
- Check Network tab untuk request/response

### 2. Check Backend Logs
```bash
docker logs -f digital-invitation-backend
```

### 3. Test Backend Directly
```bash
# From server
curl -X POST http://localhost:5001/api/registrations \
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

### 4. Check CORS Headers
```bash
curl -I -X OPTIONS https://digital-invitation.nahsbyte.my.id:5001/api/registrations \
  -H "Origin: https://digital-invitation.nahsbyte.my.id" \
  -H "Access-Control-Request-Method: POST"
```

---

## ✅ Checklist

- [ ] Backend container running
- [ ] Backend health check returns 200
- [ ] CORS allows production domain
- [ ] Port 5001 accessible (or use reverse proxy)
- [ ] Frontend rebuilt with latest code
- [ ] Browser console checked for errors
- [ ] Network tab shows request details

---

## 🎯 Immediate Action

**Quick fix untuk test:**

1. **Update CORS:**
```bash
# Edit docker-compose.yml
CORS_ORIGIN=https://digital-invitation.nahsbyte.my.id,http://digital-invitation.nahsbyte.my.id

# Restart
docker-compose restart backend
```

2. **Rebuild Frontend:**
```bash
docker-compose build --no-cache frontend
docker-compose up -d frontend
```

3. **Check Logs:**
```bash
docker-compose logs -f backend
```

4. **Test di Browser:**
- Open DevTools Console
- Submit form
- Check error messages

---

**Best Long-term Solution:** Setup reverse proxy untuk avoid CORS issues completely!

