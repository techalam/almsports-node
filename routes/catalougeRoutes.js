const express = require("express");
const catalougeRouter = express.Router();
const catalougeController = require("../controllers/catalouges.controller");
const { authenticateToken } = require("../middleware/authMiddleware");

catalougeRouter.get("/catalouges", authenticateToken, catalougeController.getAllCatalouges);
catalougeRouter.get("/catalougeById", authenticateToken, catalougeController.getCatalougeById);
catalougeRouter.post("/createCatalouge", authenticateToken, catalougeController.createCatalouge);
catalougeRouter.put("/updateCatalouge", authenticateToken, catalougeController.updateCatalouge);
catalougeRouter.post("/deleteCatalouge", authenticateToken, catalougeController.deleteCatalouge);
catalougeRouter.post("/addProductToCatalouge", authenticateToken, catalougeController.addProductsUnderCatalouge);
catalougeRouter.get("/getProductsUnderCatalouge", catalougeController.getProductsByCatalogueId);

module.exports = catalougeRouter;