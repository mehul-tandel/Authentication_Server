const mysql = require('mysql2');

module.exports = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'users-credentials',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
}).promise();

