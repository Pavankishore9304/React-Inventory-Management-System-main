const mysql = require("mysql2");

// MySQL database connection
const connection = mysql.createConnection({
  host: '127.0.0.1',      // Replace with your MySQL host (e.g., 127.0.0.1 or a cloud host)
  user: 'root',           // Replace with your MySQL username
  password: 'Pavan@123', // Replace with your MySQL password
  database: 'ims'  // Replace with your MySQL database name
});

// Function to update sold stock
const soldStock = (productID, stockSoldData) => {
  // Fetch the current stock and update it
  const getProductStockQuery = `SELECT stock FROM Products WHERE id = ?`;

  connection.query(getProductStockQuery, [productID], (err, results) => {
    if (err) {
      return console.error("Error fetching product stock", err);
    }

    const currentStock = results[0]?.stock || 0; // Fallback to 0 if no result
    const updatedStock = currentStock - stockSoldData;

    console.log("MY SOLD STOCK: ", updatedStock);

    // Update the product stock in the database
    const updateStockQuery = `UPDATE Products SET stock = ? WHERE id = ?`;

    connection.query(updateStockQuery, [updatedStock, productID], (err, updateResult) => {
      if (err) {
        return console.error("Error updating sold stock", err);
      }
      console.log("Sold stock updated successfully", updateResult);
    });
  });
};

module.exports = soldStock;
