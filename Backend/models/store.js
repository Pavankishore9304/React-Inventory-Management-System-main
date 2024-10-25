const mysql = require('mysql2');

// Create a connection to the MySQL database
const connection = mysql.createConnection({
  host: '127.0.0.1',      // Replace with your MySQL host (e.g., 127.0.0.1 or a cloud host)
  user: 'root',           // Replace with your MySQL username
  password: 'Pavan@123', // Replace with your MySQL password
  database: 'ims'  // Replace with your MySQL database name
});

// Function to create the Stores table if it doesn't exist
function createStoreTable() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS Stores (
      id INT AUTO_INCREMENT PRIMARY KEY,
      userID INT NOT NULL,
      name VARCHAR(255) NOT NULL,
      category VARCHAR(255) NOT NULL,
      address VARCHAR(255) NOT NULL,
      city VARCHAR(255) NOT NULL,
      image VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (userID) REFERENCES Users(id)
    );
  `;
  connection.query(createTableQuery, (err, result) => {
    if (err) throw err;
    console.log('Stores table created or exists already.');
  });
}

// Call the function to ensure the table is created
createStoreTable();

// Function to add a new store
function addStore(store, callback) {
  const insertStoreQuery = `
    INSERT INTO Stores (userID, name, category, address, city, image)
    VALUES (?, ?, ?, ?, ?, ?);
  `;
  const { userID, name, category, address, city, image } = store;
  connection.query(insertStoreQuery, [userID, name, category, address, city, image], (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
}

// Function to fetch all stores
function getAllStores(callback) {
  const selectStoresQuery = 'SELECT * FROM Stores;';
  connection.query(selectStoresQuery, (err, results) => {
    if (err) return callback(err);
    callback(null, results);
  });
}

// Export the functions for use in other files
module.exports = {
  addStore,
  getAllStores,
};
