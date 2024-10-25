const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
const PORT = 4000;

// MySQL database connection
const db = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "Pavan@123", // Use your MySQL password
  database: "ims", // Your MySQL database name
  multipleStatements: true, // Enable multiple statements if necessary
});

// Test the MySQL connection
db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    process.exit(1);
  } else {
    console.log("Connected to MySQL database successfully!");
  }
});

app.use(express.json());
app.use(cors());

// ---------------- User Authentication ----------------

// Variable to store logged-in user details (for session purposes)
let userAuthCheck = null;

// User Login API
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
  db.query(sql, [email, password], (err, result) => {
    if (err) {
      console.error("Error during login:", err);
      return res.status(500).json({ message: "Server Error" });
    }
    if (result.length > 0) {
      userAuthCheck = result[0]; // Save user details for later use
      return res.status(200).json(result[0]); // Send user data back
    } else {
      userAuthCheck = null;
      return res.status(401).json({ message: "Invalid Credentials" });
    }
  });
});

// Get Logged-in User Details
app.get("/api/login", (req, res) => {
  if (userAuthCheck) {
    res.status(200).json(userAuthCheck);
  } else {
    res.status(401).json({ message: "No user logged in" });
  }
});

// User Registration API
app.post("/api/register", (req, res) => {
  const { firstName, lastName, email, password, phoneNumber, imageUrl } = req.body;

  if (!firstName || !lastName || !email || !password || !phoneNumber || !imageUrl) {
    return res.status(400).json({ message: "Please fill in all required fields." });
  }

  const sql = "INSERT INTO users (firstName, lastName, email, password, phoneNumber, imageUrl) VALUES (?, ?, ?, ?, ?, ?)";
  const values = [firstName, lastName, email, password, phoneNumber, imageUrl];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Registration failed:", err);
      return res.status(500).json({ message: "Registration Failed" });
    }
    return res.status(200).json({ message: "User registered successfully" });
  });
});

// ---------------- Sales Routes ----------------

app.get('/api/sales/get/:userId/totalsaleamount', (req, res) => {
  const userId = req.params.userId;
  const query = 'SELECT SUM(amount) AS totalSaleAmount FROM sales WHERE user_id = ?';

  db.query(query, [userId], (err, result) => {
    if (err) {
      return res.status(500).send("Error fetching sale amount.");
    }
    res.json(result[0]);
  });
});

app.get('/api/sales/get/:userId/totalpurchaseamount', (req, res) => {
  const userId = req.params.userId;
  const query = 'SELECT SUM(amount) AS totalPurchaseAmount FROM purchases WHERE user_id = ?';

  db.query(query, [userId], (err, result) => {
    if (err) {
      return res.status(500).send("Error fetching purchase amount.");
    }
    res.json(result[0]);
  });
});

app.get('/api/sales/get/:userId/stores', (req, res) => {
  const userId = req.params.userId;
  const query = 'SELECT * FROM stores WHERE user_id = ?';

  db.query(query, [userId], (err, result) => {
    if (err) {
      return res.status(500).send("Error fetching stores data.");
    }
    res.json(result);
  });
});

app.get('/api/sales/get/:userId/products', (req, res) => {
  const userId = req.params.userId;
  const query = 'SELECT * FROM products WHERE user_id = ?';

  db.query(query, [userId], (err, result) => {
    if (err) {
      return res.status(500).send("Error fetching products data.");
    }
    res.json(result);
  });
});

app.get('/api/sales/getmonthly/:userId', (req, res) => {
  const userId = req.params.userId;
  const query = `
    SELECT MONTH(sale_date) AS month, SUM(amount) AS salesAmount
    FROM sales
    WHERE user_id = ?
    GROUP BY MONTH(sale_date)
  `;

  db.query(query, [userId], (err, result) => {
    if (err) {
      return res.status(500).send("Error fetching monthly sales data.");
    }
    res.json(result);
  });
});

// ---------------- Test Endpoint (Fetching Product Details) ----------------
app.get("/testget", (req, res) => {
  const sql = "SELECT * FROM products WHERE id = ?";
  const productId = '1'; // Sample productId; you can modify it to accept dynamic IDs

  db.query(sql, [productId], (err, result) => {
    if (err) {
      console.error("Error fetching product:", err);
      return res.status(500).json({ message: "Error fetching product" });
    }
    return res.json(result[0]); // Return the product details
  });
});

// ---------------- Error Handling for Undefined Routes ----------------
app.use((req, res) => {
  res.status(404).json({ message: "Endpoint not found" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
