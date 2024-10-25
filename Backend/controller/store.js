const mysql = require("mysql2");

// MySQL database connection
const connection = mysql.createConnection({
  host: '127.0.0.1',      // Replace with your MySQL host (e.g., 127.0.0.1 or a cloud host)
  user: 'root',           // Replace with your MySQL username
  password: 'Pavan@123', // Replace with your MySQL password
  database: 'ims'  // Replace with your MySQL database name
});

// Add Store
const addStore = (req, res) => {
  const { userId, name, category, address, city, image } = req.body;

  const insertStoreQuery = `
    INSERT INTO Stores (userID, name, category, address, city, image)
    VALUES (?, ?, ?, ?, ?, ?);
  `;

  connection.query(insertStoreQuery, [userId, name, category, address, city, image], (err, result) => {
    if (err) {
      return res.status(402).send(err);
    }
    res.status(200).send(result);
  });
};

// Get All Stores
const getAllStores = (req, res) => {
  const { userID } = req.params;

  const getAllStoresQuery = `
    SELECT * FROM Stores 
    WHERE userID = ? 
    ORDER BY id DESC;
  `;

  connection.query(getAllStoresQuery, [userID], (err, results) => {
    if (err) {
      return res.status(500).json(err);
    }
    res.json(results);
  });
};

module.exports = { addStore, getAllStores };
