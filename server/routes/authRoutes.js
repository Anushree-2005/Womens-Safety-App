require('dotenv').config();
const express = require('express');
const router = express.Router();
const db = require('../db');
const session = require('express-session');
const nodemailer = require('nodemailer');

// Registration ✅

router.post('/register', (req, res) => {
    const { profile_image, name, phone, email, userid, password, relation1, Gphone1, relation2, Gphone2} = req.body;
    const query = 'INSERT INTO users (profile_image,name, phone, email, userid, password, relation1, Gphone1, relation2, Gphone2) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(query, [profile_image,name, phone, email, userid, password, relation1, Gphone1, relation2, Gphone2], (err, result) => {
        if (err) {
            res.status(500).send('Registration failed'+err);
        } else {
            res.redirect('/login.html');
        }
    });
});

// Login ✅
router.post('/login', (req, res) => {
    const { userid, password } = req.body;
    const policePassword = "police123"; // Specific password for police login

    if (userid === 'police' && password === policePassword) {
        return res.redirect('/police-portal.html'); //redirect to the police portal page
    }

    const query = 'SELECT * FROM users WHERE userid = ? AND password = ?';
    db.query(query, [userid, password], (err, results) => {
        if (results.length > 0) {
            res.redirect('/user-portal.html') //redirect to the user portal page
        } else {
            res.status(401).send('Invalid credentials');
        }
    });
});


router.use(session({
    secret: 'secretKey',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 300000 } // 5 minutes expiry
}));

// Nodemailer Transporter Setup ✅
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "rakshakwomenssafety@gmail.com",
        pass: "cmor zrzm qpxq vven"
    }
});

// Generate OTP ✅
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
}

// Send OTP ✅
router.post('/send-otp', (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    const otp = generateOTP();
    req.session.otp = otp;
    req.session.email = email;

    const mailOptions = {
        from: "rakshakwomenssafety@gmail.com",
        to: email,
        subject: "Email Verification OTP",
        text: `Your OTP for verification is ${otp}. It will expire in 5 minutes.`
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Failed to send OTP" });
        }
        res.json({ message: "OTP sent successfully" });
    });
});

// Verify OTP ✅
router.post('/verify-otp', (req, res) => {
    const { email, otp } = req.body;
    
    if (!email || !otp) {
        return res.status(400).json({ message: "Email and OTP are required" });
    }

    if (req.session.otp && req.session.email === email && req.session.otp == otp) {
        req.session.otp = null; // Clear OTP after successful verification
        res.json({ message: "OTP verified successfully" });
    } else {
        res.status(400).json({ message: "Invalid OTP or OTP expired" });
    }
});

// Fetch User Profile by ID ✅
router.get('/get-user/:id', (req, res) => {
    const userId = req.params.id;
    
    const query = `SELECT name, phone, email, profile_image, relation1, Gphone1, relation2, Gphone2 FROM users WHERE userid = ?`;

    db.query(query, [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database query failed' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(results[0]);
    });
});


module.exports = router;