// Step 4: Express Server for Student Registration System with PostgreSQL
const express = require('express');
const cors = require('cors');
const { 
    validateStudentData, 
    generateId, 
    formatDate,
    APP_CONSTANTS
} = require('./utils');
const database = require('./database');

// Create Express application
const app = express();
const PORT = process.env.PORT || APP_CONSTANTS.DEFAULT_PORT;
const HOST = process.env.HOST || APP_CONSTANTS.DEFAULT_HOST;

// Test database connection on startup
database.testConnection();

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
app.get('/api/health', async (req, res) => {
    try {
        const dbConnected = await database.testConnection();
        res.json({
            success: true,
            message: 'Server is healthy',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            memory: process.memoryUsage(),
            database: {
                connected: dbConnected,
                type: 'PostgreSQL'
            }
        });
    } catch (error) {
        res.status(APP_CONSTANTS.STATUS_CODES.SERVER_ERROR).json({
            success: false,
            message: 'Server health check failed',
            timestamp: new Date().toISOString(),
            database: {
                connected: false,
                error: error.message
            }
        });
    }
});

// 3. Get all students
app.get('/api/students', async (req, res) => {
    try {
        // Optional query parameters for filtering/pagination
        const { page = 1, limit = 10, search = '' } = req.query;
        
        // Get students from database
        const result = await database.getAllStudents(search, parseInt(page), parseInt(limit));
        
        // Convert snake_case to camelCase for frontend
        const formattedStudents = result.students.map(student => ({
            id: student.id,
            firstName: student.first_name,
            lastName: student.last_name,
            email: student.email,
            contact: student.contact,
            dob: student.dob,
            gender: student.gender,
            street: student.street,
            city: student.city,
            state: student.state,
            zip: student.zip,
            country: student.country,
            createdAt: student.created_at,
            updatedAt: student.updated_at
        }));
        
        res.json({
            success: true,
            message: 'Students retrieved successfully',
            data: formattedStudents,
            pagination: {
                current_page: parseInt(page),
                per_page: parseInt(limit),
                total_students: result.totalCount,
                total_pages: Math.ceil(result.totalCount / parseInt(limit))
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
app.get('/api/students/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const student = await database.getStudentById(id);
        
        if (!student) {
            return res.status(APP_CONSTANTS.STATUS_CODES.NOT_FOUND).json({
                success: false,
                message: 'Student not found',
                id: id
            });
        }
        
        // Convert snake_case to camelCase for frontend
        const formattedStudent = {
            id: student.id,
            firstName: student.first_name,
            lastName: student.last_name,
            email: student.email,
            contact: student.contact,
            dob: student.dob,
            gender: student.gender,
            street: student.street,
            city: student.city,
            state: student.state,
            zip: student.zip,
            country: student.country,
            createdAt: student.created_at,
            updatedAt: student.updated_at
        };
        
        res.json({
            success: true,
            message: 'Student retrieved successfully',
            data: formattedStudent
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
app.post('/api/students', async (req, res) => {
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
        const emailExists = await database.emailExists(studentData.email);
        if (emailExists) {
            return res.status(APP_CONSTANTS.STATUS_CODES.BAD_REQUEST).json({
                success: false,
                message: 'Student with this email already exists',
                email: studentData.email
            });
        }
        
        // Create new student with generated ID
        const newStudentData = {
            id: generateId(),
            ...studentData
        };
        
        // Save to database
        const savedStudent = await database.createStudent(newStudentData);
        
        // Convert snake_case to camelCase for frontend
        const formattedStudent = {
            id: savedStudent.id,
            firstName: savedStudent.first_name,
            lastName: savedStudent.last_name,
            email: savedStudent.email,
            contact: savedStudent.contact,
            dob: savedStudent.dob,
            gender: savedStudent.gender,
            street: savedStudent.street,
            city: savedStudent.city,
            state: savedStudent.state,
            zip: savedStudent.zip,
            country: savedStudent.country,
            createdAt: savedStudent.created_at,
            updatedAt: savedStudent.updated_at
        };
        
        console.log(`New student created: ${formattedStudent.firstName} ${formattedStudent.lastName} (${formattedStudent.email})`);
        
        res.status(APP_CONSTANTS.STATUS_CODES.CREATED).json({
            success: true,
            message: 'Student registered successfully',
            data: formattedStudent
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
app.put('/api/students/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        
        // Check if student exists
        const existingStudent = await database.getStudentById(id);
        if (!existingStudent) {
            return res.status(APP_CONSTANTS.STATUS_CODES.NOT_FOUND).json({
                success: false,
                message: 'Student not found',
                id: id
            });
        }
        
        // Validate updated data
        const validation = validateStudentData(updateData);
        if (!validation.isValid) {
            return res.status(APP_CONSTANTS.STATUS_CODES.BAD_REQUEST).json({
                success: false,
                message: 'Validation failed',
                errors: validation.errors
            });
        }
        
        // Check if email already exists (excluding current student)
        if (updateData.email && updateData.email !== existingStudent.email) {
            const emailExists = await database.emailExists(updateData.email, id);
            if (emailExists) {
                return res.status(APP_CONSTANTS.STATUS_CODES.BAD_REQUEST).json({
                    success: false,
                    message: 'Student with this email already exists',
                    email: updateData.email
                });
            }
        }
        
        // Update student in database
        const updatedStudent = await database.updateStudent(id, updateData);
        
        // Convert snake_case to camelCase for frontend
        const formattedStudent = {
            id: updatedStudent.id,
            firstName: updatedStudent.first_name,
            lastName: updatedStudent.last_name,
            email: updatedStudent.email,
            contact: updatedStudent.contact,
            dob: updatedStudent.dob,
            gender: updatedStudent.gender,
            street: updatedStudent.street,
            city: updatedStudent.city,
            state: updatedStudent.state,
            zip: updatedStudent.zip,
            country: updatedStudent.country,
            createdAt: updatedStudent.created_at,
            updatedAt: updatedStudent.updated_at
        };
        
        res.json({
            success: true,
            message: 'Student updated successfully',
            data: formattedStudent
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
app.delete('/api/students/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        // Check if student exists and delete
        const deletedStudent = await database.deleteStudent(id);
        
        if (!deletedStudent) {
            return res.status(APP_CONSTANTS.STATUS_CODES.NOT_FOUND).json({
                success: false,
                message: 'Student not found',
                id: id
            });
        }
        
        // Convert snake_case to camelCase for frontend
        const formattedStudent = {
            id: deletedStudent.id,
            firstName: deletedStudent.first_name,
            lastName: deletedStudent.last_name,
            email: deletedStudent.email,
            contact: deletedStudent.contact,
            dob: deletedStudent.dob,
            gender: deletedStudent.gender,
            street: deletedStudent.street,
            city: deletedStudent.city,
            state: deletedStudent.state,
            zip: deletedStudent.zip,
            country: deletedStudent.country,
            createdAt: deletedStudent.created_at,
            updatedAt: deletedStudent.updated_at
        };
        
        res.json({
            success: true,
            message: 'Student deleted successfully',
            data: formattedStudent
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
    console.log('📊 PostgreSQL database connected and ready');
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down Express server gracefully...');
    process.exit(0);
});

// Export app for testing purposes
module.exports = app; 