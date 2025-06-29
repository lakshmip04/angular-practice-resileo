# Student Registration Backend

A comprehensive Node.js backend system for the Student Registration Form built with Express.js.

## 📋 Table of Contents

- [What is Node.js?](#what-is-nodejs)
- [Why Node.js for Backend?](#why-nodejs-for-backend)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [API Endpoints](#api-endpoints)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [Features](#features)

## 🤔 What is Node.js?

Node.js is a **JavaScript runtime environment** that allows you to run JavaScript code outside of a web browser. It's built on Chrome's V8 JavaScript engine and enables server-side JavaScript development.

### Key Characteristics:
- **Event-driven**: Uses an event loop for handling operations
- **Non-blocking I/O**: Asynchronous operations for better performance
- **Single-threaded**: But handles concurrency through events and callbacks
- **Cross-platform**: Runs on Windows, macOS, and Linux
- **NPM**: Comes with the world's largest package ecosystem

## 🚀 Why Node.js for Backend?

### Advantages:
1. **JavaScript Everywhere**: Same language for frontend and backend
2. **Fast Development**: Rapid prototyping and development
3. **NPM Ecosystem**: Huge library of packages
4. **Real-time Applications**: Excellent for chat apps, live updates
5. **JSON Handling**: Native JSON support
6. **Microservices**: Great for building scalable microservices
7. **Community**: Large, active developer community

### Perfect for:
- RESTful APIs
- Real-time applications (chat, gaming)
- Single Page Applications (SPAs)
- Microservices architecture
- IoT applications

## 📁 Project Structure

```
backend/
├── app.js              # Step 1: Basic Node.js test
├── simple-server.js    # Step 2: Simple HTTP server
├── utils.js           # Step 3: Module exports/imports
├── test-modules.js    # Step 3: Testing module imports
├── express-server.js  # Step 4: Express.js server
├── package.json       # NPM configuration
├── package-lock.json  # NPM lock file
└── README.md         # This file
```

## 🛠 Installation & Setup

### Prerequisites
- Node.js LTS (v18+ recommended)
- npm (comes with Node.js)

### Steps

1. **Clone/Navigate to the backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run different examples**
   ```bash
   # Step 1: Basic Node.js test
   npm run test-basic
   
   # Step 2: Simple HTTP server
   npm run test-simple-server
   
   # Step 3: Module testing
   npm run test-modules
   
   # Step 4: Express server (main application)
   npm start
   ```

## 🌐 API Endpoints

The Express server provides the following endpoints:

### Base URL: `http://localhost:3000`

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| GET | `/` | API information | - |
| GET | `/api/health` | Health check | - |
| GET | `/api/students` | Get all students (with pagination) | - |
| GET | `/api/students/:id` | Get student by ID | - |
| POST | `/api/students` | Create new student | StudentData JSON |
| PUT | `/api/students/:id` | Update student | Partial StudentData JSON |
| DELETE | `/api/students/:id` | Delete student | - |

### Student Data Format

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "contact": "+1-555-0123",
  "dob": "2000-01-15",
  "gender": "Male",
  "street": "123 Main St",
  "city": "New York",
  "state": "NY",
  "zip": "10001",
  "country": "US",
  "genderName": "Male",
  "countryName": "United States",
  "stateName": "New York"
}
```

### Query Parameters (GET /api/students)

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `search`: Search term (searches in firstName, lastName, email)

Example: `GET /api/students?page=1&limit=5&search=john`

## 🏃‍♂️ Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

### Testing Individual Components
```bash
# Test basic Node.js functionality
npm run test-basic

# Test simple HTTP server (port 3001)
npm run test-simple-server

# Test module import/export
npm run test-modules
```

## 🧪 Testing

### Manual Testing with curl

1. **Get API info**
   ```bash
   curl http://localhost:3000/
   ```

2. **Health check**
   ```bash
   curl http://localhost:3000/api/health
   ```

3. **Get all students**
   ```bash
   curl http://localhost:3000/api/students
   ```

4. **Create a new student**
   ```bash
   curl -X POST http://localhost:3000/api/students \
     -H "Content-Type: application/json" \
     -d '{
       "firstName": "Alice",
       "lastName": "Johnson",
       "email": "alice.johnson@example.com",
       "contact": "+1-555-0789",
       "dob": "2001-03-10",
       "gender": "Female",
       "street": "456 Oak Ave",
       "city": "Boston",
       "state": "MA",
       "zip": "02101",
       "country": "US"
     }'
   ```

### Testing with Angular Frontend

The Angular application will automatically connect to this backend when you:
1. Start the Express server: `npm start`
2. Run your Angular app: `ng serve`
3. Submit the registration form

## ✨ Features

### Current Features
- ✅ RESTful API design
- ✅ CORS enabled for frontend integration
- ✅ Input validation and sanitization
- ✅ Error handling and logging
- ✅ Pagination and search functionality
- ✅ In-memory data storage
- ✅ Comprehensive API documentation
- ✅ Graceful shutdown handling

### Future Enhancements (for PostgreSQL integration)
- 🔄 Database integration with PostgreSQL
- 🔄 User authentication and authorization
- 🔄 File upload for student photos
- 🔄 Email notifications
- 🔄 Data export (CSV, PDF)
- 🔄 Advanced filtering and sorting
- 🔄 Rate limiting and security middleware

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Kill process using port 3000
   lsof -ti:3000 | xargs kill -9
   ```

2. **Module not found**
   ```bash
   # Reinstall dependencies
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **CORS issues**
   - The server includes CORS middleware
   - Make sure Angular runs on port 4200

## 📝 Learning Objectives Completed

✅ **Step 1**: Basic Node.js understanding and execution  
✅ **Step 2**: Simple HTTP server with routing  
✅ **Step 3**: Module export/import system  
✅ **Step 4**: Express.js server with full CRUD operations  

## 🔗 Integration with Angular

The Angular frontend (`StudentService`) is configured to connect to:
- **Base URL**: `http://localhost:3000/api`
- **Main endpoint**: `POST /api/students`

Make sure to:
1. Start this Express server first: `npm start`
2. Then start Angular: `ng serve`
3. Test the complete flow by submitting the registration form

## 📚 Next Steps

After completing this Node.js foundation, you'll be ready for:
- PostgreSQL database integration
- Advanced authentication systems
- Production deployment strategies
- Microservices architecture

---

**Happy Coding! 🎉** 