const mysql = require("mysql");

// DB Config
const db = mysql.createPool({
  connectionLimit: 1000,
  connectTimeout: 60 * 60 * 1000,
  acquireTimeout: 60 * 60 * 1000,
  timeout: 60 * 60 * 1000,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: 3306,
  multipleStatements: true
});

db.getConnection((err) => {
  if (err) {
    return console.error(err);
  }
  console.log('Established connection with db_herb mySQL server.');
});

module.exports = { db };
