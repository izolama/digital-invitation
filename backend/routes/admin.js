const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

/**
 * GET /api/admin/registrations
 * Get all registrations with pagination, search, and filter
 * Protected route - requires authentication
 */
router.get('/registrations', authenticateToken, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 50, 
      status, 
      search 
    } = req.query;

    const offset = (page - 1) * limit;
    let query = 'SELECT * FROM registrations WHERE 1=1';
    const params = [];
    let paramCount = 0;

    // Filter by status
    if (status && status !== 'all') {
      paramCount++;
      query += ` AND confirmation_attendance = $${paramCount}`;
      params.push(status);
    }

    // Search functionality
    if (search) {
      paramCount++;
      query += ` AND (
        full_name ILIKE $${paramCount} OR 
        company_name ILIKE $${paramCount} OR 
        email ILIKE $${paramCount}
      )`;
      params.push(`%${search}%`);
    }

    // Add ordering and pagination
    query += ` ORDER BY created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(limit, offset);

    // Execute query
    const result = await pool.query(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) FROM registrations WHERE 1=1';
    const countParams = [];
    let countParamIndex = 0;

    if (status && status !== 'all') {
      countParamIndex++;
      countQuery += ` AND confirmation_attendance = $${countParamIndex}`;
      countParams.push(status);
    }

    if (search) {
      countParamIndex++;
      countQuery += ` AND (
        full_name ILIKE $${countParamIndex} OR 
        company_name ILIKE $${countParamIndex} OR 
        email ILIKE $${countParamIndex}
      )`;
      countParams.push(`%${search}%`);
    }

    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);

    // Get statistics
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
      stats: {
        total: parseInt(statsResult.rows[0].total),
        confirmed: parseInt(statsResult.rows[0].confirmed),
        declined: parseInt(statsResult.rows[0].declined),
        maybe: parseInt(statsResult.rows[0].maybe),
        totalGuests: parseInt(statsResult.rows[0].total_guests)
      }
    });
  } catch (error) {
    console.error('Fetch registrations error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch registrations'
    });
  }
});

/**
 * GET /api/admin/registrations/:id
 * Get single registration by ID
 * Protected route
 */
router.get('/registrations/:id', authenticateToken, async (req, res) => {
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

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Fetch registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch registration'
    });
  }
});

/**
 * DELETE /api/admin/registrations/:id
 * Delete registration
 * Protected route
 */
router.delete('/registrations/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM registrations WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Registration not found'
      });
    }

    res.json({
      success: true,
      message: 'Registration deleted successfully'
    });
  } catch (error) {
    console.error('Delete registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete registration'
    });
  }
});

/**
 * GET /api/admin/stats
 * Get dashboard statistics
 * Protected route
 */
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    // Get overall stats
    const statsResult = await pool.query(`
      SELECT 
        COUNT(*) as total_registrations,
        SUM(CASE WHEN confirmation_attendance = 'YES' THEN 1 ELSE 0 END) as confirmed,
        SUM(CASE WHEN confirmation_attendance = 'NO' THEN 1 ELSE 0 END) as declined,
        SUM(CASE WHEN confirmation_attendance = 'MAYBE' THEN 1 ELSE 0 END) as maybe,
        SUM(number_of_people) as total_guests
      FROM registrations
    `);

    // Get today's registrations
    const todayResult = await pool.query(`
      SELECT COUNT(*) as today_registrations
      FROM registrations
      WHERE DATE(created_at) = CURRENT_DATE
    `);

    // Get food restrictions breakdown
    const foodResult = await pool.query(`
      SELECT 
        food_restriction,
        COUNT(*) as count
      FROM registrations
      WHERE food_restriction IS NOT NULL AND food_restriction != ''
      GROUP BY food_restriction
      ORDER BY count DESC
    `);

    // Get allergies breakdown
    const allergiesResult = await pool.query(`
      SELECT 
        allergies,
        COUNT(*) as count
      FROM registrations
      WHERE allergies IS NOT NULL AND allergies != ''
      GROUP BY allergies
    `);

    // Format data
    const foodRestrictions = {};
    foodResult.rows.forEach(row => {
      foodRestrictions[row.food_restriction] = parseInt(row.count);
    });

    const allergiesBreakdown = {};
    allergiesResult.rows.forEach(row => {
      allergiesBreakdown[row.allergies] = parseInt(row.count);
    });

    res.json({
      success: true,
      data: {
        totalRegistrations: parseInt(statsResult.rows[0].total_registrations),
        confirmed: parseInt(statsResult.rows[0].confirmed),
        declined: parseInt(statsResult.rows[0].declined),
        maybe: parseInt(statsResult.rows[0].maybe),
        totalGuests: parseInt(statsResult.rows[0].total_guests),
        todayRegistrations: parseInt(todayResult.rows[0].today_registrations),
        foodRestrictions,
        allergies: allergiesBreakdown
      }
    });
  } catch (error) {
    console.error('Fetch stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch statistics'
    });
  }
});

module.exports = router;

