# PostgreSQL Database Setup

Complete guide untuk setup PostgreSQL database untuk Digital Invitation.

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)

```bash
cd database
chmod +x setup.sh
./setup.sh
```

Script akan otomatis:
- ✅ Check Docker status
- ✅ Create network jika belum ada
- ✅ Start PostgreSQL container
- ✅ Wait sampai database ready
- ✅ Import schema dan sample data
- ✅ Optional: Start pgAdmin

### Option 2: Manual Setup

```bash
cd database

# Create network (if not exists)
docker network create shared-network

# Start PostgreSQL
docker-compose -f docker-compose.db.yml up -d postgres

# Wait 5-10 seconds, then check
docker ps | grep digital-invitation-db

# (Optional) Start pgAdmin
docker-compose -f docker-compose.db.yml up -d pgadmin
```

---

## 📊 Database Access

### PostgreSQL Connection

**Connection Details:**
```
Host: localhost
Port: 5432
Database: digital_invitation
User: admin
Password: changeme_in_production
```

**Connection String:**
```
postgresql://admin:changeme_in_production@localhost:5432/digital_invitation
```

**psql CLI:**
```bash
docker exec -it digital-invitation-db psql -U admin -d digital_invitation
```

---

### pgAdmin Web Interface

**Access:**
```
URL: http://localhost:5050
Email: admin@krakatau.com
Password: admin123
```

**Add Server in pgAdmin:**
1. Click "Add New Server"
2. General Tab:
   - Name: Digital Invitation DB
3. Connection Tab:
   - Host: postgres (or digital-invitation-db)
   - Port: 5432
   - Database: digital_invitation
   - Username: admin
   - Password: changeme_in_production
4. Click "Save"

---

## 📁 Database Schema

### Tables

**1. admin_users**
```sql
id              SERIAL PRIMARY KEY
name            VARCHAR(255)
email           VARCHAR(255) UNIQUE
password_hash   VARCHAR(255)
role            VARCHAR(50) DEFAULT 'admin'
is_active       BOOLEAN DEFAULT true
created_at      TIMESTAMP
updated_at      TIMESTAMP
last_login      TIMESTAMP
```

**2. registrations**
```sql
id                          SERIAL PRIMARY KEY
full_name                   VARCHAR(255)
company_name                VARCHAR(255)
whatsapp_number             VARCHAR(50)
email                       VARCHAR(255)
food_restriction            VARCHAR(50)
allergies                   VARCHAR(10)
confirmation_attendance     VARCHAR(10)
number_of_people            INTEGER
ip_address                  INET
user_agent                  TEXT
created_at                  TIMESTAMP
updated_at                  TIMESTAMP
```

### Indexes
- `idx_registrations_email`
- `idx_registrations_company`
- `idx_registrations_created_at`
- `idx_registrations_attendance`
- `idx_registrations_full_name`
- `idx_admin_users_email`

### Triggers
- Auto-update `updated_at` on record modification

---

## 🔍 Useful SQL Queries

### Check Total Registrations
```sql
SELECT COUNT(*) as total FROM registrations;
```

### Get Statistics
```sql
SELECT 
    COUNT(*) as total,
    SUM(CASE WHEN confirmation_attendance = 'YES' THEN 1 ELSE 0 END) as confirmed,
    SUM(CASE WHEN confirmation_attendance = 'NO' THEN 1 ELSE 0 END) as declined,
    SUM(CASE WHEN confirmation_attendance = 'MAYBE' THEN 1 ELSE 0 END) as maybe,
    SUM(number_of_people) as total_guests
FROM registrations;
```

### Recent Registrations
```sql
SELECT * FROM registrations 
ORDER BY created_at DESC 
LIMIT 10;
```

### Search by Company
```sql
SELECT * FROM registrations 
WHERE company_name ILIKE '%PT ABC%';
```

### Food Restrictions Breakdown
```sql
SELECT 
    food_restriction, 
    COUNT(*) as count 
FROM registrations 
GROUP BY food_restriction 
ORDER BY count DESC;
```

---

## 🔧 Management Commands

### Start Database
```bash
docker-compose -f docker-compose.db.yml up -d
```

### Stop Database
```bash
docker-compose -f docker-compose.db.yml down
```

### View Logs
```bash
docker-compose -f docker-compose.db.yml logs -f postgres
```

### Restart Database
```bash
docker-compose -f docker-compose.db.yml restart postgres
```

### Database Backup
```bash
# Backup
docker exec digital-invitation-db pg_dump -U admin digital_invitation > backup.sql

# Backup with timestamp
docker exec digital-invitation-db pg_dump -U admin digital_invitation > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Restore Database
```bash
docker exec -i digital-invitation-db psql -U admin digital_invitation < backup.sql
```

### Reset Database (Clean reinstall)
```bash
docker-compose -f docker-compose.db.yml down -v
docker-compose -f docker-compose.db.yml up -d
```

---

## 🔐 Security

### Change Default Password

**1. Update docker-compose.db.yml:**
```yaml
environment:
  POSTGRES_PASSWORD: your_secure_password
```

**2. Update admin password:**
```bash
# Generate bcrypt hash for new password
# Use online tool or Node.js:
# bcrypt.hash('your_new_password', 10)

# Then update in database:
docker exec -it digital-invitation-db psql -U admin -d digital_invitation

UPDATE admin_users 
SET password_hash = '$2b$10$NEW_HASH_HERE' 
WHERE email = 'admin@krakatau.com';
```

### Production Security Checklist
- [ ] Change default PostgreSQL password
- [ ] Change admin application password
- [ ] Use strong passwords (min 16 characters)
- [ ] Enable SSL connections
- [ ] Restrict network access (firewall)
- [ ] Regular backups
- [ ] Monitor database logs
- [ ] Keep PostgreSQL updated

---

## 📈 Performance Tips

### Check Database Size
```sql
SELECT 
    pg_size_pretty(pg_database_size('digital_invitation')) as size;
```

### Check Table Sizes
```sql
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Vacuum Database (Optimize)
```sql
VACUUM ANALYZE;
```

### Check Index Usage
```sql
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan as scans,
    idx_tup_read as tuples_read,
    idx_tup_fetch as tuples_fetched
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;
```

---

## 🐛 Troubleshooting

### Database won't start
```bash
# Check logs
docker logs digital-invitation-db

# Check if port is in use
sudo lsof -i :5432

# Remove and recreate
docker-compose -f docker-compose.db.yml down -v
docker-compose -f docker-compose.db.yml up -d
```

### Can't connect to database
```bash
# Check container status
docker ps | grep digital-invitation-db

# Test connection
docker exec digital-invitation-db pg_isready -U admin -d digital_invitation

# Check network
docker network inspect shared-network
```

### pgAdmin can't connect
- Use host: `postgres` or `digital-invitation-db` (NOT localhost)
- Make sure both containers are in same network
- Check credentials match docker-compose.db.yml

### Data persistence
- Data is stored in Docker volume: `database_postgres_data`
- To completely remove data: `docker volume rm database_postgres_data`
- Backup before removing volumes!

---

## 📚 Additional Resources

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [pgAdmin Documentation](https://www.pgadmin.org/docs/)
- [Docker PostgreSQL Image](https://hub.docker.com/_/postgres)
- Main API Documentation: [../API_DOCUMENTATION.md](../API_DOCUMENTATION.md)

---

**Ready to go! 🚀**

