const express = require('express');
const cors = require('cors');

// Import routes
const studentRoutes = require('./routes/student');

// Create Express application
const app = express();

// 1. Use middleware
app.use(cors({
  origin: ['http://localhost:4200', 'http://localhost:3000'], // Allow Angular dev server and any other frontend
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' })); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path} - Origin: ${req.get('Origin') || 'N/A'}`);
  next();
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Home route - API information
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Student Registration System API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      'GET /': 'API information',
      'GET /api/health': 'Health check',
      'GET /api/student': 'Get all students (supports search, pagination, sorting)',
      'GET /api/student/:id': 'Get student by ID',
      'POST /api/student': 'Create new student',
      'GET /api/student/health/check': 'Student routes health check'
    },
    documentation: {
      'POST /api/student': {
        description: 'Register a new student',
        requiredFields: ['firstName', 'lastName', 'email', 'contact', 'dob'],
        optionalFields: ['gender', 'street', 'city', 'state', 'zip', 'country'],
        example: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          contact: '+1-555-0123',
          dob: '2000-01-15',
          gender: 'Male',
          street: '123 Main St',
          city: 'Los Angeles',
          state: 'CA',
          zip: '90210',
          country: 'US'
        }
      },
      'GET /api/student': {
        description: 'Get all students with optional search and pagination',
        queryParameters: {
          search: 'Search term (optional)',
          page: 'Page number (default: 1)',
          limit: 'Records per page (default: 10, max: 100)',
          sortBy: 'Sort field (first_name, last_name, email, created_at, dob)',
          sortOrder: 'Sort order (ASC or DESC)'
        },
        example: '/api/student?search=john&page=1&limit=5&sortBy=first_name&sortOrder=ASC'
      }
    }
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())} seconds`,
    memory: process.memoryUsage(),
    version: process.version
  });
});

// 2. Register route
app.use('/api/student', studentRoutes);

// 404 handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
    availableEndpoints: {
      'GET /': 'API information',
      'GET /api/health': 'Health check',
      'POST /api/student': 'Create new student',
      'GET /api/student': 'Get all students',
      'GET /api/student/:id': 'Get student by ID'
    }
  });
});

// 3. Start server
const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || 'localhost';

app.listen(PORT, HOST, () => {
  console.log('='.repeat(50));
  console.log('🚀 Student Registration System API Server');
  console.log('='.repeat(50));
  console.log(`✅ Server running on http://${HOST}:${PORT}`);
  console.log(`📋 API Documentation: http://${HOST}:${PORT}/`);
  console.log(`🏥 Health Check: http://${HOST}:${PORT}/api/health`);
  console.log(`👨‍🎓 Students API: http://${HOST}:${PORT}/api/student`);
  console.log('='.repeat(50));
  console.log(`🕐 Server started at: ${new Date().toISOString()}`);
  console.log(`⚡ Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔧 Node Version: ${process.version}`);
  console.log('='.repeat(50));
}); 