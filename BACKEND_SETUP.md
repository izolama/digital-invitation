# Backend API Setup Guide

Complete guide untuk setup backend API server.

## 🚀 Quick Setup (5 Minutes)

```bash
cd backend

# 1. Install dependencies
npm install

# 2. Setup environment (auto-generate JWT secret)
chmod +x env-setup.sh
./env-setup.sh

# 3. Ensure database is ready
cd ../database
./test-connection.sh

# 4. Start backend server
cd ../backend
npm run dev
```

Server akan berjalan di `http://localhost:5001` ✅

---

## 📋 Prerequisites

- ✅ Node.js 20+ installed
- ✅ PostgreSQL database setup (`digital_invitation` database)
- ✅ Database credentials: `postgres / ShaninHanan23`

---

## 📦 Installation Steps

### 1. Navigate to Backend Directory
```bash
cd /var/www/digital-invitation/backend
```

### 2. Install Dependencies
```bash
npm install
```

**Dependencies yang akan terinstall:**
- `express` - Web framework
- `pg` - PostgreSQL client
- `bcrypt` - Password hashing
- `jsonwebtoken` - JWT authentication
- `cors` - CORS middleware
- `dotenv` - Environment variables
- `helmet` - Security headers
- `morgan` - HTTP request logger
- `express-rate-limit` - Rate limiting

### 3. Setup Environment Variables
```bash
# Option A: Auto setup (recommended)
chmod +x env-setup.sh
./env-setup.sh

# Option B: Manual setup
cp .env.example .env
nano .env  # Edit with your values
```

**Environment Variables:**
```env
PORT=5001
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=ShaninHanan23
DB_NAME=digital_invitation
JWT_SECRET=your-generated-secret-here
JWT_EXPIRES_IN=24h
CORS_ORIGIN=http://localhost:5173
```

### 4. Verify Database Connection
```bash
# Test if database is accessible
cd ../database
./test-connection.sh

# Should show:
# ✓ Connection successful!
# ✓ Database 'digital_invitation' exists
```

### 5. Start Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

**Expected output:**
```
🚀 Digital Invitation Backend API
📡 Server running on port 5001
🌍 Environment: development
📊 Database: digital_invitation
✓ Health check: http://localhost:5001/health
✓ Connected to PostgreSQL database
```

---

## ✅ Verify Installation

### Test Health Endpoint
```bash
curl http://localhost:5001/health
```

**Expected response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2025-11-26T...",
  "environment": "development"
}
```

### Test Admin Login
```bash
curl -X POST http://localhost:5001/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@krakatau.com","password":"admin123"}'
```

**Expected response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Admin",
    "email": "admin@krakatau.com",
    "role": "admin",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Test Registration Submit
```bash
curl -X POST http://localhost:5001/api/registrations \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "companyName": "PT Test Company",
    "whatsappNumber": "08123456789",
    "email": "test@example.com",
    "foodRestriction": "NON VEGAN",
    "allergies": "NO",
    "confirmationAttendance": "YES",
    "numberOfPeople": 2
  }'
```

---

## 🔌 API Endpoints

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| POST | `/api/registrations` | Submit registration |

### Admin Endpoints (Protected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/login` | Admin login |
| POST | `/api/admin/logout` | Admin logout |
| GET | `/api/admin/registrations` | Get all registrations |
| GET | `/api/admin/registrations/:id` | Get single registration |
| DELETE | `/api/admin/registrations/:id` | Delete registration |
| GET | `/api/admin/stats` | Get statistics |

---

## 🐳 Docker Deployment

### Build Backend Image
```bash
cd backend
docker build -t digital-invitation-backend .
```

### Run with Docker Compose (Full Stack)
```bash
cd /var/www/digital-invitation

# Ensure network exists
docker network create shared-network 2>/dev/null || true

# Start full stack
docker-compose up -d
```

This will start:
- ✅ Frontend (port 5173)
- ✅ Backend (port 5000)
- Uses existing PostgreSQL

---

## 🔐 Security Features

- ✅ **Helmet.js** - Security headers
- ✅ **CORS** - Cross-origin resource sharing
- ✅ **Rate Limiting** - 100 requests per 15 minutes
- ✅ **JWT Authentication** - Secure admin access
- ✅ **Bcrypt** - Password hashing (10 rounds)
- ✅ **Input Validation** - Prevents injection
- ✅ **Parameterized Queries** - SQL injection prevention
- ✅ **Request Logging** - Track all requests
- ✅ **IP Address Tracking** - Log user IPs
- ✅ **User Agent Logging** - Track client info

---

## 🐛 Troubleshooting

### Port 5001 already in use
```bash
# Find process
sudo lsof -i :5001

# Kill process
kill -9 <PID>

# Or change port in .env
PORT=5002
```

### Cannot connect to database
```bash
# Check PostgreSQL
docker ps | grep postgres

# Test connection
PGPASSWORD=ShaninHanan23 psql -h localhost -U postgres -d digital_invitation -c '\l'

# Check .env file
cat .env | grep DB_
```

### Module not found errors
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

### JWT token errors
```bash
# Generate new JWT secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Update in .env
JWT_SECRET=your-new-secret
```

### CORS errors from frontend
```bash
# Update CORS_ORIGIN in .env
CORS_ORIGIN=http://localhost:5173,http://your-domain.com

# Restart server
npm run dev
```

---

## 📊 Monitoring

### View Logs
```bash
# Development logs (colored)
npm run dev

# Production logs
npm start 2>&1 | tee backend.log
```

### Check Server Status
```bash
curl http://localhost:5001/health
```

### Database Queries
```bash
# Check total registrations
PGPASSWORD=ShaninHanan23 psql -h localhost -U postgres -d digital_invitation \
  -c "SELECT COUNT(*) FROM registrations;"

# Recent registrations
PGPASSWORD=ShaninHanan23 psql -h localhost -U postgres -d digital_invitation \
  -c "SELECT * FROM registrations ORDER BY created_at DESC LIMIT 5;"
```

---

## 🚀 Production Deployment

### Using PM2 (Recommended)
```bash
# Install PM2 globally
npm install -g pm2

# Start with PM2
pm2 start server.js --name digital-invitation-api

# Save PM2 configuration
pm2 save

# Setup auto-restart on reboot
pm2 startup

# View logs
pm2 logs digital-invitation-api

# Monitor
pm2 monit
```

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5001
JWT_SECRET=your-very-long-and-secure-random-string-minimum-32-characters
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com
```

### Security Checklist for Production
- [ ] Change JWT_SECRET to strong random string
- [ ] Update CORS_ORIGIN to your domain
- [ ] Setup SSL/HTTPS
- [ ] Enable firewall (allow only port 5000 from frontend)
- [ ] Setup process manager (PM2)
- [ ] Configure log rotation
- [ ] Setup monitoring (optional: New Relic, DataDog)
- [ ] Enable database backups
- [ ] Update admin password in database

---

## 📚 Documentation

- API Docs: `../API_DOCUMENTATION.md`
- Backend README: `backend/README.md`
- Database Setup: `../database/EXISTING_SETUP.md`
- Server Setup: `../SERVER_SETUP.md`

---

**Backend API Ready! 🎉**

