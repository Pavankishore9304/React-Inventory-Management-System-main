const mysql = require("mysql2");
const purchaseStock = require("./purchaseStock");

// MySQL database connection
const connection = mysql.createConnection({
  host: '127.0.0.1',      // Replace with your MySQL host (e.g., 127.0.0.1 or a cloud host)
  user: 'root',           // Replace with your MySQL username
  password: 'Pavan@123', // Replace with your MySQL password
  database: 'ims'  // Replace with your MySQL database name
});

// Add Purchase Details
const addPurchase = (req, res) => {
  const { userID, productID, quantityPurchased, purchaseDate, totalPurchaseAmount } = req.body;

  const insertPurchaseQuery = `
    INSERT INTO Purchases (userID, ProductID, QuantityPurchased, PurchaseDate, TotalPurchaseAmount)
    VALUES (?, ?, ?, ?, ?);
  `;

  connection.query(insertPurchaseQuery, [userID, productID, quantityPurchased, purchaseDate, totalPurchaseAmount], (err, result) => {
    if (err) {
      return res.status(402).send(err);
    }

    // Update stock after purchase
    purchaseStock(productID, quantityPurchased);
    res.status(200).send(result);
  });
};

// Get All Purchase Data
const getPurchaseData = (req, res) => {
  const { userID } = req.params;

  const getPurchaseDataQuery = `
    SELECT Purchases.*, Products.name AS ProductName, Products.manufacturer AS ProductManufacturer
    FROM Purchases
    JOIN Products ON Purchases.ProductID = Products.id
    WHERE Purchases.userID = ?
    ORDER BY Purchases.id DESC;
  `;

  connection.query(getPurchaseDataQuery, [userID], (err, results) => {
    if (err) {
      return res.status(500).json(err);
    }
    res.json(results);
  });
};

// Get total purchase amount
const getTotalPurchaseAmount = (req, res) => {
  const { userID } = req.params;

  const getTotalAmountQuery = `
    SELECT SUM(TotalPurchaseAmount) AS totalPurchaseAmount
    FROM Purchases
    WHERE userID = ?;
  `;

  connection.query(getTotalAmountQuery, [userID], (err, results) => {
    if (err) {
      return res.status(500).json(err);
    }

    const totalPurchaseAmount = results[0].totalPurchaseAmount || 0;
    res.json({ totalPurchaseAmount });
  });
};

module.exports = { addPurchase, getPurchaseData, getTotalPurchaseAmount };
