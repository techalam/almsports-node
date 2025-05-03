const express = require("express");
const router = express.Router();
const productController = require("../controllers/products.controller");
const { authenticateToken } = require("../middleware/authMiddleware")

router.get("/collections", authenticateToken, productController.getAllCategories);
router.get("/products", authenticateToken, productController.getAllProducts);
router.get("/productsById", productController.getProductById);
router.post("/createProduct", authenticateToken, productController.createProduct);
router.put("/updateProduct", authenticateToken, productController.updateProduct);
router.post("/deleteProduct", authenticateToken, productController.deleteProduct);

module.exports = router;
