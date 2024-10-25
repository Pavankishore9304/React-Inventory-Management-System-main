const mysql = require("mysql2");
const soldStock = require("./soldStock");

// MySQL database connection
const connection = mysql.createConnection({
  host: '127.0.0.1',      // Replace with your MySQL host (e.g., 127.0.0.1 or a cloud host)
  user: 'root',           // Replace with your MySQL username
  password: 'Pavan@123', // Replace with your MySQL password
  database: 'ims'  // Replace with your MySQL database name
});

// Add Sales
const addSales = (req, res) => {
  const { userID, productID, storeID, stockSold, saleDate, totalSaleAmount } = req.body;

  const insertSaleQuery = `
    INSERT INTO Sales (userID, ProductID, StoreID, StockSold, SaleDate, TotalSaleAmount)
    VALUES (?, ?, ?, ?, ?, ?);
  `;

  connection.query(insertSaleQuery, [userID, productID, storeID, stockSold, saleDate, totalSaleAmount], (err, result) => {
    if (err) {
      return res.status(402).send(err);
    }

    // Update stock after sale
    soldStock(productID, stockSold);
    res.status(200).send(result);
  });
};

// Get All Sales Data
const getSalesData = (req, res) => {
  const { userID } = req.params;

  const getSalesDataQuery = `
    SELECT Sales.*, Products.name AS ProductName, Stores.name AS StoreName
    FROM Sales
    JOIN Products ON Sales.ProductID = Products.id
    JOIN Stores ON Sales.StoreID = Stores.id
    WHERE Sales.userID = ?
    ORDER BY Sales.id DESC;
  `;

  connection.query(getSalesDataQuery, [userID], (err, results) => {
    if (err) {
      return res.status(500).json(err);
    }
    res.json(results);
  });
};

// Get total sales amount
const getTotalSalesAmount = (req, res) => {
  const { userID } = req.params;

  const getTotalSalesQuery = `
    SELECT SUM(TotalSaleAmount) AS totalSaleAmount
    FROM Sales
    WHERE userID = ?;
  `;

  connection.query(getTotalSalesQuery, [userID], (err, results) => {
    if (err) {
      return res.status(500).json(err);
    }

    const totalSaleAmount = results[0].totalSaleAmount || 0;
    res.json({ totalSaleAmount });
  });
};

// Get monthly sales
const getMonthlySales = (req, res) => {
  const getMonthlySalesQuery = `SELECT * FROM Sales`;

  connection.query(getMonthlySalesQuery, (err, sales) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Server error" });
    }

    // Initialize array with 12 zeros
    const salesAmount = new Array(12).fill(0);

    sales.forEach((sale) => {
      const monthIndex = parseInt(sale.SaleDate.split("-")[1]) - 1;

      if (!isNaN(monthIndex)) {
        salesAmount[monthIndex] += sale.TotalSaleAmount;
      }
    });

    res.status(200).json({ salesAmount });
  });
};

module.exports = { addSales, getMonthlySales, getSalesData, getTotalSalesAmount };
