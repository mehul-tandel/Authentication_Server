require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');

const authenticateToken = require('./auth');

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

const posts = [
    {
        username: 'mehul',
        title: 'Post 1'
    },
    {
        username: 'sid',
        title: 'Post 2'
    }
]

app.get('/posts',authenticateToken , (req, res) => {
    res.json(posts.filter(post => post.username === req.user.name));
});

app.post('/login', (req, res) => {
    // authenticate user
    const username = req.body.username;
    const user = { name: username };
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
    res.json({ accessToken: accessToken });
})



app.listen(3000);