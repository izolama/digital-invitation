# Fix Bcrypt Crash in Docker

## 🔍 Problem
- ✅ Test bcrypt langsung: Works (85ms, Match: true)
- ❌ Bcrypt di route handler: Causes backend crash/restart
- Backend restart setiap kali login attempt

## 🔧 Solution: Switch to bcryptjs

`bcrypt` uses native modules that might have issues in Docker. `bcryptjs` is pure JavaScript and more reliable.

### Step 1: Install bcryptjs

```bash
cd /var/www/digital-invitation/backend
npm install bcryptjs --save
```

### Step 2: Update routes/auth.js

Change:
```javascript
const bcrypt = require('bcrypt');
```

To:
```javascript
const bcrypt = require('bcryptjs');
```

### Step 3: Rebuild Backend

```bash
cd /var/www/digital-invitation
docker-compose build --no-cache backend
docker-compose up -d backend
```

---

## ✅ Alternative: Keep bcrypt but add better error handling

If you want to keep `bcrypt`, ensure proper error handling and check if native module is compiled correctly.

---

**Recommended:** Switch to bcryptjs for Docker compatibility.

