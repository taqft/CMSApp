require('dotenv').config()
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PW,
  database: process.env.DB_NAME
}).promise();

module.exports = connection;
