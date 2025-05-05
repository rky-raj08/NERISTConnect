const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const pool = require('./db');
const cors = require("cors");
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');
require('dotenv').config();



const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../Front', 'index1.html'));
});


// ✅ Custom function to generate 8-character uppercase alphanumeric reference
function generateShortReference() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let ref = '';
  for (let i = 0; i < 8; i++) {
    ref += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return ref;
}
// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// app.get('/',async(req,res) =>{
//   return res.sendFile(path.join(__dirname, '../Front/index1.html'))
// })
// Upload route
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const { title, description } = req.body;
    const file = req.file;
    const reference = generateShortReference();
    const fileType = path.extname(file.originalname).substring(1).toLowerCase();

    if (!file || !title || !description) {
      return res.status(400).json({ error: 'All fields required' });
    }

    await pool.query(
      `INSERT INTO files (title, description, filename, filepath, reference, filetype, location, status, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())`,
      [title, description, file.filename, `/uploads/${file.filename}`, reference, fileType, 'Faculty Office', 'Uploaded']
    );

    res.status(200).json({ message: 'File uploaded successfully', reference });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Track file by reference number
app.get('/track-file', async (req, res) => {
  const { reference } = req.query;

  try {
    const result = await pool.query('SELECT * FROM files WHERE reference = $1', [reference]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Reference not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// fetch at admin page
app.get('/admin/files', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM files ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Admin fetch files error:', err);
    res.status(500).json({ error: 'Error fetching files' });
  }
});

// update records
app.put('/admin/update-file', async (req, res) => {
  const { reference, location, status } = req.body;
  try {
    const result = await pool.query(
      'UPDATE files SET location = $1, status = $2 WHERE reference = $3 RETURNING *',
      [location, status, reference]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'File not found' });
    }
    res.json({ message: 'File updated successfully', file: result.rows[0] });
  } catch (err) {
    console.error('Update file error:', err);
    res.status(500).json({ error: 'Error updating file' });
  }
});




// 🔐 In-memory OTP store
const otpStore = {};

// Nodemailer config
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // your email
    pass: process.env.EMAIL_PASS  // your app password
  },
});


