const mysql = require('mysql2');

// Create a connection to the MySQL database
const connection = mysql.createConnection({
    host: '127.0.0.1',      // Replace with your MySQL host (e.g., 127.0.0.1 or a cloud host)
    user: 'root',           // Replace with your MySQL username
    password: 'Pavan@123', // Replace with your MySQL password
    database: 'ims'  // Replace with your MySQL database name
  });

// Function to create the Users table if it doesn't exist
function createUserTable() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS Users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      firstName VARCHAR(255) NOT NULL,
      lastName VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      phoneNumber BIGINT,
      imageUrl VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `;
  connection.query(createTableQuery, (err, result) => {
    if (err) throw err;
    console.log('Users table created or exists already.');
  });
}

// Call the function to ensure the table is created
createUserTable();

// Function to add a new user
function addUser(user, callback) {
  const insertUserQuery = `
    INSERT INTO Users (firstName, lastName, email, password, phoneNumber, imageUrl)
    VALUES (?, ?, ?, ?, ?, ?);
  `;
  const { firstName, lastName, email, password, phoneNumber, imageUrl } = user;
  connection.query(insertUserQuery, [firstName, lastName, email, password, phoneNumber, imageUrl], (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
}

// Function to fetch all users
function getAllUsers(callback) {
  const selectUsersQuery = 'SELECT * FROM Users;';
  connection.query(selectUsersQuery, (err, results) => {
    if (err) return callback(err);
    callback(null, results);
  });
}

// Export the functions for use in other files
module.exports = {
  addUser,
  getAllUsers,
};
