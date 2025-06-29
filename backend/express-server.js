// Step 4: Express Server for Student Registration System
const express = require('express');
const cors = require('cors');
const { 
    validateStudentData, 
    generateId, 
    formatDate,
    APP_CONSTANTS,
    SAMPLE_STUDENTS 
} = require('./utils');

// Create Express application
const app = express();
const PORT = process.env.PORT || APP_CONSTANTS.DEFAULT_PORT;
const HOST = process.env.HOST || APP_CONSTANTS.DEFAULT_HOST;

// In-memory storage for students (in production, this would be a database)
let students = [...SAMPLE_STUDENTS];

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json({ limit: '10mb' })); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Request logging middleware
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.path}`);
    next();
});

// Routes

// 1. Home route - API information
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Student Registration API',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        endpoints: {
            'GET /': 'API information',
            'GET /api/health': 'Health check',
            'GET /api/students': 'Get all students',
            'GET /api/students/:id': 'Get student by ID',
            'POST /api/students': 'Create new student',
            'PUT /api/students/:id': 'Update student',
            'DELETE /api/students/:id': 'Delete student'
        }
    });
});

// 2. Health check route
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server is healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        students_count: students.length
    });
});

// 3. Get all students
app.get('/api/students', (req, res) => {
    try {
        // Optional query parameters for filtering/pagination
        const { page = 1, limit = 10, search } = req.query;
        
        let filteredStudents = [...students];
        
        // Search functionality
        if (search) {
            const searchTerm = search.toLowerCase();
            filteredStudents = students.filter(student => 
                student.firstName.toLowerCase().includes(searchTerm) ||
                student.lastName.toLowerCase().includes(searchTerm) ||
                student.email.toLowerCase().includes(searchTerm)
            );
        }
        
        // Pagination
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + parseInt(limit);
        const paginatedStudents = filteredStudents.slice(startIndex, endIndex);
        
        res.json({
            success: true,
            message: 'Students retrieved successfully',
            data: paginatedStudents,
            pagination: {
                current_page: parseInt(page),
                per_page: parseInt(limit),
                total_students: filteredStudents.length,
                total_pages: Math.ceil(filteredStudents.length / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(APP_CONSTANTS.STATUS_CODES.SERVER_ERROR).json({
            success: false,
            message: 'Failed to retrieve students',
            error: error.message
        });
    }
});

// 4. Get student by ID
app.get('/api/students/:id', (req, res) => {
    try {
        const { id } = req.params;
        const student = students.find(s => s.id === id);
        
        if (!student) {
            return res.status(APP_CONSTANTS.STATUS_CODES.NOT_FOUND).json({
                success: false,
                message: 'Student not found',
                id: id
            });
        }
        
        res.json({
            success: true,
            message: 'Student retrieved successfully',
            data: student
        });
    } catch (error) {
        console.error('Error fetching student:', error);
        res.status(APP_CONSTANTS.STATUS_CODES.SERVER_ERROR).json({
            success: false,
            message: 'Failed to retrieve student',
            error: error.message
        });
    }
});

// 5. Create new student (This is what our Angular app will use)
app.post('/api/students', (req, res) => {
    try {
        const studentData = req.body;
        
        // Validate the student data
        const validation = validateStudentData(studentData);
        if (!validation.isValid) {
            return res.status(APP_CONSTANTS.STATUS_CODES.BAD_REQUEST).json({
                success: false,
                message: 'Validation failed',
                errors: validation.errors
            });
        }
        
        // Check if email already exists
        const existingStudent = students.find(s => s.email === studentData.email);
        if (existingStudent) {
            return res.status(APP_CONSTANTS.STATUS_CODES.BAD_REQUEST).json({
                success: false,
                message: 'Student with this email already exists',
                email: studentData.email
            });
        }
        
        // Create new student
        const newStudent = {
            id: generateId(),
            ...studentData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        // Add to students array
        students.push(newStudent);
        
        console.log(`New student created: ${newStudent.firstName} ${newStudent.lastName} (${newStudent.email})`);
        
        res.status(APP_CONSTANTS.STATUS_CODES.CREATED).json({
            success: true,
            message: 'Student registered successfully',
            data: newStudent
        });
        
    } catch (error) {
        console.error('Error creating student:', error);
        res.status(APP_CONSTANTS.STATUS_CODES.SERVER_ERROR).json({
            success: false,
            message: 'Failed to register student',
            error: error.message
        });
    }
});

// 6. Update student
app.put('/api/students/:id', (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        
        const studentIndex = students.findIndex(s => s.id === id);
        if (studentIndex === -1) {
            return res.status(APP_CONSTANTS.STATUS_CODES.NOT_FOUND).json({
                success: false,
                message: 'Student not found',
                id: id
            });
        }
        
        // Validate updated data
        const validation = validateStudentData({ ...students[studentIndex], ...updateData });
        if (!validation.isValid) {
            return res.status(APP_CONSTANTS.STATUS_CODES.BAD_REQUEST).json({
                success: false,
                message: 'Validation failed',
                errors: validation.errors
            });
        }
        
        // Update student
        students[studentIndex] = {
            ...students[studentIndex],
            ...updateData,
            updatedAt: new Date().toISOString()
        };
        
        res.json({
            success: true,
            message: 'Student updated successfully',
            data: students[studentIndex]
        });
        
    } catch (error) {
        console.error('Error updating student:', error);
        res.status(APP_CONSTANTS.STATUS_CODES.SERVER_ERROR).json({
            success: false,
            message: 'Failed to update student',
            error: error.message
        });
    }
});

// 7. Delete student
app.delete('/api/students/:id', (req, res) => {
    try {
        const { id } = req.params;
        const studentIndex = students.findIndex(s => s.id === id);
        
        if (studentIndex === -1) {
            return res.status(APP_CONSTANTS.STATUS_CODES.NOT_FOUND).json({
                success: false,
                message: 'Student not found',
                id: id
            });
        }
        
        const deletedStudent = students.splice(studentIndex, 1)[0];
        
        res.json({
            success: true,
            message: 'Student deleted successfully',
            data: deletedStudent
        });
        
    } catch (error) {
        console.error('Error deleting student:', error);
        res.status(APP_CONSTANTS.STATUS_CODES.SERVER_ERROR).json({
            success: false,
            message: 'Failed to delete student',
            error: error.message
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(APP_CONSTANTS.STATUS_CODES.SERVER_ERROR).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

// 404 handler - must be last route
app.use((req, res) => {
    res.status(APP_CONSTANTS.STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: 'Route not found',
        path: req.originalUrl,
        method: req.method
    });
});

// Start server
app.listen(PORT, HOST, () => {
    console.log('🚀 Express Server Started Successfully!');
    console.log(`📍 Server running at http://${HOST}:${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log('📋 Available endpoints:');
    console.log(`   GET    http://${HOST}:${PORT}/`);
    console.log(`   GET    http://${HOST}:${PORT}/api/health`);
    console.log(`   GET    http://${HOST}:${PORT}/api/students`);
    console.log(`   GET    http://${HOST}:${PORT}/api/students/:id`);
    console.log(`   POST   http://${HOST}:${PORT}/api/students`);
    console.log(`   PUT    http://${HOST}:${PORT}/api/students/:id`);
    console.log(`   DELETE http://${HOST}:${PORT}/api/students/:id`);
    console.log('\n💡 Press Ctrl+C to stop the server');
    console.log(`📊 Initial students loaded: ${students.length}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down Express server gracefully...');
    process.exit(0);
});

// Export app for testing purposes
module.exports = app; 