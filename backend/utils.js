// Step 3: Module Export/Import demonstration
// This file contains utility functions that can be imported by other modules

// Function to validate email format
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Function to validate phone number
function validatePhone(phone) {
    const phoneRegex = /^[\d+\-\s()]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

// Function to format date
function formatDate(date) {
    if (!(date instanceof Date)) {
        date = new Date(date);
    }
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Function to generate random ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Function to sanitize string input
function sanitizeString(str) {
    if (typeof str !== 'string') return '';
    return str.trim().replace(/[<>]/g, '');
}

// Student data validator
function validateStudentData(student) {
    const errors = [];
    
    if (!student.firstName || !sanitizeString(student.firstName)) {
        errors.push('First name is required');
    }
    
    if (!student.lastName || !sanitizeString(student.lastName)) {
        errors.push('Last name is required');
    }
    
    if (!student.email || !validateEmail(student.email)) {
        errors.push('Valid email is required');
    }
    
    if (!student.contact || !validatePhone(student.contact)) {
        errors.push('Valid contact number is required');
    }
    
    if (!student.dob) {
        errors.push('Date of birth is required');
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

// Constants for the application
const APP_CONSTANTS = {
    DEFAULT_PORT: 3000,
    DEFAULT_HOST: 'localhost',
    MAX_AGE: 100,
    MIN_AGE: 5,
    SUPPORTED_COUNTRIES: ['US', 'IN', 'CA', 'UK'],
    STATUS_CODES: {
        SUCCESS: 200,
        CREATED: 201,
        BAD_REQUEST: 400,
        NOT_FOUND: 404,
        SERVER_ERROR: 500
    }
};

// Sample data
const SAMPLE_STUDENTS = [
    {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        contact: '+1-555-0123',
        dob: '2019-01-15',
        gender: 'Male',
        country: 'US',
        state: 'CA',
        city: 'Los Angeles'
    },
    {
        id: '2',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        contact: '+1-555-0456',
        dob: '2018-05-20',
        gender: 'Female',
        country: 'US',
        state: 'NY',
        city: 'New York'
    }
];

// Export individual functions (CommonJS style)
module.exports = {
    validateEmail,
    validatePhone,
    formatDate,
    generateId,
    sanitizeString,
    validateStudentData,
    APP_CONSTANTS,
    SAMPLE_STUDENTS
};

// Alternative export syntax (you can use either approach):
// exports.validateEmail = validateEmail;
// exports.validatePhone = validatePhone;
// etc... 