// User login route
app.post('/login', async (req, res) => {
  const { username, password_hash } = req.body;

  try {
    const result = await pool.query(
      'SELECT * FROM Accounts WHERE username = $1 AND password_hash = $2',
      [username,password_hash] 
    );
    // console.log(result.rows)
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const user = result.rows[0];
    console.log(user)

    if (user.password_hash !== password_hash) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Login successful
    res.json({ message: 'Login successful', user: user });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Admin Login Route
app.post('/admin-login', async (req, res) => {
  const { username, password_hash } = req.body;

  try {
    const result = await pool.query(
      'SELECT * FROM adminpass WHERE username = $1 AND password_hash = $2',
      [username, password_hash]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid admin credentials' });
    }

    const admin = result.rows[0];
    res.json({ message: 'Admin login successful', admin: admin });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


// Faculty Login Route
app.post('/faculty-login', async (req, res) => {
  const { username, password_hash } = req.body;

  try {
    const result = await pool.query(
      'SELECT * FROM facultypass WHERE username = $1 AND password_hash = $2',
      [username, password_hash]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid faculty credentials' });
    }

    const faculty = result.rows[0];
    res.json({ message: 'Faculty login successful', faculty: faculty });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// =======================
// ✅ Forgot Password Route for students
// =======================
app.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const result = await pool.query(
      'SELECT * FROM accounts WHERE username = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Email not found' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[email] = { otp, createdAt: Date.now() };

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset OTP',
      text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) return res.status(500).json({ error: 'Failed to send OTP' });
      res.json({ message: 'OTP sent to your email' });
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


// =======================
// ✅ OTP Verification Route for student
// =======================
app.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;

  const stored = otpStore[email];
  if (!stored) return res.status(400).json({ error: 'No OTP sent' });

  if (stored.otp !== otp) {
    return res.status(400).json({ error: 'Invalid OTP' });
  }

  if (Date.now() - stored.createdAt > 5 * 60 * 1000) {
    delete otpStore[email];
    return res.status(410).json({ error: 'OTP expired' });
  }

  res.json({ message: 'OTP verified' });
});

// =======================
// ✅ Reset Password Route
// =======================
app.post('/reset-password', async (req, res) => {
  const { email, otp, newPassword } = req.body;

  const stored = otpStore[email];
  if (!stored || stored.otp !== otp) {
    return res.status(400).json({ error: 'Invalid or expired OTP' });
  }

  try {
    await pool.query(
      'UPDATE accounts SET password_hash = $1 WHERE username = $2',
      [newPassword, email]
    );

    delete otpStore[email];

    res.json({ message: 'Password reset successfully' });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});




// ============================
// ✅ Forgot Password Route for Admin
// ============================
app.post('/admin/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const result = await pool.query(
      'SELECT * FROM adminpass WHERE username = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Email not found' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[email] = { otp, createdAt: Date.now() };

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Admin Password Reset OTP',
      text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) return res.status(500).json({ error: 'Failed to send OTP' });
      res.json({ message: 'OTP sent to your email' });
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


// ============================
// ✅ OTP Verification Route for Admin
// ============================
app.post('/admin/verify-otp', (req, res) => {
  const { email, otp } = req.body;

  const stored = otpStore[email];
  if (!stored) return res.status(400).json({ error: 'No OTP sent' });

  if (stored.otp !== otp) {
    return res.status(400).json({ error: 'Invalid OTP' });
  }

  if (Date.now() - stored.createdAt > 5 * 60 * 1000) {
    delete otpStore[email];
    return res.status(410).json({ error: 'OTP expired' });
  }

  res.json({ message: 'OTP verified' });
});


// ============================
// ✅ Reset Password Route for Admin
// ============================
app.post('/admin/reset-password', async (req, res) => {
  const { email, otp, newPassword } = req.body;

  const stored = otpStore[email];
  if (!stored || stored.otp !== otp) {
    return res.status(400).json({ error: 'Invalid or expired OTP' });
  }

  try {
    await pool.query(
      'UPDATE adminpass SET password_hash = $1 WHERE username = $2',
      [newPassword, email]
    );

    delete otpStore[email];

    res.json({ message: 'Password reset successfully' });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});



// ============================
// ✅ Forgot Password Route for Faculty
// ============================
app.post('/faculty/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const result = await pool.query(
      'SELECT * FROM facultypass WHERE username = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Email not found' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[email] = { otp, createdAt: Date.now() };

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Faculty Password Reset OTP',
      text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) return res.status(500).json({ error: 'Failed to send OTP' });
      res.json({ message: 'OTP sent to your email' });
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


// ============================
// ✅ OTP Verification Route for Faculty
// ============================
app.post('/faculty/verify-otp', (req, res) => {
  const { email, otp } = req.body;

  const stored = otpStore[email];
  if (!stored) return res.status(400).json({ error: 'No OTP sent' });

  if (stored.otp !== otp) {
    return res.status(400).json({ error: 'Invalid OTP' });
  }

  if (Date.now() - stored.createdAt > 5 * 60 * 1000) {
    delete otpStore[email];
    return res.status(410).json({ error: 'OTP expired' });
  }

  res.json({ message: 'OTP verified' });
});


// ============================
// ✅ Reset Password Route for Faculty
// ============================
app.post('/faculty/reset-password', async (req, res) => {
  const { email, otp, newPassword } = req.body;

  const stored = otpStore[email];
  if (!stored || stored.otp !== otp) {
    return res.status(400).json({ error: 'Invalid or expired OTP' });
  }

  try {
    await pool.query(
      'UPDATE facultypass SET password_hash = $1 WHERE username = $2',
      [newPassword, email]
    );

    delete otpStore[email];

    res.json({ message: 'Password reset successfully' });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });


//  Complaint submission route
app.post('/complaint1/submit', async (req, res) => {
  try {
    const { user_id, name, email, category, priority, details } = req.body;
    // console.log(user_id, name, email, category, details)
    if (!name || !email || !category || !priority || !details) {
      return res.status(400).json({ error: 'All fields are required!' });
    }

    const query = `
      INSERT INTO complaints ( name, email, category, priority, details)
      VALUES ($1, $2, $3, $4, $5) RETURNING *;
    `;
    const values = [name, email, category, priority, details];

    const result = await pool.query(query, values);
    res.status(201).json({ message: 'Complaint submitted successfully', complaint: result.rows[0] });

  } catch (error) {
    console.error('Error submitting complaint:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//  Fetch all complaints (for admin dashboard)
app.get('/complaints/all', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM complaints');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching complaints:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Faculty Complaint Submission route 

app.post('/faculty-complaint/submit', async (req, res) => {
  try {
    const { user_id, name, email, department, category, priority, details } = req.body;

    if (!name || !email || !department || !category || !priority || !details) {
      return res.status(400).json({ error: 'All fields are required!' });
    }

    const query = `
      INSERT INTO Fcomplaints (name, email, department, category, priority, details)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
    `;
    const values = [name, email, department, category, priority, details];

    const result = await pool.query(query, values);
    res.status(201).json({ message: 'Faculty complaint submitted successfully', complaint: result.rows[0] });

  } catch (error) {
    console.error('Error submitting faculty complaint:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Fetch all faculty complaints (for admin/faculty dashboard)
app.get('/faculty-complaints/all', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Fcomplaints ORDER BY id ASC');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching faculty complaints:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 1️⃣ Submit a new electricity complaint
app.post("/Ecomplaints/submit", async (req, res) => {
  try {
    const { student_name, block_name, department, room_number, issue_description } = req.body;

    if (!student_name || !block_name || !department || !room_number || !issue_description) {
      return res.status(400).json({ error: "All fields are required!" });
    }

    const query = `
      INSERT INTO Ecomplaints (student_name, block_name, department, room_number, issue)
      VALUES ($1, $2, $3, $4, $5) RETURNING *;
    `;
    const values = [student_name, block_name, department, room_number, issue_description];

    const result = await pool.query(query, values);
    res.status(201).json({ message: "Complaint submitted successfully", complaint: result.rows[0] });

  } catch (error) {
    console.error("Error submitting complaint:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 2️⃣ Fetch all complaints for the admin panel
app.get("/Ecomplaints/all", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM Ecomplaints ;");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching complaints:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// 1️⃣ Submit a new electricity complaint for faculty 
app.post("/FEcomplaints/submit", async (req, res) => {
  try {
    const { name, email, department, address, issue_description } = req.body;

    if (!name || !email || !department || !address || !issue_description) {
      return res.status(400).json({ error: "All fields are required!" });
    }

    const query = `
      INSERT INTO FEcomplaints (name, email, department, address, issue)
      VALUES ($1, $2, $3, $4, $5) RETURNING *;
    `;
    const values = [name, email, department, address, issue_description];

    const result = await pool.query(query, values);
    res.status(201).json({ message: "Complaint submitted successfully", complaint: result.rows[0] });

  } catch (error) {
    console.error("Error submitting complaint:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 2️⃣ Fetch all complaints for the admin panel faculty
app.get("/FEcomplaints/all", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM FEcomplaints ;");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching complaints:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 1️⃣ Submit a new water supply complaint for student 
app.post("/water_complaints", async (req, res) => {
  try {
    const { student_name, block_name, department, room_number, issue_description } = req.body;

    // Input validation
    if (!student_name || !block_name || !department || !room_number || !issue_description) {
      return res.status(400).json({ error: "All fields are required!" });
    }

    // SQL insert query
    const query = `
      INSERT INTO Wcomplaints (student_name, block_name, department, room_number, issue)
      VALUES ($1, $2, $3, $4, $5) RETURNING *;
    `;
    const values = [student_name, block_name, department, room_number, issue_description];

    // Execute query
    const result = await pool.query(query, values);
    res.status(201).json({ message: "Water complaint submitted successfully", complaint: result.rows[0] });

  } catch (error) {
    console.error("Error submitting water complaint:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 2️⃣ Fetch all water complaints (for admin view)
app.get("/water_complaints/all", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM Wcomplaints order by id ASC");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching water complaints:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Water Complaints for faculty

app.post("/FWcomplaints/submit", async (req, res) => {
  try {
    const { name, email, department, address, issue_description } = req.body;

    // Input validation
    if (!name || !email || !department || !address || !issue_description) {
      return res.status(400).json({ error: "All fields are required!" });
    }

    // SQL insert query
    const query = `
      INSERT INTO FWcomplaints (name, email, department, address, issue)
      VALUES ($1, $2, $3, $4, $5) RETURNING *;
    `;
    const values = [name, email, department, address, issue_description];

    // Execute query
    const result = await pool.query(query, values);
    res.status(201).json({ message: "Water complaint submitted successfully", complaint: result.rows[0] });

  } catch (error) {
    console.error("Error submitting water complaint:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 2️⃣ Fetch all water complaints (for admin view) Faculty
app.get("/FWcomplaints/all", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM FWcomplaints order by id ASC");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching water complaints:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// Route to handle faculty leave application
app.post('/leave', async (req, res) => {
  try {
      const {
          name,
          designation,
          department,
          no_of_days,
          departure_date,
          arrival_date,
          reason,
          substitution,
          email
      } = req.body;

      // Check if all required fields are filled
      if (!name || !designation || !department || !no_of_days || !departure_date || !arrival_date || !reason || !substitution || !email) {
          return res.status(400).json({ error: 'All fields are required.' });
      }

      // Insert query
      const query = `
          INSERT INTO leave_applications 
          (name, designation, department, no_of_days, departure_date, arrival_date, reason, substitution, email, status)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'Pending') RETURNING *;
      `;
      const values = [name, designation, department, no_of_days, departure_date, arrival_date, reason, substitution, email];

      const result = await pool.query(query, values);

      res.status(201).json({ message: 'Leave application submitted successfully.', data: result.rows[0] });
  } catch (error) {
      console.error('Error storing leave application:', error);
      res.status(500).json({ error: 'Internal server error.' });
  }
});

// 2️⃣ Fetch all leave applications of faculty
app.get('/leave/all', async (req, res) => {
  try {
      const result = await pool.query('SELECT * FROM leave_applications ORDER BY id ASC');
      res.json(result.rows);
  } catch (error) {
      console.error('Error retrieving leave requests:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ✅ Update Leave Application Status (Approve / Reject + Email)
app.put('/leave/update/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const result = await pool.query(
      'UPDATE leave_applications SET status = $1 WHERE id = $2 RETURNING *;',
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Leave application not found' });
    }

    const leave = result.rows[0];

    // Send email only if status is approved or rejected
    if (status.toLowerCase() === 'approved' || status.toLowerCase() === 'rejected') {
      await sendLeaveStatusEmail(
        leave.email,
        leave.name,
        status,
        leave.no_of_days,
        leave.departure_date,
        leave.arrival_date
      );
    }

    res.status(200).json({ message: 'Leave status updated successfully' });
  } catch (error) {
    console.error('Error updating leave status:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// ✅ Delete Leave Application
app.delete('/leave/delete/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM leave_applications WHERE id = $1 RETURNING *;', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Leave application not found' });
    }

    res.json({ message: 'Leave application deleted successfully' });
  } catch (error) {
    console.error('Error deleting leave application:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/// ✅ Reusable Email Function for Leave Applications
async function sendLeaveStatusEmail(toEmail, name, status, noOfDays, departureDate, arrivalDate) {
  console.log("Email Debug:", { toEmail, name, status, noOfDays, departureDate, arrivalDate }); // 👈 Add this

  try {
    const formattedDeparture = new Date(departureDate).toLocaleDateString();
    const formattedArrival = new Date(arrivalDate).toLocaleDateString();

    let subject = '';
    let text = '';

    if (status.toLowerCase() === 'approved') {
      subject = '✅ Your Leave Request Has Been Approved';
      text = `Dear ${name},\n\nYour leave request for ${noOfDays} day(s) has been approved.\nLeave Duration: ${formattedDeparture} to ${formattedArrival}.\n\nThank you.`;
    } else {
      subject = '❌ Your Leave Request Has Been Rejected';
      text = `Dear ${name},\n\nWe regret to inform you that your leave request for ${noOfDays} day(s), from ${formattedDeparture} to ${formattedArrival}, has been rejected.\nPlease contact the office for more details.`;
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: toEmail,
      subject,
      text,
    };

    await transporter.sendMail(mailOptions);
    console.log(`📩 ${status} email sent to ${toEmail}`);
  } catch (err) {
    console.error(`❌ Error sending ${status} email:`, err.message);
  }
}




//  Submit a Certificate Request
app.post('/certificate/submit', async (req, res) => {
  try {

    console.log('Request received at /certificate/submit');
    console.log('Request Body:', req.body); // Log request body
    const { name, roll, email, certificate_type, reason } = req.body;

    if (!name || !roll || !email || !certificate_type || !reason) {
      return res.status(400).json({ error: 'All fields are required!' });
    }

    const query = `
      INSERT INTO certificates (name, roll, email, certificate_type, reason, status)
      VALUES ($1, $2, $3, $4, $5, 'Pending') RETURNING *;
    `;
    const values = [name, roll, email, certificate_type, reason];

    const result = await pool.query(query, values);
    res.status(201).json({ message: 'Certificate application submitted successfully', application: result.rows[0] });

  } catch (error) {
    console.error('Error submitting certificate application:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//  Fetch All Certificate Applications (Admin)
app.get('/certificates/all', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM certificates ORDER BY applied_at DESC;');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching certificates:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/** 
//const nodemailer = require("nodemailer");

// Use existing DB update logic from your current code
app.put('/certificate/update/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    // Update status in DB (already part of your backend logic)
    const result = await pool.query(
      'UPDATE certificates SET status = $1 WHERE id = $2 RETURNING *;',
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Certificate not found' });
    }

    const certificate = result.rows[0];

    // Send email ONLY if approved
    if (status === 'Approved') {
      await sendApprovalEmail(certificate.email, certificate.name, certificate.certificate_type);
    }

    res.status(200).json({ message: 'Certificate status updated successfully' });

  } catch (error) {
    console.error('Error updating certificate status:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Reusable email sending function
async function sendApprovalEmail(toEmail, name, certificateType) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER, // ✅ remove "Certificate Desk",
      to: toEmail,
      subject: 'Your Certificate Request Has Been Approved',
      text: `Dear ${name},\n\nYour request for a "${certificateType}" has been approved. You can collect it from the office within 2 working days.\n\nThank you.`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Approval email sent to ${toEmail}`);
  } catch (err) {
    console.error('❌ Error sending email:', err);
  }
}
*/

//const nodemailer = require("nodemailer");

// ✅ Reuse one transporter globally — just like OTP code
/**const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail ID
    pass: process.env.EMAIL_PASS  // App password
  },
});
*/

// ✅ Certificate status update route
app.put('/certificate/update/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    // ✅ Update the status in DB
    const result = await pool.query(
      'UPDATE certificates SET status = $1 WHERE id = $2 RETURNING *;',
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Certificate not found' });
    }

    const certificate = result.rows[0];

    // ✅ If approved, send email
    // ✅ Send status email (either Approved or Rejected)
    if (status === 'Approved' || status === 'Rejected') {
      await sendCertificateStatusEmail(
        certificate.email,
        certificate.name,
        certificate.certificate_type,
        status
      );
    }
    res.status(200).json({ message: 'Certificate status updated successfully' });

  } catch (error) {
    console.error('❌ Error updating certificate status:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ✅ Clean and simple email function (like OTP code)
// ✅ Clean and flexible email function (handles both Approved and Rejected)
async function sendCertificateStatusEmail(toEmail, name, certificateType, status) {
  try {
    let subject = '';
    let text = '';

    if (status === 'Approved') {
      subject = 'Your Certificate Request Has Been Approved ✅';
      text = `Dear ${name},\n\nYour request for a "${certificateType}" certificate has been approved. You can collect it from the office within 2 working days.\n\nThank you.`;
    } else if (status === 'Rejected') {
      subject = 'Your Certificate Request Has Been Rejected ❌';
      text = `Dear ${name},\n\nWe regret to inform you that your request for a "${certificateType}" certificate has been rejected. Please contact the office for more details.\n\nThank you.`;
    } else {
      console.warn(`⚠️ Unknown status "${status}" for ${toEmail}`);
      return;
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: toEmail,
      subject,
      text,
    };

    await transporter.sendMail(mailOptions);
    console.log(`📩 ${status} email sent to ${toEmail}`);
  } catch (err) {
    console.error(`❌ Error sending ${status} email to ${toEmail}:`, err.message);
  }
}


app.delete('/certificates/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM certificates WHERE id = $1 RETURNING *;', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Certificate not found' });
    }

    res.json({ message: 'Certificate deleted successfully' });
  } catch (error) {
    console.error('Error deleting certificate:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



/**
 * ✅ Update Certificate Status (Admin Approval)
 * PUT /certificate/update/:id
 */

app.put('/certificate/update/:id', async (req, res) => {
  try {
      const { id } = req.params;
      const { status } = req.body;

      // Validate input
      if (!status) {
          return res.status(400).json({ error: 'Status is required!' });
      }

      // Update status in database
      const query = `
          UPDATE certificates SET status = $1 WHERE id = $2 RETURNING *;
      `;
      const values = [status, id];

      const result = await pool.query(query, values);
      if (result.rows.length === 0) {
          return res.status(404).json({ error: 'Certificate request not found!' });
      }

      res.status(200).json({ message: 'Certificate status updated successfully', updatedCertificate: result.rows[0] });

  } catch (error) {
      console.error('Error updating certificate status:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Books data

// API to Get All Books
app.get("/books", async (req, res) => {
  try {
      const result = await pool.query("SELECT * FROM books ORDER BY id DESC");
      res.json(result.rows);
  } catch (error) {
      console.error("Error fetching books:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
});

// API to Add a New Book
app.post("/books", async (req, res) => {
  const { name, author, category, isbn } = req.body;

  if (!name || !author || !category || !isbn) {
      return res.status(400).json({ error: "All fields are required" });
  }

  try {
      await pool.query(
          "INSERT INTO books (name, author, category, isbn) VALUES ($1, $2, $3, $4)",
          [name, author, category, isbn]
      );
      res.status(201).json({ message: "Book added successfully" });
  } catch (error) {
      console.error("Error adding book:", error);
      res.status(500).json({ error: "Failed to add book" });
  }
});

// API to Delete a Book
app.delete("/books/:id", async (req, res) => {
  const { id } = req.params;

  try {
      await pool.query("DELETE FROM books WHERE id = $1", [id]);
      res.json({ message: "Book deleted successfully" });
  } catch (error) {
      console.error("Error deleting book:", error);
      res.status(500).json({ error: "Failed to delete book" });
  }
});


// Feedback 
// Submit Feedback
app.post("/feedback/submit", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required!" });
    }

    const query = `
      INSERT INTO feedback (message, timestamp)
      VALUES ($1, NOW()) RETURNING *;
    `;
    const values = [message];

    const result = await pool.query(query, values);
    res.status(201).json({ message: "Feedback submitted successfully", feedback: result.rows[0] });

  } catch (error) {
    console.error("Error submitting feedback:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Retrieve All Feedback
app.get("/feedback/all", async (req, res) => {
  try {
    const result = await pool.query("SELECT id, message, timestamp FROM feedback ORDER BY timestamp ASC;");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching feedback:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete Feedback
app.delete("/feedback/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query("DELETE FROM feedback WHERE id = $1 RETURNING *;", [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Feedback not found!" });
    }

    res.json({ message: "Feedback deleted successfully" });
  } catch (error) {
    console.error("Error deleting feedback:", error);
    res.status(500).json({ error: "Failed to delete feedback" });
  }
});


// start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
