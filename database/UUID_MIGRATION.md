# UUID Migration Guide

Panduan untuk mengubah ID dari SERIAL (integer) menjadi UUID.

## 🔄 Migration Options

### Option 1: Fresh Install (New Database)

Jika database masih kosong atau bisa di-reset:

```bash
cd database
PGPASSWORD=ShaninHanan23 psql -h localhost -U postgres -d digital_invitation -f schema-uuid.sql
```

### Option 2: Migrate Existing Database

Jika sudah ada data dan ingin migrate:

```bash
cd database
chmod +x migrate-to-uuid.sh
./migrate-to-uuid.sh
```

**⚠️ WARNING:** Migration ini akan:
- Menghapus ID lama (integer)
- Generate UUID baru untuk semua records
- Tidak bisa rollback dengan mudah

## 📋 What Changes

### Database Schema

**Before:**
```sql
id SERIAL PRIMARY KEY
```

**After:**
```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
```

### Backend

- No changes needed! PostgreSQL handles UUID automatically
- `gen_random_uuid()` generates UUID automatically on insert
- All queries work the same way

### Frontend

- No changes needed! UUID is just a string
- URL format: `/registration/{uuid}` instead of `/registration/{id}`

## ✅ Verification

After migration, verify:

```sql
-- Check UUID format
SELECT id, full_name FROM registrations LIMIT 3;

-- Should see UUIDs like:
-- 550e8400-e29b-41d4-a716-446655440000
```

## 🚀 After Migration

1. **Rebuild backend** (if needed):
```bash
docker-compose build --no-cache backend
docker-compose up -d backend
```

2. **Test registration**:
```bash
curl -X POST http://192.168.101.100:5001/api/registrations \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "companyName": "PT Test",
    "email": "test@test.com",
    "foodRestriction": "NON VEGAN",
    "allergies": "NO",
    "confirmationAttendance": "YES",
    "numberOfPeople": 1
  }'
```

Response should include UUID in `data.id`.

---

**Note:** UUIDs are longer but provide:
- Better security (not sequential)
- Globally unique
- No collision risk
- Better for distributed systems

