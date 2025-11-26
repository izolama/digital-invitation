# Digital Invitation Backend API

Backend API server untuk Digital Invitation menggunakan Express.js + PostgreSQL.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Setup Environment Variables
```bash
cp .env.example .env
# Edit .env dengan database credentials Anda
```

### 3. Ensure Database is Setup
```bash
cd ../database
./test-connection.sh
# Jika belum setup, jalankan: ./connect-existing.sh
```

### 4. Start Server
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Server akan berjalan di `http://localhost:5001`

---

## 📡 API Endpoints

### Public Endpoints

**POST /api/registrations**
- Submit new registration
- No authentication required

### Admin Endpoints (Protected)

**POST /api/admin/login**
- Admin login

**GET /api/admin/registrations**
- Get all registrations
- Query params: `page`, `limit`, `status`, `search`

**GET /api/admin/registrations/:id**
- Get single registration

**DELETE /api/admin/registrations/:id**
- Delete registration

**GET /api/admin/stats**
- Get dashboard statistics

### Health Check

**GET /health**
- Check if server is running

---

## 🔐 Authentication

API menggunakan JWT (JSON Web Tokens) untuk authentication.

**Login:**
```bash
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@krakatau.com","password":"admin123"}'
```

**Use Token:**
```bash
curl -X GET http://localhost:5000/api/admin/registrations \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🗄️ Database Connection

Backend connect ke PostgreSQL dengan credentials di `.env`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=ShaninHanan23
DB_NAME=digital_invitation
```

---

## 🧪 Testing API

### Test Health Check
```bash
curl http://localhost:5001/health
```

### Test Registration (Public)
```bash
curl -X POST http://localhost:5001/api/registrations \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "companyName": "PT Test",
    "whatsappNumber": "08123456789",
    "email": "test@example.com",
    "foodRestriction": "NON VEGAN",
    "allergies": "NO",
    "confirmationAttendance": "YES",
    "numberOfPeople": 2
  }'
```

### Test Login
```bash
curl -X POST http://localhost:5001/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@krakatau.com","password":"admin123"}'
```

---

## 📁 Project Structure

```
backend/
├── config/
│   └── database.js          # PostgreSQL connection pool
├── middleware/
│   └── auth.js              # JWT authentication middleware
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── registrations.js     # Registration routes (public)
│   └── admin.js             # Admin routes (protected)
├── .env.example             # Environment variables template
├── .gitignore               # Git ignore rules
├── package.json             # Dependencies & scripts
├── server.js                # Main server file
└── README.md                # This file
```

---

## 🔒 Security Features

- ✅ Helmet.js for security headers
- ✅ CORS configuration
- ✅ Rate limiting (100 requests per 15 minutes)
- ✅ JWT authentication
- ✅ Bcrypt password hashing
- ✅ Input validation
- ✅ SQL injection prevention (parameterized queries)
- ✅ IP address logging
- ✅ User agent tracking

---

## 🐛 Troubleshooting

### Cannot connect to database
```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# Test connection
PGPASSWORD=ShaninHanan23 psql -h localhost -U postgres -d digital_invitation -c '\l'

# Check .env file
cat .env | grep DB_
```

### Port already in use
```bash
# Find what's using port 5001
sudo lsof -i :5001

# Change port in .env
PORT=5002
```

### Module not found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

---

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 5001 |
| NODE_ENV | Environment | development |
| DB_HOST | PostgreSQL host | localhost |
| DB_PORT | PostgreSQL port | 5432 |
| DB_USER | Database user | postgres |
| DB_PASSWORD | Database password | - |
| DB_NAME | Database name | digital_invitation |
| JWT_SECRET | JWT secret key | - |
| JWT_EXPIRES_IN | Token expiration | 24h |
| CORS_ORIGIN | Allowed origins | * |

---

## 🚀 Deployment

### With Docker
See `docker-compose.backend.yml` in root directory.

### Manual Deployment
```bash
# Install dependencies
npm install --production

# Set environment to production
export NODE_ENV=production

# Start with PM2 (recommended)
pm2 start server.js --name digital-invitation-api

# Or start normally
npm start
```

---

## 📚 Documentation

- Main API docs: `../API_DOCUMENTATION.md`
- Database setup: `../database/README.md`
- Frontend docs: `../README.md`

---

**Made with ❤️ for Krakatau Baja Industri**

