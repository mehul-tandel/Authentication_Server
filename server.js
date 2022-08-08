require('dotenv').config();
const fs = require('fs');
const https = require('https');
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const auth =  require('./auth');
const db = require('./database');

const PORT = 3000;

const app = express();

app.use(express.json());

// Login route
app.post('/login', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    let match;

    // get password hash
    const sql = "SELECT pw_hash FROM user_login WHERE email = ?";
    let pw_hash = await db.query(sql, [email]);
    pw_hash = pw_hash[0][0];

    // Compare password hash and send response
    if (pw_hash !== undefined){
        match = await bcrypt.compare(password, pw_hash.pw_hash);
    }
    if (match) {
        const user = { name: email };
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
        res.json({ accessToken: accessToken });
    }
    else {
        res.send("Invalid email or password.");
    }
});

// Register a new user
app.post('/signup', async (req, res) => {
    const sql = `SELECT email FROM user_login WHERE email = ?`;
    const email = req.body.email;
    const password = req.body.password;

    // check if email already exists
    const exist = await db.query(sql, [email]);
    if (exist[0].length === 1) {
        res.status(409).send("Email already exists.");
    }
    else {
        // add new user to database
        const insert = "INSERT INTO user_login (email, pw_hash) VALUES (?,?)"
        const pw_hash = await bcrypt.hash(password,10);
        await db.query(insert,[email,pw_hash]);
        res.status(201).send("User signed up successfully!");
    }
})

// Get some resource if user is authenticated
app.get('/resource',auth.authenticateToken , (req, res) => {
    res.send("==>RESOURCE<==");
})

https.createServer({
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
}, app).listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
})
