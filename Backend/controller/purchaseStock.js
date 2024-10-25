const mysql = require("mysql2");

// MySQL database connection
const connection = mysql.createConnection({
  host: '127.0.0.1',      // Replace with your MySQL host (e.g., 127.0.0.1 or a cloud host)
  user: 'root',           // Replace with your MySQL username
  password: 'Pavan@123', // Replace with your MySQL password
  database: 'ims'  // Replace with your MySQL database name
});

// Function to update the product stock
const purchaseStock = (productID, purchaseStockData) => {
  // Fetch the current stock and update it
  const getProductStockQuery = `SELECT stock FROM Products WHERE id = ?`;

  connection.query(getProductStockQuery, [productID], (err, results) => {
    if (err) {
      console.error("Error fetching product stock", err);
      return;
    }

    // Calculate the new stock
    const currentStock = results[0]?.stock || 0;
    const updatedStock = currentStock + purchaseStockData;

    // Update the product stock in the database
    const updateStockQuery = `UPDATE Products SET stock = ? WHERE id = ?`;

    connection.query(updateStockQuery, [updatedStock, productID], (err, updateResult) => {
      if (err) {
        console.error("Error updating product stock", err);
        return;
      }
      console.log("Stock updated successfully", updateResult);
    });
  });
};

module.exports = purchaseStock;
