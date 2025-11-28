const express = require('express');
const router = express.Router();
// Use bcryptjs instead of bcrypt for better Docker compatibility
const bcrypt = require('bcryptjs');
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
    console.log('Password length:', password?.length || 0);
    
    // Validate hash format
    if (!user.password_hash || user.password_hash.length < 50) {
      console.error('Invalid password hash format');
      return res.status(500).json({
        success: false,
        error: 'Invalid password hash in database'
      });
    }
    
    // Verify password
    console.log('Starting bcrypt.compare...');
    const startTime = Date.now();
    
    let validPassword = false;
    try {
      // Wrap bcrypt.compare in Promise to ensure it doesn't block
      console.log('Calling bcrypt.compare()...');
      console.log('Hash preview:', user.password_hash.substring(0, 20) + '...');
      
      // Use Promise.resolve to ensure proper async handling
      validPassword = await Promise.resolve(
        bcrypt.compare(password, user.password_hash)
      );
      
      const duration = Date.now() - startTime;
      console.log(`✅ Password verification completed in ${duration}ms`);
      console.log('Password valid:', validPassword);
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`❌ Password verification error after ${duration}ms:`, error.message);
      console.error('Error stack:', error.stack);
      
      // Ensure CORS headers on error
      const origin = req.headers.origin;
      if (origin) {
        res.header('Access-Control-Allow-Origin', origin);
        res.header('Access-Control-Allow-Credentials', 'true');
      }
      
      return res.status(500).json({
        success: false,
        error: 'Password verification failed'
      });
    }
    
    if (!validPassword) {
      console.log('❌ Invalid password for user:', user.email);
      
      // Ensure CORS headers
      const origin = req.headers.origin;
      if (origin) {
        res.header('Access-Control-Allow-Origin', origin);
        res.header('Access-Control-Allow-Credentials', 'true');
      }
      
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }
    
    console.log('✅ Password verified successfully, continuing login...');

    try {
      // Update last login
      console.log('Updating last login...');
      await pool.query(
        'UPDATE admin_users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
        [user.id]
      );
      console.log('Last login updated');

      // Generate JWT token
      console.log('Generating JWT token...');
      const token = jwt.sign(
        { 
          id: user.id, 
          email: user.email,
          role: user.role 
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
      );
      console.log('JWT token generated');

      // Ensure CORS headers before sending response
      const origin = req.headers.origin;
      if (origin) {
        res.header('Access-Control-Allow-Origin', origin);
        res.header('Access-Control-Allow-Credentials', 'true');
      }

      console.log('Sending success response...');
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
      console.log('✅ Login successful, response sent');
    } catch (dbError) {
      console.error('Database/JWT error:', dbError);
      console.error('Error stack:', dbError.stack);
      
      // Ensure CORS headers on error
      const origin = req.headers.origin;
      if (origin) {
        res.header('Access-Control-Allow-Origin', origin);
        res.header('Access-Control-Allow-Credentials', 'true');
      }
      
      return res.status(500).json({
        success: false,
        error: 'Failed to complete login'
      });
    }
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

