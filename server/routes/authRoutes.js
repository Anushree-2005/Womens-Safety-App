const express = require('express');
const router = express.Router();
const db = require('../db');

// Registration

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

// Login
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

module.exports = router;