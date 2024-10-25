const express = require("express");
const app = express();
const store = require("../controller/store");

// Middleware to parse JSON request body
app.use(express.json()); // Ensure this is included to parse incoming JSON data

// Add Store
app.post("/add", store.addStore);

// Get All Stores
app.get("/get/:userID", store.getAllStores);

// Example URLs
// POST: http://localhost:4000/api/store/add
// GET: http://localhost:4000/api/store/get/:userID

module.exports = app;
