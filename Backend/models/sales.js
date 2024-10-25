const mysql = require('mysql2');

// Create a connection to the MySQL database
const connection = mysql.createConnection({
  host: '127.0.0.1',      // Replace with your MySQL host (e.g., 127.0.0.1 or a cloud host)
  user: 'root',           // Replace with your MySQL username
  password: 'Pavan@123', // Replace with your MySQL password
  database: 'ims'  // Replace with your MySQL database name
});

// Function to create the Sales table if it doesn't exist
function createSalesTable() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS Sales (
      id INT AUTO_INCREMENT PRIMARY KEY,
      userID INT NOT NULL,
      ProductID INT NOT NULL,
      StoreID INT NOT NULL,
      StockSold INT NOT NULL,
      SaleDate VARCHAR(255) NOT NULL,
      TotalSaleAmount DECIMAL(10, 2) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (userID) REFERENCES Users(id),
      FOREIGN KEY (ProductID) REFERENCES Products(id),
      FOREIGN KEY (StoreID) REFERENCES Stores(id)
    );
  `;
  connection.query(createTableQuery, (err, result) => {
    if (err) throw err;
    console.log('Sales table created or exists already.');
  });
}

// Call the function to ensure the table is created
createSalesTable();

// Function to add a new sale
function addSale(sale, callback) {
  const insertSaleQuery = `
    INSERT INTO Sales (userID, ProductID, StoreID, StockSold, SaleDate, TotalSaleAmount)
    VALUES (?, ?, ?, ?, ?, ?);
  `;
  const { userID, ProductID, StoreID, StockSold, SaleDate, TotalSaleAmount } = sale;
  connection.query(insertSaleQuery, [userID, ProductID, StoreID, StockSold, SaleDate, TotalSaleAmount], (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
}

// Function to fetch all sales
function getAllSales(callback) {
  const selectSalesQuery = 'SELECT * FROM Sales;';
  connection.query(selectSalesQuery, (err, results) => {
    if (err) return callback(err);
    callback(null, results);
  });
}

// Export the functions for use in other files
module.exports = {
  addSale,
  getAllSales,
};
