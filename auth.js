const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const saltRounds = 10;

exports.authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(403);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}


exports.generateHash = (req, res, next) => {
    const password = req.body.password;
    const hash = bcrypt.hash(password, saltRounds)
    // store this hash in database
}

exports.compareHash = (req, res, next) => {
    const user = req.body.email;
    const password = req.body.password;
    //const hash = get hash of user from database
    const result = bcrypt.compare(password, hash);
}