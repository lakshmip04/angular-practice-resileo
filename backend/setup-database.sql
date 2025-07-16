-- Database setup script for Student Registration System
-- Run this script in your PostgreSQL database to create the required tables

-- Create students table
CREATE TABLE IF NOT EXISTS students (
    id VARCHAR(50) PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    contact VARCHAR(20) NOT NULL,
    dob DATE NOT NULL,
    gender VARCHAR(20),
    street VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    zip VARCHAR(20),
    country VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create an index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_students_email ON students(email);

-- Insert sample data
INSERT INTO students (id, first_name, last_name, email, contact, dob, gender, street, city, state, zip, country) 
VALUES 
    ('1', 'John', 'Doe', 'john.doe@example.com', '+1-555-0123', '2019-01-15', 'Male', '123 Main St', 'Los Angeles', 'CA', '90210', 'US'),
    ('2', 'Jane', 'Smith', 'jane.smith@example.com', '+1-555-0456', '2018-05-20', 'Female', '456 Oak Ave', 'New York', 'NY', '10001', 'US')
ON CONFLICT (email) DO NOTHING;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to auto-update updated_at
DROP TRIGGER IF EXISTS update_students_updated_at ON students;
CREATE TRIGGER update_students_updated_at
    BEFORE UPDATE ON students
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 