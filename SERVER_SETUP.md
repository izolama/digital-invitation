# Server Setup Guide

Panduan setup lengkap di server untuk Digital Invitation dengan existing PostgreSQL.

## 📊 Existing Infrastructure

**PostgreSQL Database:**
- User: `postgres`
- Password: `ShaninHanan23`
- Port: `5432`
- Status: ✅ Already running in Docker

---

## 🚀 Setup Steps

### 1. Setup Database Schema

```bash
cd /var/www/digital-invitation/database

# Make script executable
chmod +x connect-existing.sh
chmod +x test-connection.sh

# Test connection first
./test-connection.sh

# Setup database schema
./connect-existing.sh
```

**What it does:**
- Creates `digital_invitation` database
- Imports tables (admin_users, registrations)
- Inserts admin user (admin@krakatau.com / admin123)
- Inserts 5 sample registrations

**Expected Output:**
```
✓ PostgreSQL is accessible
✓ Database created
✓ Schema imported successfully
  Admin users: 1
  Sample registrations: 5
```

---

### 2. Verify Database

```bash
# Quick test
PGPASSWORD=ShaninHanan23 psql -h localhost -p 5432 -U postgres -d digital_invitation -c "\dt"

# Should show:
#   admin_users
#   registrations
```

---

### 3. Deploy Frontend (Already Running)

Frontend sudah running di port 5173. Database schema sudah siap, tinggal setup backend API.

---

### 4. Setup Backend API (Next Step)

**Option A: Node.js Backend**

Create backend directory:
```bash
mkdir -p /var/www/digital-invitation-api
cd /var/www/digital-invitation-api
```

Install dependencies:
```bash
npm init -y
npm install express pg bcrypt jsonwebtoken cors dotenv
```

Create `.env`:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=ShaninHanan23
DB_NAME=digital_invitation
JWT_SECRET=your-super-secret-key-change-in-production
```

Copy example server code from `API_DOCUMENTATION.md`

Start server:
```bash
node server.js
```

**Option B: Use Docker for Backend**

Create Dockerfile for backend and add to docker-compose.

---

## 🔌 Connection Details

**Database Connection String:**
```
postgresql://postgres:ShaninHanan23@localhost:5432/digital_invitation
```

**Frontend:**
- URL: `http://server-ip:5173`
- Admin: `http://server-ip:5173/admin/login`

**Backend API (when setup):**
- URL: `http://server-ip:5001`
- Health: `http://server-ip:5001/health`

---

## ✅ Current Status Checklist

- [x] Frontend deployed (port 5173)
- [x] PostgreSQL running (port 5432)
- [x] Database schema setup
- [ ] Backend API running
- [ ] Frontend connected to backend
- [ ] Test registration flow
- [ ] Production ready

---

## 🔍 Quick Verification Commands

```bash
# Check frontend
curl http://localhost:5173

# Check database
PGPASSWORD=ShaninHanan23 psql -h localhost -U postgres -d digital_invitation -c "SELECT COUNT(*) FROM registrations;"

# Check backend (when running)
curl http://localhost:5001/health

# View all registrations
PGPASSWORD=ShaninHanan23 psql -h localhost -U postgres -d digital_invitation -c "SELECT * FROM registrations ORDER BY created_at DESC LIMIT 5;"
```

---

## 🔐 Default Credentials

**Application Admin Login:**
```
Email: admin@krakatau.com
Password: admin123
```

**Database:**
```
User: postgres
Password: ShaninHanan23
```

⚠️ **IMPORTANT:** Change these in production!

---

## 📝 Next Steps

1. ✅ Database schema setup - DONE
2. 🔄 Setup backend API server
3. 🔄 Update frontend API endpoints (if needed)
4. 🔄 Test end-to-end flow
5. 🔄 Change default passwords
6. 🔄 Setup SSL/HTTPS
7. 🔄 Configure firewall
8. 🔄 Setup backups

---

## 📚 Documentation Links

- Database Setup: `database/EXISTING_SETUP.md`
- API Documentation: `API_DOCUMENTATION.md`
- Quick DB Guide: `database/QUICKSTART_DB.md`
- Frontend Deployment: `DEPLOYMENT.md`

---

## 🐛 Troubleshooting

**Database connection failed:**
```bash
# Check PostgreSQL container
docker ps | grep postgres

# Check port accessibility
telnet localhost 5432

# View PostgreSQL logs
docker logs <postgres-container-name>
```

**Can't access frontend:**
```bash
# Check if container running
docker ps | grep digital-invitation

# Check logs
docker logs digital-invitation-app

# Restart container
docker-compose restart
```

---

**Setup by:** Digital Invitation Team  
**Date:** 2025-11-26  
**Status:** Database Ready ✅

