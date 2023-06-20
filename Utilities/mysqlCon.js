const mysql = require("mysql2");
const createConnection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "nescatweb",
});

module.exports = createConnection;
