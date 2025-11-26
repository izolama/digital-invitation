# Database Quick Start Guide

Setup database schema pada PostgreSQL yang sudah ada! ⚡

## 🚀 One-Command Setup

**For Existing PostgreSQL (Recommended):**
```bash
cd database && chmod +x connect-existing.sh && ./connect-existing.sh
```

That's it! Database schema is ready! 🎉

---

## 📝 What You Get

✅ PostgreSQL 16 database  
✅ Pre-configured schema  
✅ Sample data (5 registrations)  
✅ Default admin user  
✅ pgAdmin web interface (optional)  

---

## 🔌 Connection Info

**Database:**
```
Host: localhost
Port: 5432
Database: digital_invitation
User: postgres
Password: ShaninHanan23
```

**Connection String:**
```
postgresql://postgres:ShaninHanan23@localhost:5432/digital_invitation
```

---

## ⚡ Quick Commands

```bash
# Test connection
./test-connection.sh

# Access psql
PGPASSWORD=ShaninHanan23 psql -h localhost -p 5432 -U postgres -d digital_invitation

# Backup
PGPASSWORD=ShaninHanan23 pg_dump -h localhost -p 5432 -U postgres digital_invitation > backup.sql

# Count registrations
PGPASSWORD=ShaninHanan23 psql -h localhost -p 5432 -U postgres -d digital_invitation -c "SELECT COUNT(*) FROM registrations;"
```

---

## ✅ Verify Installation

```bash
# Test connection
./test-connection.sh

# Or manually:
PGPASSWORD=ShaninHanan23 psql -h localhost -p 5432 -U postgres -d digital_invitation -c "\dt"

# Count registrations
PGPASSWORD=ShaninHanan23 psql -h localhost -p 5432 -U postgres -d digital_invitation -c "SELECT COUNT(*) FROM registrations;"
```

Expected output: `count = 5` (sample data)

---

## 🔐 Security (IMPORTANT!)

**Before going to production:**

1. Change admin application password (see EXISTING_SETUP.md)
2. Enable firewall rules
3. Setup SSL connections
4. Restrict PostgreSQL access to localhost only

---

## 🐛 Troubleshooting

**Problem:** Port 5432 already in use  
**Solution:** 
```bash
# Stop existing PostgreSQL
sudo systemctl stop postgresql
# Or change port in docker-compose.db.yml
```

**Problem:** Can't connect  
**Solution:**
```bash
# Test connection
./test-connection.sh

# Check if PostgreSQL is running
docker ps | grep postgres

# Try connecting directly
PGPASSWORD=ShaninHanan23 psql -h localhost -p 5432 -U postgres -d postgres -c '\l'
```

**Problem:** Lost data  
**Solution:**
```bash
# Restore from backup:
PGPASSWORD=ShaninHanan23 psql -h localhost -p 5432 -U postgres digital_invitation < backup.sql
```

---

## 📚 Next Steps

1. ✅ Database setup done
2. ⏭️ Setup backend API (see API_DOCUMENTATION.md)
3. ⏭️ Connect frontend to backend
4. ⏭️ Test registration flow
5. ⏭️ Deploy to production

---

**Need help?** 
- `database/EXISTING_SETUP.md` - Setup untuk PostgreSQL yang sudah ada
- `database/README.md` - Complete documentation

