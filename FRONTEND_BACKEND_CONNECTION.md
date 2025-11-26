# Frontend-Backend Connection Guide

Panduan untuk menghubungkan frontend dengan backend API.

## 🔌 Connection Setup

### Development Mode (Local)

**Option 1: Vite Proxy (Recommended)**
- Vite proxy sudah dikonfigurasi di `vite.config.js`
- Frontend menggunakan path relatif `/api/*`
- Vite otomatis proxy ke `http://localhost:5001`
- **No configuration needed!**

**Option 2: Direct URL**
- Set environment variable: `VITE_API_BASE_URL=http://localhost:5001`
- Frontend akan langsung hit backend

### Production Mode (Docker)

**Current Setup:**
- Frontend: `http://server-ip:5173`
- Backend: `http://server-ip:5001`

**Option 1: Environment Variable (Recommended)**
```bash
# In docker-compose.yml, add to frontend environment:
environment:
  - VITE_API_BASE_URL=http://server-ip:5001
```

**Option 2: Same Domain with Reverse Proxy**
- Setup Nginx/Caddy to proxy both frontend and backend
- Frontend: `https://yourdomain.com`
- Backend: `https://yourdomain.com/api` (proxied to backend:5001)

---

## 🐛 Troubleshooting

### Error: "Sorry, there was an error submitting your registration"

**Check 1: Backend is Running**
```bash
# Check backend container
docker ps | grep digital-invitation-backend

# Check backend health
curl http://localhost:5001/health
```

**Check 2: CORS Configuration**
```bash
# Check backend CORS settings in backend/.env
CORS_ORIGIN=http://localhost:5173,http://your-domain.com
```

**Check 3: Network Connectivity**
```bash
# From frontend container, test backend
docker exec digital-invitation-frontend wget -O- http://digital-invitation-backend:5001/health
```

**Check 4: Browser Console**
- Open browser DevTools (F12)
- Check Console tab for errors
- Check Network tab for failed requests

**Check 5: Backend Logs**
```bash
# View backend logs
docker logs digital-invitation-backend

# Follow logs
docker logs -f digital-invitation-backend
```

---

## 🔧 Quick Fixes

### Fix 1: Update CORS in Backend
```bash
# Edit backend/.env
CORS_ORIGIN=http://localhost:5173,http://your-server-ip:5173

# Restart backend
docker-compose restart backend
```

### Fix 2: Use Environment Variable
```bash
# Add to docker-compose.yml frontend service:
environment:
  - VITE_API_BASE_URL=http://localhost:5001

# Rebuild frontend
docker-compose build frontend
docker-compose up -d
```

### Fix 3: Check API Endpoint
```bash
# Test registration endpoint directly
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

---

## 📝 API Configuration

**File:** `src/config/api.js`

**Endpoints:**
- `API_ENDPOINTS.REGISTRATIONS` - Submit registration
- `API_ENDPOINTS.ADMIN_LOGIN` - Admin login
- `API_ENDPOINTS.ADMIN_REGISTRATIONS` - Get registrations
- `API_ENDPOINTS.ADMIN_STATS` - Get statistics

**Usage:**
```javascript
import { API_ENDPOINTS } from '@/config/api';

fetch(API_ENDPOINTS.REGISTRATIONS, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
});
```

---

## ✅ Verification Checklist

- [ ] Backend container is running
- [ ] Backend health check returns 200
- [ ] CORS allows frontend origin
- [ ] Network connectivity between containers
- [ ] API endpoints are correct
- [ ] Environment variables set (if needed)
- [ ] Browser console shows no CORS errors
- [ ] Backend logs show incoming requests

---

## 🚀 Production Setup

### Recommended: Reverse Proxy

**Nginx Example:**
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Frontend
    location / {
        proxy_pass http://localhost:5173;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

**Benefits:**
- Single domain (no CORS issues)
- SSL/HTTPS support
- Better security
- Cleaner URLs

---

**Need help?** Check backend logs and browser console for detailed error messages.

