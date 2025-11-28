# Fix 502 Error - Rate Limiter Issue

## 🔍 Problem
- ✅ OPTIONS preflight works (200)
- ✅ CORS headers correct
- ❌ POST requests return 502

**Root Cause:** `express-rate-limit` throws error when `X-Forwarded-For` header is present but `trust proxy` is not set.

## 🔧 Solution Applied

### 1. Disabled Rate Limiter Temporarily

Rate limiter is now disabled via environment variable to fix 502 error.

**In `docker-compose.yml`:**
```yaml
environment:
  - ENABLE_RATE_LIMIT=false
```

**In `backend/server.js`:**
- Rate limiter only enabled if `ENABLE_RATE_LIMIT !== 'false'`
- Added error handling to prevent crashes

### 2. Rebuild Backend

```bash
cd /var/www/digital-invitation
docker-compose build --no-cache backend
docker-compose up -d backend
```

### 3. Test

```bash
./test-login.sh
```

Should now return 200 instead of 502.

---

## ✅ Re-enable Rate Limiter (After Fix)

Once confirmed working, you can re-enable rate limiter:

### Option 1: Fix with trust proxy (if behind proxy)

```javascript
// In backend/server.js
app.set('trust proxy', 1); // Trust first proxy

// Then enable rate limiter
```

### Option 2: Use custom key generator

```javascript
const limiter = rateLimit({
  keyGenerator: (req) => {
    // Use connection IP only
    return req.connection?.remoteAddress || 'unknown';
  },
  // ... other options
});
```

### Option 3: Keep disabled (not recommended for production)

Only disable if you have other rate limiting (e.g., Cloudflare).

---

## 🧪 Verification

After rebuild, test:

```bash
# Should return 200
curl -X POST https://backend-digital-invitation.nahsbyte.my.id/api/admin/login \
  -H "Content-Type: application/json" \
  -H "Origin: https://digital-invitation.nahsbyte.my.id" \
  -d '{"email":"admin@krakatau.com","password":"admin123"}'
```

**Expected:** `{"success":true,"data":{...}}`

---

**Rate limiter is now disabled. Rebuild and test!**

