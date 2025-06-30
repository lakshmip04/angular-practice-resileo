// Step 1: Basic Node.js test file
// This demonstrates Node.js basics and will be expanded in later steps

console.log('=== Node.js Basics Test ===');
console.log('Node.js version:', process.version);
console.log('Platform:', process.platform);
console.log('Current working directory:', process.cwd());

// Basic JavaScript features in Node.js
const greeting = 'Hello from Node.js!';
const currentTime = new Date().toLocaleString();

console.log(greeting);
console.log('Current time:', currentTime);

// Demonstrating Node.js global objects
console.log('Global objects available:');
console.log('- __dirname:', __dirname);
console.log('- __filename:', __filename);

// Simple function demonstration
function calculateSum(a, b) {
    return a + b;
}

const result = calculateSum(10, 25);
console.log(`Sum of 10 + 25 = ${result}`);

// Working with arrays and objects
const students = [
    { name: 'Alice', age: 20 },
    { name: 'Bob', age: 22 },
    { name: 'Charlie', age: 19 }
];

console.log('\nStudent list:');
students.forEach((student, index) => {
    console.log(`${index + 1}. ${student.name} (Age: ${student.age})`);
});

