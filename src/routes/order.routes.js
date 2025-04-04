const express = require("express");
const OrderController= require("../controllers/order.controller");
const {authenticate, authorize} = require("../middlewares/auth.middleware"); 

const router = express.Router();

router.post("/orders", authenticate, authorize("customer"), OrderController.placeOrder);

module.exports = router;
