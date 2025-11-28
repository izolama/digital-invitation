# Local Development Guide

Panduan untuk menjalankan backend dan frontend secara lokal (tanpa Docker).

## 🚀 Quick Start

### Run Both (Backend + Frontend)

```bash
npm run dev:all
# atau
./run-local.sh
```

Ini akan start:
- Backend: http://localhost:5001
- Frontend: http://localhost:5173

### Run Separately

**Backend only:**
```bash
npm run dev:backend
# atau
./run-backend.sh
```

**Frontend only:**
```bash
npm run dev:frontend
# atau
./run-frontend.sh
```

---

## 📋 Prerequisites

### 1. Node.js
```bash
node --version  # Should be >= 20.0.0
npm --version
```

### 2. PostgreSQL
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Or test connection
PGPASSWORD=ShaninHanan23 psql -h localhost -U postgres -d digital_invitation -c "SELECT 1;"
```

### 3. Database Setup
```bash
# If database doesn't exist
cd database
./connect-existing.sh
```

---

## 🔧 Setup Steps

### 1. Install Dependencies

```bash
# Backend
cd backend
npm install
cd ..

# Frontend
npm install
```

### 2. Create Backend .env

```bash
cd backend
cp .env.example .env
# Edit .env with your values
nano .env
```

**Required variables:**
```env
NODE_ENV=development
PORT=5001
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=ShaninHanan23
DB_NAME=digital_invitation
JWT_SECRET=your-secret-key
CORS_ORIGIN=http://localhost:5173
```

### 3. Start Services

**Option A: Both together**
```bash
npm run dev:all
```

**Option B: Separate terminals**

Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):
```bash
npm run dev
```

---

## 🌐 Access Points

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5001
- **Health Check**: http://localhost:5001/health
- **Admin Login**: http://localhost:5173/admin/login

---

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Find what's using the port
sudo lsof -i :5001  # Backend
sudo lsof -i :5173  # Frontend

# Kill process
kill -9 <PID>
```

### Database Connection Failed

```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Test connection
PGPASSWORD=ShaninHanan23 psql -h localhost -U postgres -d digital_invitation

# Check .env DB_HOST
cat backend/.env | grep DB_HOST
```

### Module Not Found

```bash
# Reinstall dependencies
cd backend && rm -rf node_modules package-lock.json && npm install
cd ..
rm -rf node_modules package-lock.json && npm install
```

### CORS Error

Update `backend/.env`:
```env
CORS_ORIGIN=http://localhost:5173,http://127.0.0.1:5173
```

---

## 📝 Development Notes

### Backend Hot Reload
Backend uses `nodemon` for auto-reload on file changes.

### Frontend Hot Reload
Frontend uses Vite HMR (Hot Module Replacement) for instant updates.

### API Configuration
Frontend automatically uses `http://localhost:5001` in development mode (see `src/config/api.js`).

---

## ✅ Verification

### Test Backend
```bash
curl http://localhost:5001/health
```

### Test Frontend
Open http://localhost:5173 in browser

### Test Login
```bash
curl -X POST http://localhost:5001/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@krakatau.com","password":"admin123"}'
```

---

**Happy coding! 🎉**

