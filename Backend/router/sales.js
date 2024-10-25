const express = require("express");
const app = express();
const sales = require("../controller/sales");

// Middleware to parse JSON request body
app.use(express.json()); // Ensure this is included to parse incoming JSON data

// Add Sales
app.post("/add", sales.addSales);

// Get All Sales Data
app.get("/get/:userID", sales.getSalesData);

// Get Monthly Sales Data
app.get("/getmonthly", sales.getMonthlySales);

// Get Total Sales Amount
app.get("/get/:userID/totalsaleamount", sales.getTotalSalesAmount);

// Example URLs
// POST: http://localhost:4000/api/sales/add
// GET: http://localhost:4000/api/sales/get/:userID
// GET: http://localhost:4000/api/sales/getmonthly
// GET: http://localhost:4000/api/sales/get/:userID/totalsaleamount

module.exports = app;
