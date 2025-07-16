const pool = require('../config/connection');
const { generateId, validateStudentData } = require('../utils');

/**
 * Add a new student to the database
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const addStudent = async (req, res) => {
  try {
    // Extract fields from req.body
    const {
      firstName,
      lastName,
      email,
      contact,
      dob,
      gender,
      street,
      city,
      state,
      zip,
      country
    } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !contact || !dob) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: firstName, lastName, email, contact, dob are required'
      });
    }

    // Validate student data
    const validation = validateStudentData(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors
      });
    }

    // Check if student already exists by email
    const existingStudent = await pool.query(
      'SELECT id FROM students WHERE email = $1',
      [email]
    );

    if (existingStudent.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Student with this email already exists'
      });
    }

    // Generate unique ID for the student
    const studentId = generateId();

    // Insert into database
    const insertQuery = `
      INSERT INTO students (
        id, first_name, last_name, email, contact, dob, gender, 
        street, city, state, zip, country, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), NOW())
      RETURNING *
    `;

    const values = [
      studentId,
      firstName,
      lastName,
      email,
      contact,
      dob,
      gender || null,
      street || null,
      city || null,
      state || null,
      zip || null,
      country || null
    ];

    const result = await pool.query(insertQuery, values);
    const newStudent = result.rows[0];

    // Return success response
    res.status(201).json({
      success: true,
      message: 'Student registered successfully',
      data: {
        id: newStudent.id,
        firstName: newStudent.first_name,
        lastName: newStudent.last_name,
        email: newStudent.email,
        contact: newStudent.contact,
        dob: newStudent.dob,
        gender: newStudent.gender,
        address: {
          street: newStudent.street,
          city: newStudent.city,
          state: newStudent.state,
          zip: newStudent.zip,
          country: newStudent.country
        },
        createdAt: newStudent.created_at
      }
    });

  } catch (error) {
    console.error('Error adding student:', error);
    
    // Handle specific database errors
    if (error.code === '23505') { // PostgreSQL unique violation
      return res.status(409).json({
        success: false,
        message: 'Student with this email already exists'
      });
    }

    // Return error response
    res.status(500).json({
      success: false,
      message: 'Internal server error while adding student',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get all students from the database with optional search and pagination
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getStudents = async (req, res) => {
  try {
    // Extract query parameters
    const {
      search = '',
      page = 1,
      limit = 10,
      sortBy = 'created_at',
      sortOrder = 'DESC'
    } = req.query;

    // Validate pagination parameters
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit))); // Max 100 records per request
    const offset = (pageNum - 1) * limitNum;

    // Validate sort parameters
    const allowedSortFields = ['first_name', 'last_name', 'email', 'created_at', 'dob'];
    const validSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'created_at';
    const validSortOrder = ['ASC', 'DESC'].includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'DESC';

    // Build the query
    let baseQuery = `
      SELECT 
        id, first_name, last_name, email, contact, dob, gender,
        street, city, state, zip, country, created_at, updated_at
      FROM students
    `;
    
    let countQuery = 'SELECT COUNT(*) FROM students';
    let queryParams = [];
    let whereClause = '';

    // Add search functionality
    if (search.trim()) {
      whereClause = ` WHERE 
        LOWER(first_name) LIKE LOWER($1) OR 
        LOWER(last_name) LIKE LOWER($1) OR 
        LOWER(email) LIKE LOWER($1) OR
        LOWER(city) LIKE LOWER($1) OR
        LOWER(state) LIKE LOWER($1) OR
        LOWER(country) LIKE LOWER($1)
      `;
      queryParams.push(`%${search.trim()}%`);
    }

    // Add sorting and pagination
    const orderByClause = ` ORDER BY ${validSortBy} ${validSortOrder}`;
    const paginationClause = ` LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
    queryParams.push(limitNum, offset);

    const finalQuery = baseQuery + whereClause + orderByClause + paginationClause;
    const finalCountQuery = countQuery + whereClause;
    const countParams = search.trim() ? [`%${search.trim()}%`] : [];

    // Execute queries in parallel
    const [studentsResult, countResult] = await Promise.all([
      pool.query(finalQuery, queryParams),
      pool.query(finalCountQuery, countParams)
    ]);

    const students = studentsResult.rows.map(student => ({
      id: student.id,
      firstName: student.first_name,
      lastName: student.last_name,
      email: student.email,
      contact: student.contact,
      dob: student.dob,
      gender: student.gender,
      address: {
        street: student.street,
        city: student.city,
        state: student.state,
        zip: student.zip,
        country: student.country
      },
      createdAt: student.created_at,
      updatedAt: student.updated_at
    }));

    const totalCount = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalCount / limitNum);

    // Return result
    res.status(200).json({
      success: true,
      message: 'Students retrieved successfully',
      data: {
        students,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalCount,
          limit: limitNum,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1
        },
        search: search.trim() || null,
        sort: {
          field: validSortBy,
          order: validSortOrder
        }
      }
    });

  } catch (error) {
    console.error('Error fetching students:', error);
    
    // Return error response
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching students',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get a single student by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Student ID is required'
      });
    }

    const result = await pool.query(
      'SELECT * FROM students WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    const student = result.rows[0];
    
    res.status(200).json({
      success: true,
      message: 'Student retrieved successfully',
      data: {
        id: student.id,
        firstName: student.first_name,
        lastName: student.last_name,
        email: student.email,
        contact: student.contact,
        dob: student.dob,
        gender: student.gender,
        address: {
          street: student.street,
          city: student.city,
          state: student.state,
          zip: student.zip,
          country: student.country
        },
        createdAt: student.created_at,
        updatedAt: student.updated_at
      }
    });

  } catch (error) {
    console.error('Error fetching student by ID:', error);
    
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching student',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  addStudent,
  getStudents,
  getStudentById
}; 