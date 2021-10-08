const mysql = require('mysql');

const db = mysql.createPool({
  connectionLimit: 1000,
  connectTimeout: 60 * 60 * 1000,
  acquireTimeout: 60 * 60 * 1000,
  timeout: 60 * 60 * 1000,
  host: '103.166.156.201',
  user: 'dev',
  password: 'password',
  database: 'db_herb',
  port: 3306,
  multipleStatements: true,
});

db.getConnection((err) => {
  if (err) {
    return console.error(err);
  }
  console.log('Established connection with db_herb mySQL server.');
});

module.exports = { db };
