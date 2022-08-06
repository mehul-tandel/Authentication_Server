const mysql = require('mysql2');

// database connection pool
module.exports = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: process.env.DB_SECRET,
    database: 'users_credentials',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
}).promise();

