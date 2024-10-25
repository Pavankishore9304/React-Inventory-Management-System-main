const express = require("express");
const app = express();
const product = require("../controller/product");

// Middleware to parse JSON request body
app.use(express.json()); // Ensure this is included to parse incoming JSON data

// Add Product
app.post("/add", product.addProduct);

// Get All Products
app.get("/get/:userId", product.getAllProducts);

// Delete Selected Product Item
app.delete("/delete/:id", product.deleteSelectedProduct); // Use DELETE for better RESTful practices

// Update Selected Product
app.put("/update", product.updateSelectedProduct); // Use PUT for update operations

// Search Product
app.get("/search", product.searchProduct);

// Example: http://localhost:4000/api/product/search?searchTerm=fa

module.exports = app;
