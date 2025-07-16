// database.js - Database operations for students
const pool = require('./db');

class Database {
    // Get all students with optional search and pagination
    async getAllStudents(search = '', page = 1, limit = 10) {
        try {
            let query = `
                SELECT id, first_name, last_name, email, contact, dob, gender, street, city, state, zip, country, created_at, updated_at
                FROM students
            `;
            let queryParams = [];
            let whereClause = '';

            // Add search functionality
            if (search) {
                whereClause = ` WHERE 
                    LOWER(first_name) LIKE LOWER($1) OR 
                    LOWER(last_name) LIKE LOWER($1) OR 
                    LOWER(email) LIKE LOWER($1)
                `;
                queryParams.push(`%${search}%`);
            }

            // Add pagination
            const offset = (page - 1) * limit;
            const paginationClause = ` ORDER BY created_at DESC LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
            queryParams.push(limit, offset);

            const finalQuery = query + whereClause + paginationClause;
            
            // Get total count for pagination
            let countQuery = 'SELECT COUNT(*) FROM students' + whereClause;
            let countParams = search ? [`%${search}%`] : [];
            
            const [studentsResult, countResult] = await Promise.all([
                pool.query(finalQuery, queryParams),
                pool.query(countQuery, countParams)
            ]);

            return {
                students: studentsResult.rows,
                totalCount: parseInt(countResult.rows[0].count)
            };
        } catch (error) {
            console.error('Database error in getAllStudents:', error);
            throw error;
        }
    }

    // Get student by ID
    async getStudentById(id) {
        try {
            const query = `
                SELECT id, first_name, last_name, email, contact, dob, gender, street, city, state, zip, country, created_at, updated_at
                FROM students 
                WHERE id = $1
            `;
            const result = await pool.query(query, [id]);
            return result.rows[0];
        } catch (error) {
            console.error('Database error in getStudentById:', error);
            throw error;
        }
    }

    // Create new student
    async createStudent(studentData) {
        try {
            const query = `
                INSERT INTO students (id, first_name, last_name, email, contact, dob, gender, street, city, state, zip, country)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
                RETURNING id, first_name, last_name, email, contact, dob, gender, street, city, state, zip, country, created_at, updated_at
            `;
            
            const values = [
                studentData.id,
                studentData.firstName,
                studentData.lastName,
                studentData.email,
                studentData.contact,
                studentData.dob,
                studentData.gender,
                studentData.street,
                studentData.city,
                studentData.state,
                studentData.zip,
                studentData.country
            ];

            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            console.error('Database error in createStudent:', error);
            throw error;
        }
    }

    // Update student
    async updateStudent(id, studentData) {
        try {
            const query = `
                UPDATE students 
                SET first_name = $2, last_name = $3, email = $4, contact = $5, dob = $6, 
                    gender = $7, street = $8, city = $9, state = $10, zip = $11, country = $12
                WHERE id = $1
                RETURNING id, first_name, last_name, email, contact, dob, gender, street, city, state, zip, country, created_at, updated_at
            `;
            
            const values = [
                id,
                studentData.firstName,
                studentData.lastName,
                studentData.email,
                studentData.contact,
                studentData.dob,
                studentData.gender,
                studentData.street,
                studentData.city,
                studentData.state,
                studentData.zip,
                studentData.country
            ];

            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            console.error('Database error in updateStudent:', error);
            throw error;
        }
    }

    // Delete student
    async deleteStudent(id) {
        try {
            const query = 'DELETE FROM students WHERE id = $1 RETURNING *';
            const result = await pool.query(query, [id]);
            return result.rows[0];
        } catch (error) {
            console.error('Database error in deleteStudent:', error);
            throw error;
        }
    }

    // Check if email exists
    async emailExists(email, excludeId = null) {
        try {
            let query = 'SELECT id FROM students WHERE email = $1';
            let params = [email];
            
            if (excludeId) {
                query += ' AND id != $2';
                params.push(excludeId);
            }
            
            const result = await pool.query(query, params);
            return result.rows.length > 0;
        } catch (error) {
            console.error('Database error in emailExists:', error);
            throw error;
        }
    }

    // Test database connection
    async testConnection() {
        try {
            const result = await pool.query('SELECT NOW()');
            console.log('✅ Database connection successful:', result.rows[0].now);
            return true;
        } catch (error) {
            console.error('❌ Database connection failed:', error);
            return false;
        }
    }
}

module.exports = new Database(); 