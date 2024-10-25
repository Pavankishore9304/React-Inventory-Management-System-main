const mysql = require('mysql2');

// Create a connection to the MySQL database
const connection = mysql.createConnection({
  host: '127.0.0.1',      // Replace with your MySQL host (e.g., 127.0.0.1 or a cloud host)
  user: 'root',           // Replace with your MySQL username
  password: 'Pavan@123', // Replace with your MySQL password
  database: 'ims'  // Replace with your MySQL database name
});

// Function to create the Products table if it doesn't exist
function createProductTable() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS Products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      userID INT NOT NULL,
      name VARCHAR(255) NOT NULL,
      manufacturer VARCHAR(255) NOT NULL,
      stock INT NOT NULL,
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `;
  connection.query(createTableQuery, (err, result) => {
    if (err) throw err;
    console.log('Products table created or exists already.');
  });
}

// Call the function to ensure the table is created
createProductTable();

// Function to add a new product
function addProduct(product, callback) {
  const insertProductQuery = `
    INSERT INTO Products (userID, name, manufacturer, stock, description)
    VALUES (?, ?, ?, ?, ?);
  `;
  const { userID, name, manufacturer, stock, description } = product;
  connection.query(insertProductQuery, [userID, name, manufacturer, stock, description], (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
}

// Function to fetch all products
function getAllProducts(callback) {
  const selectProductsQuery = 'SELECT * FROM Products;';
  connection.query(selectProductsQuery, (err, results) => {
    if (err) return callback(err);
    callback(null, results);
  });
}

// Export the functions for use in other files
module.exports = {
  addProduct,
  getAllProducts,
};
