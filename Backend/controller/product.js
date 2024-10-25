const mysql = require("mysql2");

// MySQL connection setup
const db = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "Pavan@123", // Use your MySQL password
  database: "my_db", // Your MySQL database name
});

// Add Product
exports.addProduct = (req, res) => {
  const { name, price, description, userId } = req.body;

  const sql = "INSERT INTO products (name, price, description, userId) VALUES (?, ?, ?, ?)";
  const values = [name, price, description, userId];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error adding product:", err);
      return res.status(500).json({ error: "Error adding product" });
    }

    // Fetch the newly added product and return it in the response
    db.query("SELECT * FROM products WHERE id = ?", [result.insertId], (err, newProduct) => {
      if (err) {
        console.error("Error fetching new product:", err);
        return res.status(500).json({ error: "Error fetching new product" });
      }
      return res.status(201).json(newProduct[0]); // Return the added product
    });
  });
};

// Get All Products by userId
exports.getAllProducts = (req, res) => {
  const userId = req.params.userId;

  const sql = "SELECT * FROM products WHERE userId = ?";
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching products:", err);
      return res.status(500).json({ error: "Error fetching products" });
    }

    return res.status(200).json(results);
  });
};

// Delete Selected Product
exports.deleteSelectedProduct = (req, res) => {
  const productId = req.params.id;

  const sql = "DELETE FROM products WHERE id = ?";
  db.query(sql, [productId], (err, result) => {
    if (err) {
      console.error("Error deleting product:", err);
      return res.status(500).json({ error: "Error deleting product" });
    }

    return res.status(200).json({ message: "Product deleted successfully" });
  });
};

// Update Selected Product
exports.updateSelectedProduct = (req, res) => {
  const { id, name, price, description } = req.body;

  const sql = "UPDATE products SET name = ?, price = ?, description = ? WHERE id = ?";
  db.query(sql, [name, price, description, id], (err, result) => {
    if (err) {
      console.error("Error updating product:", err);
      return res.status(500).json({ error: "Error updating product" });
    }

    return res.status(200).json({ message: "Product updated successfully" });
  });
};

// Search Products
exports.searchProduct = (req, res) => {
  const searchTerm = req.query.searchTerm;
  
  const sql = "SELECT * FROM products WHERE name LIKE ?";
  db.query(sql, [`%${searchTerm}%`], (err, results) => {
    if (err) {
      console.error("Error searching products:", err);
      return res.status(500).json({ error: "Error searching products" });
    }

    return res.status(200).json(results);
  });
};
