const express = require('express');
const router = express.Router();
const { addStudent, getStudents, getStudentById, updateStudent, deleteStudent } = require('../controllers/studentController');

// Middleware for logging requests to student routes
router.use((req, res, next) => {
  console.log(`Student API: ${req.method} ${req.originalUrl} - ${new Date().toISOString()}`);
  next();
});

// Health check endpoint for student routes (must be before parameterized routes)
router.get('/health/check', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Student API routes are healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 1. POST /api/student → add new student
router.post('/', async (req, res) => {
  try {
    await addStudent(req, res);
  } catch (error) {
    console.error('Error in POST /api/student:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// 2. GET /api/student → fetch student list with optional search and pagination
router.get('/', async (req, res) => {
  try {
    await getStudents(req, res);
  } catch (error) {
    console.error('Error in GET /api/student:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// 3. GET /api/student/:id → fetch single student by ID (must be after specific routes)
router.get('/:id', async (req, res) => {
  try {
    await getStudentById(req, res);
  } catch (error) {
    console.error('Error in GET /api/student/:id:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// 4. PUT /api/student/:id → update student by ID
router.put('/:id', async (req, res) => {
  try {
    await updateStudent(req, res);
  } catch (error) {
    console.error('Error in PUT /api/student/:id:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// 5. DELETE /api/student/:id → delete student by ID
router.delete('/:id', async (req, res) => {
  try {
    await deleteStudent(req, res);
  } catch (error) {
    console.error('Error in DELETE /api/student/:id:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router; 