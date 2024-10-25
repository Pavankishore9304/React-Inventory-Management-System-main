const mysql = require('mysql2');

// MySQL connection URI and credentials
const connection = mysql.createConnection({
  host: '127.0.0.1',      // Replace with your MySQL host (e.g., 127.0.0.1 or a cloud host)
  user: 'root',           // Replace with your MySQL username
  password: 'Pavan@123', // Replace with your MySQL password
  database: 'ims'  // Replace with your MySQL database name
});

function main() {
  // Connect to MySQL
  connection.connect((err) => {
    if (err) {
      console.log("Error connecting to MySQL: ", err);
      return;
    }
    console.log("Successfully connected to MySQL!");
  });
}

module.exports = { main };
