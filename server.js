
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/authRoutes");
const collectionRouter = require("./routes/collectionRoutes");
const productsRoutes = require("./routes/productRoutes");
const catalougeRouter = require("./routes/catalougeRoutes");
app.use("/api/auth", authRoutes);

app.use("/api/collections", collectionRouter);
app.use("/api/products", productsRoutes);
app.use("/api/catalouges", catalougeRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
