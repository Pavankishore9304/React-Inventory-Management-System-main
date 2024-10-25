const express = require("express");
const app = express();
const purchase = require("../controller/purchase");

// Middleware to parse JSON request body
app.use(express.json()); // Ensure this is included to parse incoming JSON data

// Add Purchase
app.post("/add", purchase.addPurchase);

// Get All Purchase Data
app.get("/get/:userID", purchase.getPurchaseData);

// Get Total Purchase Amount
app.get("/get/:userID/totalpurchaseamount", purchase.getTotalPurchaseAmount);

// Example URLs
// POST: http://localhost:4000/api/purchase/add
// GET: http://localhost:4000/api/purchase/get/:userID
// GET: http://localhost:4000/api/purchase/get/:userID/totalpurchaseamount

module.exports = app;
