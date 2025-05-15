const express = require('express');
const vaidApp = express();
const cors = require('cors');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

// Middleware
vaidApp.use(cors());
vaidApp.use(express.json());

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'ITBridge2025',
    database: 'vaid',
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('✅ Connected to MySQL');
});

// Register API
vaidApp.post('/register', (req, res) => {
    const { firstname, lastname, email, password, mobile, gender, address, age, blood_group } = req.body;

    const sql = `INSERT INTO users (firstname, lastname, email, password, mobile, gender, address, age, blood_group)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(sql, [firstname, lastname, email, password, mobile, gender, address, age, blood_group], (err, result) => {
        if (err) {
            console.error('Registration Error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(200).json({ message: 'Registration successful' });
    });
});

// Login API
vaidApp.post('/login', (req, res) => {
    const { mobile, password } = req.body;

    const sql = "SELECT * FROM users WHERE mobile = ? AND password = ?";
    db.query(sql, [mobile, password], (err, results) => {
        if (err) {
            console.error("Login Error:", err);
            return res.status(500).json({ error: 'Database Error' });
        }

        if (results.length > 0) {
            const user = results[0];
            const payload = {
                user_id: user.id,
                role: user.role, // Include the user's role (admin or user)
            };

            const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });


            res.status(200).json({
                message: 'Login successful',
                user,
                token,
            });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    });
});









// hosspital search-api
vaidApp.post('/search-user/search', (req, res) => {
    const { illness, user_id } = req.body;

    if (!illness || !user_id) {
        return res.status(400).json({ message: 'Illness and user ID are required.' });
    }

    const keywords = illness.toLowerCase().split(/\s+/);
    const conditions = keywords.map(() => 'LOWER(specialties) LIKE ?').join(' OR ');
    const values = keywords.map(kw => `%${kw}%`);

    const hospitalQuery = `SELECT * FROM hospitals WHERE ${conditions}`;

    db.query(hospitalQuery, values, (err, hospitals) => {
        if (err) {
            console.error('Error fetching hospitals:', err);
            return res.status(500).json({ message: 'Error fetching hospitals' });
        }

        // Debugging the retrieved hospital data
    console.log('Found hospitals:', hospitals);

         // Modify the line where you set recommended_hospitals
    const recommended_hospitals = hospitals.length > 0 
    ? hospitals.map(h => h.name).join(', ') 
    : "No hospitals found";  // If no hospitals are found, set a default message


        const insertRequestQuery = `
            INSERT INTO medical_requests (user_id, illness, description, recommended_hospitals)
            VALUES (?, ?, ?, ?)
        `;

        db.query(insertRequestQuery, [user_id, illness, 'Search by user', recommended_hospitals], (insertErr) => {
            if (insertErr) {
                console.error('Error saving request:', insertErr);
                return res.status(500).json({ message: 'Error saving request' });
            }

            // ✅ Save search history
            const insertSearchHistory = `
                INSERT INTO history (user_id, search_query, search_type, recommended_hospitals)
                VALUES (?, ?, ?, ?)
            `;
            db.query(insertSearchHistory, [user_id, illness, 'user', recommended_hospitals], (historyErr) => {
                if (historyErr) {
                    console.error('Error saving search history:', historyErr);
                } else {
                    console.log('Search history saved');
                }

                res.status(200).json({
                    message: `Search results for illness: ${illness}`,
                    hospitals,
                });
            });
        });
    });
});



// Hospital Search for Child
vaidApp.post('/api/hospitals/search-child', (req, res) => {
    const { illness, child_id, user_id } = req.body;

    if (!illness || !child_id || !user_id) {
        return res.status(400).json({ message: 'Illness, child ID, and user ID are required.' });
    }

    const keywords = illness.toLowerCase().split(/\s+/);
    const conditions = keywords.map(() => 'LOWER(specialties) LIKE ?').join(' OR ');
    const values = keywords.map(kw => `%${kw}%`);

    const hospitalQuery = `SELECT * FROM hospitals WHERE ${conditions}`;

    db.query(hospitalQuery, values, (err, hospitals) => {
        if (err) {
            console.error('Error fetching hospitals:', err);
            return res.status(500).json({ message: 'Error fetching hospitals' });
        }

        const recommended_hospitals = hospitals.length > 0 
            ? hospitals.map(h => h.name).join(', ') 
            : "No hospitals found";

        // Query to get the child's name
        const childQuery = `SELECT name FROM children WHERE id = ?`;
        db.query(childQuery, [child_id], (childErr, childData) => {
            if (childErr) {
                console.error('Error fetching child data:', childErr);
                return res.status(500).json({ message: 'Error fetching child data' });
            }

            const child_name = childData[0] ? childData[0].name : "Unknown Child";

            const insertRequestQuery = `
                INSERT INTO medical_requests (child_id, illness, description, recommended_hospitals)
                VALUES (?, ?, ?, ?)
            `;

            db.query(insertRequestQuery, [child_id, illness, 'Search for child', recommended_hospitals], (insertErr) => {
                if (insertErr) {
                    console.error('Error saving request:', insertErr);
                    return res.status(500).json({ message: 'Error saving request' });
                }

                // ✅ Always save search history with user_id
                const insertSearchHistory = `
                    INSERT INTO history (user_id, search_query, search_type, recommended_hospitals, child_id)
                    VALUES (?, ?, ?, ?, ?)
                `;

                db.query(insertSearchHistory, [user_id, illness, 'child', recommended_hospitals, child_id], (historyErr) => {
                    if (historyErr) {
                        console.error('Error saving search history:', historyErr);
                    } else {
                        console.log('Child search history saved');
                    }

                    res.status(200).json({
                        message: `Search results for child illness: ${illness}`,
                        hospitals,
                        child_name,  // Include the child's name in the response
                    });
                });
            });
        });
    });
});





vaidApp.get('/api/search-history', (req, res) => {
    const user_id = req.query.user_id;  // Assuming user_id is passed in query params

    const query = `
    SELECT 
        h.id,
        h.search_query,
        h.search_type,
        h.recommended_hospitals,
        h.timestamp,
        CONCAT(u.firstname, ' ', u.lastname) AS user_name,
        c.name AS child_name
    FROM history h
    LEFT JOIN users u ON h.user_id = u.id
    LEFT JOIN children c ON h.search_type = 'child' AND c.id = h.child_id  -- Correct JOIN for child search
    WHERE h.user_id = ?   -- Filter by user_id
    ORDER BY h.timestamp DESC
`;

    db.query(query, [user_id], (err, results) => {
        if (err) {
            console.error('Error fetching search history:', err);
            return res.status(500).json({ message: 'Error fetching search history' });
        }

        res.status(200).json({ history: results });
    });
});











// Feedback API
vaidApp.post('/feedback', (req, res) => {
    const { name, email, rating, comments } = req.body;

    if (!name || !email || !rating) {
        return res.status(400).json({ message: 'Name, email, and rating are required' });
    }

    const sql = `INSERT INTO feedbacks (name, email, rating, comments) VALUES (?, ?, ?, ?)`;

    db.query(sql, [name, email, rating, comments], (err, result) => {
        if (err) {
            console.error('Error inserting feedback:', err);
            return res.status(500).json({ message: 'Failed to submit feedback' });
        }

        res.status(200).json({ message: 'Feedback submitted successfully' });
    });
});

// Child Registration API (Authenticated)
vaidApp.post('/child-registration', (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(403).json({ message: "No token provided" });
      }

      jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
          return res.status(403).json({ message: "Invalid or expired token" });
        }
    
        const user_id = decoded.user_id;
        const { name, age, gender, blood_group } = req.body;

    if (!name || !age || !gender || !blood_group) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const sql = `
        INSERT INTO children (user_id, name, age, gender, blood_group)
        VALUES (?, ?, ?, ?, ?)`;

    db.query(sql, [user_id, name, age, gender, blood_group], (err, result) => {
        if (err) {
            console.error("Error registering child:", err);
            return res.status(500).json({ message: 'Failed to register child' });
        }

        res.status(200).json({ message: 'Child registered successfully' });
    });
});
});






// Admin: Get all medical requests
vaidApp.get('/api/medical-requests', (req, res) => {
    const userId = req.query.userId;

    let sql = `
        SELECT 
            medical_requests.*,
            -- Build the name field:
            CONCAT(
                IF(users.firstname IS NOT NULL, CONCAT(users.firstname, ' ', users.lastname), 'Unknown User'),
                IF(children.name IS NOT NULL AND children.name != '', 
                   CONCAT(' (Child: ', children.name, ')'), 
                   '')
            ) AS name
        FROM medical_requests
        LEFT JOIN users ON medical_requests.user_id = users.id
        LEFT JOIN children ON medical_requests.child_id = children.id
    `;

    const params = [];
    if (userId) {
        sql += ' WHERE medical_requests.user_id = ?';
        params.push(userId);
    }

    db.query(sql, params, (err, result) => {
        if (err) {
            console.error('SQL Error:', err.sqlMessage);
            return res.status(500).json({ message: 'Error fetching medical requests' });
        }
        res.status(200).json(result);
    });
});


// Admin: Update medical request
vaidApp.put('/api/medical-requests/:id', (req, res) => {
    const { id } = req.params;
    const { illness, description, recommended_hospitals } = req.body;
  
    // Example database update (replace with your DB code)
    const sql = `UPDATE medical_requests SET illness = ?, description = ?, recommended_hospitals = ? WHERE id = ?`;
    db.query(sql, [illness, description, recommended_hospitals, id], (err, result) => {
      if (err) {
        console.error('Error updating request:', err);
        return res.status(500).json({ message: 'Failed to update request' });
      }
      res.status(200).json({ message: 'Request updated successfully' });
    });
  });
  

//   delete medical request
  vaidApp.delete('/api/medical-requests/:id', (req, res) => {
    const { id } = req.params;
  
    // Example database delete (replace with your DB code)
    const sql = `DELETE FROM medical_requests WHERE id = ?`;
    db.query(sql, [id], (err, result) => {
      if (err) {
        console.error('Error deleting request:', err);
        return res.status(500).json({ message: 'Failed to delete request' });
      }
      res.status(200).json({ message: 'Request deleted successfully' });
    });
  });
  

// Admin: View all feedback
vaidApp.get('/viewFeedback', (req, res) => {
    const sql = "SELECT * FROM feedbacks";
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching feedbacks:", err);
            return res.status(500).json({ message: "Error retrieving feedbacks" });
        }
        res.status(200).json({ feedbacks: results });
    });
});

vaidApp.get('/manage-children', (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Authorization token missing' });

    let user_id;
    let isAdmin = false; // To track if the user is an admin
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        user_id = decoded.user_id;
        isAdmin = decoded.role === 'admin'; // Check if the user is an admin
    } catch (err) {
        return res.status(403).json({ message: 'Invalid token' });
    }

    if (isAdmin) {
        // If admin, fetch all children
        const sql = "SELECT * FROM children";
        db.query(sql, (err, results) => {
            if (err) {
                console.error("Error fetching children:", err);
                return res.status(500).json({ message: "Error retrieving children" });
            }
            res.status(200).json({ children: results });
        });
    } else {
        // If not admin, fetch only the user's children
        const sql = "SELECT * FROM children WHERE user_id = ?";
        db.query(sql, [user_id], (err, results) => {
            if (err) {
                console.error("Error fetching children:", err);
                return res.status(500).json({ message: "Error retrieving children" });
            }
            res.status(200).json({ children: results });
        });
    }
});

/// DELETE route to remove a child by ID
vaidApp.delete('/api/children/:id', (req, res) => {
    const childId = req.params.id;

    // Step 1: Delete related medical requests
    const deleteMedicalRequestsSql = 'DELETE FROM medical_requests WHERE child_id = ?';
    db.query(deleteMedicalRequestsSql, [childId], (err, result) => {
        if (err) {
            console.error('Error deleting related medical requests:', err);
            return res.status(500).json({ message: 'Failed to delete related medical requests' });
        }

        // Step 2: Delete the child
        const deleteChildSql = 'DELETE FROM children WHERE id = ?';
        db.query(deleteChildSql, [childId], (err, result) => {
            if (err) {
                console.error('Error deleting child:', err);
                return res.status(500).json({ message: 'Failed to delete child' });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Child not found' });
            }

            res.status(200).json({ message: 'Child and related records deleted successfully' });
        });
    });
});








//   forgot password
vaidApp.post('/forgot-password', (req, res) => {
    const { mobile } = req.body;

    const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP

    const sql = "UPDATE users SET reset_otp = ? WHERE mobile = ?";
    db.query(sql, [otp, mobile], (err, result) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'User not found' });

        // Simulate OTP sending
        console.log(`OTP sent to ${mobile}: ${otp}`);

        res.json({ message: 'Reset OTP sent to your mobile' });
    });
});


//   reset password-api
// POST /reset-password
vaidApp.post('/reset-password', (req, res) => {
    const { mobile, otp, newPassword } = req.body;

    const sql = "SELECT * FROM users WHERE mobile = ?";
    db.query(sql, [mobile], (err, results) => {
        if (err) return res.status(500).json({ error: 'Server error' });

        const user = results[0];
        if (!user) return res.status(404).json({ error: 'User not found' });

        if (user.reset_otp != otp) {
            return res.status(400).json({ error: 'Invalid OTP' });
        }

        const updateSql = "UPDATE users SET password = ?, reset_otp = NULL WHERE mobile = ?";
        db.query(updateSql, [newPassword, mobile], (updateErr) => {
            if (updateErr) return res.status(500).json({ error: 'Failed to update password' });

            res.json({ message: 'Password reset successful!' });
        });
    });
});

  
  


// Server listen
vaidApp.listen(8000, () => {
    console.log('🚀 Server running on http://localhost:8000');
});
