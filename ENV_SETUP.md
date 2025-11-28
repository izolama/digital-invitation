# Environment Variables Setup

Panduan setup file `.env` untuk backend.

## 📝 Backend .env File

### Location
`backend/.env`

### Setup

```bash
cd backend
cp .env.example .env
# Edit .env dengan nilai yang sesuai
```

### Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NODE_ENV` | Environment mode | `production` | Yes |
| `PORT` | Server port | `5001` | Yes |
| `DB_HOST` | PostgreSQL host | `host.docker.internal` | Yes |
| `DB_PORT` | PostgreSQL port | `5432` | Yes |
| `DB_USER` | Database user | `postgres` | Yes |
| `DB_PASSWORD` | Database password | - | Yes |
| `DB_NAME` | Database name | `digital_invitation` | Yes |
| `JWT_SECRET` | JWT secret key | - | Yes |
| `JWT_EXPIRES_IN` | Token expiration | `24h` | Yes |
| `CORS_ORIGIN` | Allowed origins (comma-separated) | - | Yes |
| `ENABLE_RATE_LIMIT` | Enable rate limiting | `false` | No |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | `900000` | No |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | `100` | No |

## 🔐 Security Notes

### JWT_SECRET
**IMPORTANT:** Generate a strong random secret:

```bash
# Generate secure JWT secret
openssl rand -base64 32

# Or using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### DB_PASSWORD
Use a strong password for production database.

### CORS_ORIGIN
Only include trusted domains. Don't use `*` in production.

## 📋 Example .env File

```env
# Server Configuration
NODE_ENV=production
PORT=5001

# Database Configuration
DB_HOST=host.docker.internal
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=YourStrongPassword123!
DB_NAME=digital_invitation

# JWT Configuration
JWT_SECRET=your-generated-secret-key-here-minimum-32-characters
JWT_EXPIRES_IN=24h

# CORS Configuration
CORS_ORIGIN=https://digital-invitation.nahsbyte.my.id,http://localhost:5173

# Rate Limiting
ENABLE_RATE_LIMIT=false
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 🐳 Docker Compose

If using Docker Compose, environment variables can be set in:
1. `docker-compose.yml` (environment section)
2. `.env` file in root directory (for docker-compose)
3. `backend/.env` file (for backend service)

**Priority:** docker-compose.yml > root .env > backend/.env

## ✅ Verification

After creating `.env`, verify:

```bash
# Check if .env exists
ls -la backend/.env

# Test backend with .env
cd backend
node -e "require('dotenv').config(); console.log('DB_HOST:', process.env.DB_HOST);"
```

## 🔄 Update Existing .env

If `.env` already exists, update values as needed:

```bash
# Edit .env
nano backend/.env

# Or use your preferred editor
vim backend/.env
```

---

**Note:** `.env` files are git-ignored for security. Never commit `.env` files to version control!

