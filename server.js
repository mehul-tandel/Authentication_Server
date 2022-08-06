require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const auth =  require('./auth');
const db = require('./database');

const app = express();

app.use(express.json());

// Login route
app.post('/login', (req, res) => {
    // authenticate user
    const username = req.body.username;
    const user = { name: username };
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
    res.json({ accessToken: accessToken });
});

// Register a new user
app.post('/signup', async (req, res) => {
    const sql = `SELECT email FROM user_login WHERE email = ?`;
    const email = req.body.username;
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

// Get the list of all users
app.get('/users', (req, res) => {
    const sql = "SELECT email FROM user_login;";
    db.query(sql)
    .then(result => res.send(JSON.stringify(result[0])))
    .catch(err => console.log(err));
})



app.listen(3000);