require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');

const auth =  require('./auth');
const db = require('./database');

const app = express();

// Allowing CORS(Cross Origin Resource Sharing)
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "OPTIONS, GET, POST, PUT, PATCH, DELETE"
    );
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});

app.use(express.json());

app.get('/posts', auth.authenticateToken , (req, res) => {
    res.json(posts.filter(post => post.username === req.user.name));
});

app.post('/login', (req, res) => {
    // authenticate user
    const username = req.body.username;
    const user = { name: username };
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
    res.json({ accessToken: accessToken });
});

app.post('/signup', (req, res) => {
    const check = "EXISTS (SELECT 1 FROM user_login WHERE email ='$1')";
    const email = req.body.username;
    const password = req.body.password;
    console.log(email);
    // check if email already exists and then add to database
    db.query(
        `SELECT ${check};`,
        [email]
    ).then(res => console.log(res[0][0][check]))
    .catch(err => console.log(err));
})

app.post('/something', (req,res) => {
    const name = req.body.name;
    console.log(name);
})



app.listen(3000);