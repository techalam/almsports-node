const express = require("express");
const collectionRouter = express.Router();
const collectionController = require("../controllers/collections.controller");
const { authenticateToken } = require("../middleware/authMiddleware");

collectionRouter.get("/collections", authenticateToken, collectionController.getAllCollections);
collectionRouter.get("/collectionsByid", authenticateToken, collectionController.getCollectionById);  
collectionRouter.post("/createCollections", authenticateToken, collectionController.createCollection);
collectionRouter.put("/updateCollection", authenticateToken, collectionController.updateCollection);
collectionRouter.post("/deleteCollection", authenticateToken, collectionController.deleteCollection);

module.exports = collectionRouter;
