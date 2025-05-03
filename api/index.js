const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Create an Express app
const app = express();
app.use(cors());
app.use(express.json());

// Define your routes
const authRoutes = require("../routes/authRoutes");
const collectionRouter = require("../routes/collectionRoutes");
const productsRoutes = require("../routes/productRoutes");
const catalougeRouter = require("../routes/catalougeRoutes");

app.get('/', (req, res) => {
  res.json({ message: 'Hello from Express on Vercel!' });
});
app.use("/api/auth", authRoutes);
app.use("/api/collections", collectionRouter);
app.use("/api/products", productsRoutes);
app.use("/api/catalouges", catalougeRouter);

// Export the handler function
module.exports = (req, res) => {
  app(req, res);  // Vercel expects a function that handles the request directly
};
