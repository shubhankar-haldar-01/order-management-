const express = require("express");
const OrderService = require("../services/order.service");

class OrderController {
  async placeOrder(req, res) {
    try {
      const { products } = req.body;
      const userId = req.user.id

      const response = await OrderService.placeOrder({ userId, products });

      if(response.error){
        throw{
          status: response.status,
          message: response.message,
          error: response.error
        }
      }

      return res.status(response.status).json(response);
    } catch (error) {
      res.status(error.status).json({
        message: error.message,
        status: error.status,
        error: error.error || true,
      })
    }
  }
}

module.exports = new OrderController();
