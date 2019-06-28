const mysql = require('mysql2/index');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'portfolio',
    password: 'choose2life'
});


module.exports = pool.promise();