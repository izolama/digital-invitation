# API Documentation - Digital Invitation Backend

Complete API documentation for integrating with PostgreSQL backend.

## 📋 Table of Contents

1. [Database Schema](#database-schema)
2. [API Endpoints](#api-endpoints)
3. [Authentication](#authentication)
4. [Error Handling](#error-handling)
5. [Example Implementation](#example-implementation)

---

## 🗄️ Database Schema

### PostgreSQL Database Setup

```sql
-- Create Database
CREATE DATABASE digital_invitation;

-- Create Admin Users Table
CREATE TABLE admin_users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Registrations Table
CREATE TABLE registrations (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    whatsapp_number VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    food_restriction VARCHAR(50) NOT NULL,
    allergies VARCHAR(10) NOT NULL,
    confirmation_attendance VARCHAR(10) NOT NULL,
    number_of_people INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address INET,
    user_agent TEXT
);

-- Create Indexes for better performance
CREATE INDEX idx_registrations_email ON registrations(email);
CREATE INDEX idx_registrations_created_at ON registrations(created_at DESC);
CREATE INDEX idx_registrations_attendance ON registrations(confirmation_attendance);

-- Insert default admin user (password: admin123)
-- Note: Use bcrypt hash in production
INSERT INTO admin_users (name, email, password_hash) 
VALUES ('Admin', 'admin@krakatau.com', '$2b$10$rCx0HwkQF9X3OBmZxmWNy.Mh9UqzGQpZDXX.jL9kXJ4NHJ4K3.hGa');
```

---

## 🔌 API Endpoints

### Base URL
```
Production: https://your-domain.com/api
Development: http://localhost:5000/api
```

---

### 1. Public Endpoints

#### **POST /api/registrations**
Submit new registration from the form.

**Request Body:**
```json
{
  "fullName": "John Doe",
  "companyName": "PT ABC Industries",
  "whatsappNumber": "08123456789",
  "email": "john@abc.com",
  "foodRestriction": "NON VEGAN",
  "allergies": "NO",
  "confirmationAttendance": "YES",
  "numberOfPeople": 2
}
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Registration submitted successfully",
  "data": {
    "id": 1,
    "fullName": "John Doe",
    "createdAt": "2025-11-26T10:30:00Z"
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "error": "Validation error",
  "details": {
    "email": "Invalid email format"
  }
}
```

---

### 2. Admin Authentication Endpoints

#### **POST /api/admin/login**
Admin login to access dashboard.

**Request Body:**
```json
{
  "email": "admin@krakatau.com",
  "password": "admin123"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Admin",
    "email": "admin@krakatau.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "error": "Invalid credentials"
}
```

---

#### **POST /api/admin/logout**
Logout admin (optional - mainly client-side).

**Headers:**
```
Authorization: Bearer {token}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### 3. Admin Protected Endpoints

#### **GET /api/admin/registrations**
Get all registrations (requires authentication).

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 50)
- `status` (optional): Filter by confirmation_attendance (YES, NO, MAYBE)
- `search` (optional): Search by name, company, or email

**Example Request:**
```
GET /api/admin/registrations?page=1&limit=50&status=YES&search=john
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "fullName": "John Doe",
      "companyName": "PT ABC Industries",
      "whatsappNumber": "08123456789",
      "email": "john@abc.com",
      "foodRestriction": "NON VEGAN",
      "allergies": "NO",
      "confirmationAttendance": "YES",
      "numberOfPeople": 2,
      "createdAt": "2025-11-26T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 150,
    "totalPages": 3
  },
  "stats": {
    "total": 150,
    "confirmed": 100,
    "declined": 30,
    "maybe": 20,
    "totalGuests": 280
  }
}
```

---

#### **GET /api/admin/registrations/:id**
Get single registration by ID.

**Headers:**
```
Authorization: Bearer {token}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "fullName": "John Doe",
    "companyName": "PT ABC Industries",
    "whatsappNumber": "08123456789",
    "email": "john@abc.com",
    "foodRestriction": "NON VEGAN",
    "allergies": "NO",
    "confirmationAttendance": "YES",
    "numberOfPeople": 2,
    "createdAt": "2025-11-26T10:30:00Z",
    "ipAddress": "192.168.1.1",
    "userAgent": "Mozilla/5.0..."
  }
}
```

---

#### **DELETE /api/admin/registrations/:id**
Delete a registration (requires authentication).

**Headers:**
```
Authorization: Bearer {token}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Registration deleted successfully"
}
```

---

#### **GET /api/admin/stats**
Get dashboard statistics.

**Headers:**
```
Authorization: Bearer {token}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "totalRegistrations": 150,
    "confirmed": 100,
    "declined": 30,
    "maybe": 20,
    "totalGuests": 280,
    "todayRegistrations": 15,
    "foodRestrictions": {
      "VEGAN": 30,
      "NON VEGAN": 100,
      "VEGETARIAN": 15,
      "NO RESTRICTION": 5
    },
    "allergies": {
      "YES": 20,
      "NO": 130
    }
  }
}
```

---

## 🔐 Authentication

### JWT Token
- Token expires in 24 hours
- Include token in Authorization header: `Bearer {token}`
- Store token securely (localStorage for web)

### Token Validation
```javascript
// Example middleware
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      error: 'Access token required' 
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ 
        success: false, 
        error: 'Invalid or expired token' 
      });
    }
    req.user = user;
    next();
  });
};
```

---

## ⚠️ Error Handling

### Error Response Format
```json
{
  "success": false,
  "error": "Error message",
  "details": {} // Optional additional details
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (invalid token)
- `404` - Not Found
- `500` - Internal Server Error

---

## 💻 Example Implementation

### Node.js + Express + PostgreSQL

**Install Dependencies:**
```bash
npm install express pg bcrypt jsonwebtoken cors dotenv
```

**Example Server (server.js):**
```javascript
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// PostgreSQL connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

// Middleware
app.use(cors());
app.use(express.json());

// Public: Submit registration
app.post('/api/registrations', async (req, res) => {
  try {
    const {
      fullName,
      companyName,
      whatsappNumber,
      email,
      foodRestriction,
      allergies,
      confirmationAttendance,
      numberOfPeople
    } = req.body;

    // Validation
    if (!fullName || !email) {
      return res.status(400).json({
        success: false,
        error: 'Full name and email are required'
      });
    }

    // Insert into database
    const result = await pool.query(
      `INSERT INTO registrations 
       (full_name, company_name, whatsapp_number, email, 
        food_restriction, allergies, confirmation_attendance, number_of_people,
        ip_address, user_agent) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
       RETURNING id, full_name, created_at`,
      [
        fullName,
        companyName,
        whatsappNumber,
        email,
        foodRestriction,
        allergies,
        confirmationAttendance,
        numberOfPeople,
        req.ip,
        req.get('user-agent')
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Registration submitted successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit registration'
    });
  }
});

// Admin: Login
app.post('/api/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      'SELECT * FROM admin_users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to login'
    });
  }
});

// Admin: Get all registrations (protected)
app.get('/api/admin/registrations', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 50, status, search } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM registrations WHERE 1=1';
    const params = [];
    let paramCount = 0;

    if (status) {
      paramCount++;
      query += ` AND confirmation_attendance = $${paramCount}`;
      params.push(status);
    }

    if (search) {
      paramCount++;
      query += ` AND (full_name ILIKE $${paramCount} OR company_name ILIKE $${paramCount} OR email ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    // Get total count
    const countResult = await pool.query(
      'SELECT COUNT(*) FROM registrations'
    );
    const total = parseInt(countResult.rows[0].count);

    // Get stats
    const statsResult = await pool.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN confirmation_attendance = 'YES' THEN 1 ELSE 0 END) as confirmed,
        SUM(CASE WHEN confirmation_attendance = 'NO' THEN 1 ELSE 0 END) as declined,
        SUM(CASE WHEN confirmation_attendance = 'MAYBE' THEN 1 ELSE 0 END) as maybe,
        SUM(number_of_people) as total_guests
      FROM registrations
    `);

    res.json({
      success: true,
      data: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      },
      stats: statsResult.rows[0]
    });
  } catch (error) {
    console.error('Fetch registrations error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch registrations'
    });
  }
});

// Middleware to authenticate token
function authenticateToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Access token required'
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        error: 'Invalid or expired token'
      });
    }
    req.user = user;
    next();
  });
}

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
```

**Environment Variables (.env):**
```env
PORT=5000
DB_USER=postgres
DB_HOST=localhost
DB_NAME=digital_invitation
DB_PASSWORD=your_password
DB_PORT=5432
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

---

## 🚀 Deployment Notes

### Production Checklist
- [ ] Use environment variables for sensitive data
- [ ] Enable HTTPS (SSL certificate)
- [ ] Use bcrypt for password hashing (already shown)
- [ ] Implement rate limiting
- [ ] Add input validation & sanitization
- [ ] Set up database backups
- [ ] Monitor API performance
- [ ] Add logging (Winston, Morgan)
- [ ] Implement CORS properly
- [ ] Use connection pooling for PostgreSQL

### Docker Deployment
See main DEPLOYMENT.md for Docker configuration.

---

**Made with ❤️ for Krakatau Baja Industri Customer Gathering 2025**

