const mysql2 = require("mysql2");


const connection = mysql2.createConnection({
    host: "localhost",
    user: "root",
    password: "deathnote@37",
    database: "netflix",
    port: 3306
  }, console.log("Database Connected"));

  module.exports = connection;