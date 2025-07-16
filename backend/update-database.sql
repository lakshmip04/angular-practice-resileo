-- Update database schema to add missing fields
-- Run this script to update the existing students table

-- Add new columns to existing table
ALTER TABLE students ADD COLUMN IF NOT EXISTS street VARCHAR(255);
ALTER TABLE students ADD COLUMN IF NOT EXISTS zip VARCHAR(20);

-- Update existing records with default values
UPDATE students SET 
    street = 'Default Street' WHERE street IS NULL;
UPDATE students SET 
    zip = '00000' WHERE zip IS NULL;

-- Update sample data with proper values
UPDATE students SET 
    street = '123 Main St',
    zip = '90210'
WHERE id = '1';

UPDATE students SET 
    street = '456 Oak Ave',
    zip = '10001'
WHERE id = '2';

-- Verify the changes
SELECT id, first_name, last_name, email, street, city, state, zip, country FROM students; 