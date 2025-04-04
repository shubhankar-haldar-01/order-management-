const express = require("express");
const ProductController = require("../controllers/product.controller");
const {authenticate, authorize} = require("../middlewares/auth.middleware"); 


const router = express.Router();

// Apply authentication and vendor role check for all product routes
router.post("/products", authenticate, authorize("vendor"), ProductController.createProduct);
router.put("/products/:productId", authenticate, authorize("vendor"), ProductController.updateProduct);
router.delete("/products/:productId", authenticate, authorize("vendor"), ProductController.deleteProduct);
router.get("/products", authenticate, authorize("vendor"), ProductController.getVendorProducts);

module.exports = router;
