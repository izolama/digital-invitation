const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');

/**
 * POST /api/admin/login
 * Admin login endpoint
 */
router.post('/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('Login attempt:', { email, hasPassword: !!password });

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    // Get user from database
    const result = await pool.query(
      'SELECT * FROM admin_users WHERE email = $1 AND is_active = true',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    const user = result.rows[0];

    // Verify password
    console.log('Verifying password for user:', user.email);
    console.log('Password hash from DB:', user.password_hash ? 'exists' : 'missing');
    console.log('Hash length:', user.password_hash?.length || 0);
    console.log('Hash starts with:', user.password_hash?.substring(0, 7) || 'N/A');
    
    // Validate hash format
    if (!user.password_hash || user.password_hash.length < 50) {
      console.error('Invalid password hash format');
      return res.status(500).json({
        success: false,
        error: 'Invalid password hash in database'
      });
    }
    
    // Add timeout for bcrypt.compare (max 5 seconds)
    let validPassword = false;
    try {
      const comparePromise = bcrypt.compare(password, user.password_hash);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Password verification timeout')), 5000)
      );
      
      validPassword = await Promise.race([comparePromise, timeoutPromise]);
      console.log('Password valid:', validPassword);
      
      if (!validPassword) {
        console.log('Invalid password for user:', user.email);
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials'
        });
      }
    } catch (bcryptError) {
      console.error('Bcrypt error:', bcryptError.message);
      console.error('Bcrypt error stack:', bcryptError.stack);
      
      // Ensure CORS headers on error
      const origin = req.headers.origin;
      if (origin) {
        res.header('Access-Control-Allow-Origin', origin);
        res.header('Access-Control-Allow-Credentials', 'true');
      }
      
      return res.status(500).json({
        success: false,
        error: bcryptError.message === 'Password verification timeout' 
          ? 'Password verification timed out' 
          : 'Password verification failed'
      });
    }

    // Password already verified above, continue with login

    // Update last login
    await pool.query(
      'UPDATE admin_users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
      [user.id]
    );

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email,
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    res.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    console.error('Error stack:', error.stack);
    
    // Ensure CORS headers on error
    const origin = req.headers.origin;
    if (origin) {
      res.header('Access-Control-Allow-Origin', origin);
      res.header('Access-Control-Allow-Credentials', 'true');
    }
    
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * POST /api/admin/logout
 * Admin logout endpoint (optional - mainly client-side)
 */
router.post('/admin/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

module.exports = router;

