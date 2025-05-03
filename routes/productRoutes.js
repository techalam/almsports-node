const express = require("express");
const router = express.Router();
const productController = require("../controllers/products.controller");
const { authenticateToken } = require("../middleware/authMiddleware")

router.get("/collections", productController.getAllCategories);
router.get("/products", productController.getAllProducts);
router.get("/productsById", productController.getProductById);
router.post("/createProduct", authenticateToken, productController.createProduct);
router.put("/updateProduct", authenticateToken, productController.updateProduct);
router.post("/deleteProduct", authenticateToken, productController.deleteProduct);

module.exports = router;
