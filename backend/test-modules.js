// Step 3: Testing Module Import/Export
// This file demonstrates how to import and use modules

// Import the entire utils module
const utils = require('./utils');

// Alternative: Import specific functions using destructuring
const { 
    validateEmail, 
    validatePhone, 
    formatDate, 
    generateId,
    validateStudentData,
    APP_CONSTANTS 
} = require('./utils');

console.log('=== Module Import/Export Test ===\n');

// Test individual functions
console.log('1. Testing Email Validation:');
console.log('   Valid email:', validateEmail('test@example.com')); // true
console.log('   Invalid email:', validateEmail('invalid-email'));  // false

console.log('\n2. Testing Phone Validation:');
console.log('   Valid phone:', validatePhone('+1-555-0123'));      // true
console.log('   Invalid phone:', validatePhone('abc123'));         // false

console.log('\n3. Testing Date Formatting:');
console.log('   Formatted date:', formatDate(new Date()));
console.log('   Formatted string date:', formatDate('2024-01-15'));

console.log('\n4. Testing ID Generation:');
console.log('   Generated ID 1:', generateId());
console.log('   Generated ID 2:', generateId());

console.log('\n5. Testing Constants:');
console.log('   Default Port:', APP_CONSTANTS.DEFAULT_PORT);
console.log('   Status Codes:', APP_CONSTANTS.STATUS_CODES);
console.log('   Supported Countries:', APP_CONSTANTS.SUPPORTED_COUNTRIES);

console.log('\n6. Testing Student Validation:');

// Valid student data
const validStudent = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    contact: '+1-555-0123',
    dob: '2019-01-15',
    gender: 'Male'
};

const validationResult = validateStudentData(validStudent);
console.log('   Valid student data:', validationResult);

// Invalid student data
const invalidStudent = {
    firstName: '',
    lastName: 'Doe',
    email: 'invalid-email',
    contact: '123',
    dob: '',
    gender: 'Male'
};

const invalidValidationResult = validateStudentData(invalidStudent);
console.log('   Invalid student data:', invalidValidationResult);

console.log('\n7. Testing Sample Data:');
console.log('   Sample students count:', utils.SAMPLE_STUDENTS.length);
utils.SAMPLE_STUDENTS.forEach((student, index) => {
    console.log(`   Student ${index + 1}: ${student.firstName} ${student.lastName} (${student.email})`);
});

console.log('\n=== Module test completed successfully! ===');

// Demonstrate different ways to use imported functions
console.log('\n8. Different Import Usage Examples:');

// Using the full module object
console.log('   Using utils.validateEmail:', utils.validateEmail('test@domain.com'));

// Using destructured functions
console.log('   Using destructured validateEmail:', validateEmail('test@domain.com'));

// Using constants from the module
const port = utils.APP_CONSTANTS.DEFAULT_PORT;
console.log(`   Server would run on port: ${port}`); 