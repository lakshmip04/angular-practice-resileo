// Step 2: Simple HTTP Server using Node.js built-in modules
const http = require('http');
const url = require('url');

// Server configuration
const PORT = 3001;
const HOST = 'localhost';

// Create HTTP server
const server = http.createServer((req, res) => {
    // Parse the URL
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const method = req.method;

    // Set CORS headers to allow requests from Angular app
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight requests
    if (method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // Set content type to JSON
    res.setHeader('Content-Type', 'application/json');

    console.log(`${method} ${path}`);

    // Route handling
    if (path === '/' && method === 'GET') {
        // Home route
        res.writeHead(200);
        res.end(JSON.stringify({
            message: 'Welcome to Simple Node.js HTTP Server!',
            timestamp: new Date().toISOString(),
            routes: [
                'GET / - Home page',
                'GET /about - About page',
                'GET /students - List students',
                'POST /students - Add student (send JSON in body)'
            ]
        }));

    } else if (path === '/about' && method === 'GET') {
        // About route
        res.writeHead(200);
        res.end(JSON.stringify({
            message: 'About this server',
            description: 'This is a simple HTTP server built with Node.js',
            author: 'Student Learning Project',
            version: '1.0.0'
        }));

    } else if (path === '/students' && method === 'GET') {
        // Get students route
        const sampleStudents = [
            { id: 1, name: 'John Doe', email: 'john@example.com', age: 20 },
            { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 22 },
            { id: 3, name: 'Mike Johnson', email: 'mike@example.com', age: 19 }
        ];

        res.writeHead(200);
        res.end(JSON.stringify({
            success: true,
            message: 'Students retrieved successfully',
            data: sampleStudents,
            count: sampleStudents.length
        }));

    } else if (path === '/students' && method === 'POST') {
        // Add student route
        let body = '';

        // Collect data chunks
        req.on('data', chunk => {
            body += chunk.toString();
        });

        // Process complete request
        req.on('end', () => {
            try {
                const studentData = JSON.parse(body);
                
                // Simple validation
                if (!studentData.name || !studentData.email) {
                    res.writeHead(400);
                    res.end(JSON.stringify({
                        success: false,
                        message: 'Name and email are required fields'
                    }));
                    return;
                }

                // Simulate adding student (in real app, this would go to database)
                const newStudent = {
                    id: Date.now(), // Simple ID generation
                    ...studentData,
                    createdAt: new Date().toISOString()
                };

                res.writeHead(201);
                res.end(JSON.stringify({
                    success: true,
                    message: 'Student added successfully',
                    data: newStudent
                }));

            } catch (error) {
                res.writeHead(400);
                res.end(JSON.stringify({
                    success: false,
                    message: 'Invalid JSON data',
                    error: error.message
                }));
            }
        });

    } else {
        // 404 - Route not found
        res.writeHead(404);
        res.end(JSON.stringify({
            success: false,
            message: 'Route not found',
            path: path,
            method: method
        }));
    }
});

// Start the server
server.listen(PORT, HOST, () => {
    console.log(`🚀 Simple HTTP Server running at http://${HOST}:${PORT}`);
    console.log('📋 Available routes:');
    console.log(`   GET  http://${HOST}:${PORT}/`);
    console.log(`   GET  http://${HOST}:${PORT}/about`);
    console.log(`   GET  http://${HOST}:${PORT}/students`);
    console.log(`   POST http://${HOST}:${PORT}/students`);
    console.log('\n💡 Press Ctrl+C to stop the server');
});

// Handle server errors
server.on('error', (err) => {
    console.error('Server error:', err);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down server gracefully...');
    server.close(() => {
        console.log('✅ Server closed successfully');
        process.exit(0);
    });
}); 