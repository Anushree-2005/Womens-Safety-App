require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const multer = require("multer");
const authRoutes = require('./routes/authRoutes');
const path = require("path");
const cors = require("cors");
const app = express();
const db = require('./db');
const twilio = require("twilio");



app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use(express.static('public'));

app.use('/', authRoutes);

app.post('/login', (req, res) => {
    const { userid, password, portal } = req.body;

    if (portal === 'police') {
        // Validate police login (use a predefined static password for police)
        const policePassword = 'police123'; // Static password for police portal
        if (password === policePassword) {
            return res.redirect('/police-portal'); // Redirect to police portal
        } else {
            return res.status(401).send('Invalid Police Password');
        }
    }

    if (portal === 'user') {
        // Validate user login (fetch from MySQL database)
        const query = 'SELECT * FROM users WHERE userid = ? AND password = ?';
        db.query(query, [userid, password], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Server Error');
            }

            if (results.length > 0) {
                return res.redirect('/user-portal'); // Redirect to user portal
            } else {
                return res.status(401).send('Invalid User ID or Password');
            }
        });
    }
});

// Set up storage for uploaded recordings
const storage = multer.diskStorage({
    destination: "./recorded videos",
    filename: (req, file, cb) => {
      cb(`null, recording_${Date.now()}${path.extname(file.originalname)}`);
    },
  });
  
  const upload = multer({ storage });
  
  // Endpoint to handle recording upload
  app.post("/upload-recording", upload.single("video"), (req, res) => {
    if (req.file) {
      console.log("File uploaded successfully:", req.file);
      res.status(200).send("File uploaded successfully!");
    } else {
      res.status(400).send("No file uploaded.");
    }
  });
    
app.use(cors());
app.use(express.json());



// API to fetch user details by User ID ✅
app.get("/getUser/:userid", (req, res) => {
    const userid = req.params.userid;
    const query = "SELECT * FROM users WHERE id = ?";
    
    db.query(query, [userid], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(result);
        }
    });
});
 

// Save Feedback API ✅
app.post("/submit-feedback", (req, res) => {
    const { rating, email, message } = req.body;

    if (!rating || !email || !message ) {
        return res.status(400).json({ error: "Rating, email and message are required!" });
    }

    const sql = "INSERT INTO feedback (rating, email, message) VALUES (?, ?, ?)";
    db.query(sql, [rating, email, message], (err, result) => {
        if (err) {
            console.error("Error inserting data:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json({ success: true, message: "Feedback submitted successfully!" });
    });
});


const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});