# Setup untuk PostgreSQL yang Sudah Ada

Panduan untuk connect ke PostgreSQL yang sudah running.

## 📊 Database yang Sudah Ada

**Credentials:**
```
Host: localhost
Port: 5432
User: postgres
Password: ShaninHanan23
```

---

## 🚀 Quick Setup (One Command)

```bash
cd database
chmod +x connect-existing.sh
./connect-existing.sh
```

Script akan:
1. ✅ Test koneksi ke PostgreSQL
2. ✅ Buat database `digital_invitation` (jika belum ada)
3. ✅ Import schema dan tables
4. ✅ Insert admin user dan sample data
5. ✅ Verify installation

---

## ✅ Verify Connection

```bash
chmod +x test-connection.sh
./test-connection.sh
```

---

## 🔧 Manual Setup (Step by Step)

### 1. Test Connection
```bash
PGPASSWORD=ShaninHanan23 psql -h localhost -p 5432 -U postgres -d postgres -c '\q'
```

### 2. Create Database
```bash
PGPASSWORD=ShaninHanan23 psql -h localhost -p 5432 -U postgres -d postgres -c "CREATE DATABASE digital_invitation;"
```

### 3. Import Schema
```bash
PGPASSWORD=ShaninHanan23 psql -h localhost -p 5432 -U postgres -d digital_invitation -f schema.sql
```

### 4. Verify
```bash
PGPASSWORD=ShaninHanan23 psql -h localhost -p 5432 -U postgres -d digital_invitation -c "\dt"
```

Expected tables:
- `admin_users`
- `registrations`

---

## 📝 Connection String

**For Backend API:**
```
postgresql://postgres:ShaninHanan23@localhost:5432/digital_invitation
```

**For Node.js (.env):**
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=ShaninHanan23
DB_NAME=digital_invitation
```

---

## 🔍 Useful Commands

### Connect to Database
```bash
PGPASSWORD=ShaninHanan23 psql -h localhost -p 5432 -U postgres -d digital_invitation
```

### List Tables
```sql
\dt
```

### Count Registrations
```sql
SELECT COUNT(*) FROM registrations;
```

### View Admin Users
```sql
SELECT id, name, email FROM admin_users;
```

### Exit psql
```sql
\q
```

---

## 🐛 Troubleshooting

### Can't connect to PostgreSQL

**Check if running:**
```bash
docker ps | grep postgres
```

**Check PostgreSQL container:**
```bash
# Find container name
docker ps

# Check logs
docker logs <container-name>

# Get into container
docker exec -it <container-name> bash
```

**Test from container:**
```bash
docker exec -it <container-name> psql -U postgres -c '\l'
```

### Port not accessible

**Check port:**
```bash
sudo lsof -i :5432
```

**Check Docker port mapping:**
```bash
docker ps | grep postgres
# Should show: 0.0.0.0:5432->5432/tcp
```

### Permission denied

Database user `postgres` should have all privileges. If not:
```sql
GRANT ALL PRIVILEGES ON DATABASE digital_invitation TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;
```

---

## 🔐 Admin Credentials

**For Application Login:**
```
Email: admin@krakatau.com
Password: admin123
```

**To Change Password:**
```bash
# Generate bcrypt hash (use Node.js or online tool)
# Then update:
PGPASSWORD=ShaninHanan23 psql -h localhost -p 5432 -U postgres -d digital_invitation

UPDATE admin_users 
SET password_hash = '$2b$10$NEW_HASH_HERE' 
WHERE email = 'admin@krakatau.com';
```

---

## 📊 Sample Queries

### Get Statistics
```sql
SELECT 
    COUNT(*) as total,
    SUM(CASE WHEN confirmation_attendance = 'YES' THEN 1 ELSE 0 END) as confirmed,
    SUM(CASE WHEN confirmation_attendance = 'NO' THEN 1 ELSE 0 END) as declined,
    SUM(number_of_people) as total_guests
FROM registrations;
```

### Recent Registrations
```sql
SELECT * FROM registrations 
ORDER BY created_at DESC 
LIMIT 5;
```

### Search by Company
```sql
SELECT * FROM registrations 
WHERE company_name ILIKE '%PT%';
```

---

## 📦 Backup & Restore

### Backup
```bash
PGPASSWORD=ShaninHanan23 pg_dump -h localhost -p 5432 -U postgres digital_invitation > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Restore
```bash
PGPASSWORD=ShaninHanan23 psql -h localhost -p 5432 -U postgres digital_invitation < backup.sql
```

---

## 🚀 Next Steps

1. ✅ Database setup done
2. ⏭️ Setup backend API (see API_DOCUMENTATION.md)
3. ⏭️ Update frontend API endpoints
4. ⏭️ Test registration flow
5. ⏭️ Deploy to production

---

**Ready to go! 🎉**

