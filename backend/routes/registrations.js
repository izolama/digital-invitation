const express = require('express');
const router = express.Router();
const pool = require('../config/database');

/**
 * POST /api/registrations
 * Submit new registration (public endpoint)
 */
router.post('/', async (req, res) => {
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
    if (!fullName || !email || !companyName) {
      return res.status(400).json({
        success: false,
        error: 'Full name, email, and company name are required',
        details: {
          fullName: !fullName ? 'Full name is required' : null,
          email: !email ? 'Email is required' : null,
          companyName: !companyName ? 'Company name is required' : null
        }
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
    }

    // Check for duplicate email
    const existingReg = await pool.query(
      'SELECT id FROM registrations WHERE email = $1',
      [email]
    );

    if (existingReg.rows.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Email already registered'
      });
    }

    // Insert registration
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
        whatsappNumber || '',
        email,
        foodRestriction || '',
        allergies || '',
        confirmationAttendance || '',
        numberOfPeople || 1,
        req.ip,
        req.get('user-agent')
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Registration submitted successfully',
      data: {
        id: result.rows[0].id,
        fullName: result.rows[0].full_name,
        createdAt: result.rows[0].created_at
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit registration'
    });
  }
});

/**
 * GET /api/registrations/:id
 * Get registration detail by ID (public endpoint)
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM registrations WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Registration not found'
      });
    }

    const reg = result.rows[0];
    
    res.json({
      success: true,
      data: {
        id: reg.id,
        fullName: reg.full_name,
        companyName: reg.company_name,
        whatsappNumber: reg.whatsapp_number,
        email: reg.email,
        foodRestriction: reg.food_restriction,
        allergies: reg.allergies,
        confirmationAttendance: reg.confirmation_attendance,
        numberOfPeople: reg.number_of_people,
        createdAt: reg.created_at
      }
    });
  } catch (error) {
    console.error('Fetch registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch registration'
    });
  }
});

module.exports = router;

