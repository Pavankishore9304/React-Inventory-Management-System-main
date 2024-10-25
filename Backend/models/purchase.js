const mysql = require('mysql2');

// Create a connection to the MySQL database
const connection = mysql.createConnection({
  host: '127.0.0.1',      // Replace with your MySQL host (e.g., 127.0.0.1 or a cloud host)
  user: 'root',           // Replace with your MySQL username
  password: 'Pavan@123', // Replace with your MySQL password
  database: 'ims'  // Replace with your MySQL database name
});
// Function to create the Purchases table if it doesn't exist
function createPurchaseTable() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS Purchases (
      id INT AUTO_INCREMENT PRIMARY KEY,
      userID INT NOT NULL,
      ProductID INT NOT NULL,
      QuantityPurchased INT NOT NULL,
      PurchaseDate VARCHAR(255) NOT NULL,
      TotalPurchaseAmount DECIMAL(10, 2) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (userID) REFERENCES Users(id),
      FOREIGN KEY (ProductID) REFERENCES Products(id)
    );
  `;
  connection.query(createTableQuery, (err, result) => {
    if (err) throw err;
    console.log('Purchases table created or exists already.');
  });
}

// Call the function to ensure the table is created
createPurchaseTable();

// Function to add a new purchase
function addPurchase(purchase, callback) {
  const insertPurchaseQuery = `
    INSERT INTO Purchases (userID, ProductID, QuantityPurchased, PurchaseDate, TotalPurchaseAmount)
    VALUES (?, ?, ?, ?, ?);
  `;
  const { userID, ProductID, QuantityPurchased, PurchaseDate, TotalPurchaseAmount } = purchase;
  connection.query(insertPurchaseQuery, [userID, ProductID, QuantityPurchased, PurchaseDate, TotalPurchaseAmount], (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
}

// Function to fetch all purchases
function getAllPurchases(callback) {
  const selectPurchasesQuery = 'SELECT * FROM Purchases;';
  connection.query(selectPurchasesQuery, (err, results) => {
    if (err) return callback(err);
    callback(null, results);
  });
}

// Export the functions for use in other files
module.exports = {
  addPurchase,
  getAllPurchases,
};
