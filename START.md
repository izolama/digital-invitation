# 🚀 Start Guide - Digital Invitation

Quick reference untuk start aplikasi.

## 📋 Prerequisites

- Docker & Docker Compose installed
- PostgreSQL running (postgres/ShaninHanan23)
- Database `digital_invitation` setup

---

## ⚡ Quick Start (One Command)

```bash
docker network create shared-network 2>/dev/null || true && docker-compose up -d
```

---

## 📦 Step by Step

### 1. Setup Database (First Time Only)
```bash
cd database
./connect-existing.sh
```

### 2. Start Full Stack
```bash
# Create network (first time)
docker network create shared-network

# Start frontend + backend
docker-compose up -d
```

### 3. Check Status
```bash
docker-compose ps
```

Expected output:
```
NAME                           STATUS
digital-invitation-frontend    Up (healthy)
digital-invitation-backend     Up (healthy)
```

### 4. Access Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5001
- **Admin Panel**: http://localhost:5173/admin/login

---

## 🔍 Verify Installation

### Check Health
```bash
# Backend health
curl http://localhost:5001/health

# Frontend
curl http://localhost:5173
```

### View Logs
```bash
# All services
docker-compose logs -f

# Frontend only
docker-compose logs -f frontend

# Backend only
docker-compose logs -f backend
```

---

## 🛑 Stop Application

```bash
# Stop all
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

---

## 🔄 Restart Application

```bash
# Restart all
docker-compose restart

# Restart specific service
docker-compose restart backend
docker-compose restart frontend
```

---

## 🔧 Rebuild After Changes

```bash
# Rebuild and restart
docker-compose build --no-cache
docker-compose up -d

# Or in one command
docker-compose up -d --build
```

---

## 📊 Check Logs

```bash
# Follow all logs
docker-compose logs -f

# Last 50 lines
docker-compose logs --tail=50

# Specific service
docker-compose logs -f backend
```

---

## 🗄️ Database Management

```bash
# Connect to database
PGPASSWORD=ShaninHanan23 psql -h localhost -U postgres -d digital_invitation

# Count registrations
PGPASSWORD=ShaninHanan23 psql -h localhost -U postgres -d digital_invitation \
  -c "SELECT COUNT(*) FROM registrations;"

# Recent registrations
PGPASSWORD=ShaninHanan23 psql -h localhost -U postgres -d digital_invitation \
  -c "SELECT * FROM registrations ORDER BY created_at DESC LIMIT 5;"
```

---

## 🔐 Default Credentials

**Admin Login:**
- Email: `admin@krakatau.com`
- Password: `admin123`

**Database:**
- User: `postgres`
- Password: `ShaninHanan23`

⚠️ **Change these in production!**

---

## 🐛 Troubleshooting

### Container won't start
```bash
# Check logs
docker-compose logs

# Remove and recreate
docker-compose down -v
docker-compose up -d
```

### Port already in use
```bash
# Check what's using the port
sudo lsof -i :5173
sudo lsof -i :5001

# Stop the service or change port in docker-compose.yml
```

### Network not found
```bash
# Create network
docker network create shared-network

# Check if exists
docker network ls | grep shared-network
```

### Database connection failed
```bash
# Check PostgreSQL
docker ps | grep postgres

# Test connection
cd database
./test-connection.sh
```

---

## 📚 More Info

- Full Documentation: `README.md`
- Backend Setup: `BACKEND_SETUP.md`
- Database Setup: `database/EXISTING_SETUP.md`
- Deployment Guide: `DEPLOYMENT.md`

---

**Happy Developing! 🎉**

