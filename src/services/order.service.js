const mongoose = require("mongoose");
const Joi = require("joi");
const Order = require("../models/order.model");
const Product = require("../models/product.model");
const MasterOrder = require("../models/masterOrder.model");
const {STATUS_CODES, MESSAGES}  = require("../utils/constants")

class OrderService {
  async placeOrder({ userId, products }) {
    // Validate input
    const schema = Joi.object({
      userId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
      products: Joi.array()
        .items(
          Joi.object({
            product: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
            quantity: Joi.number().integer().min(1).required(),
          })
        )
        .min(1)
        .required(),
    });

    const { error } = schema.validate({ userId, products });

    if (error) {
      throw { status: STATUS_CODES.BAD_REQUEST, message: error.details[0].message, error: true };
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Group products by vendor
      const vendorWiseOrders = {};
      let totalMasterOrderPrice = 0; // Store total price for master order

      for (const item of products) {
        const product = await Product.findById(item.product).session(session);

        if (!product) {
          throw { status: STATUS_CODES.NOT_FOUND, message: MESSAGES.ORDER.PRODUCT_NOT_FOUND_ID(item.product), error: true };
        }

        if (!product.vendorId) {
          throw { status: STATUS_CODES.BA, message: MESSAGES.ORDER.PRODUCT_HAS_NO_VENDOR(product.name), error: true };
        }

        if (product.stock < item.quantity) {
          throw { status: STATUS_CODES.BAD_REQUEST, message: MESSAGES.ORDER.INSUFFICIENT_STOCK(product.name), error: true };
        }

        // Decrement stock safely
        const updatedProduct = await Product.findOneAndUpdate(
          { _id: item.product, stock: { $gte: item.quantity } },
          { $inc: { stock: -item.quantity } },
          { new: true, session }
        );

        if (!updatedProduct) {
          throw { status: STATUS_CODES.BAD_REQUEST, message: MESSAGES.ORDER.STOCK_UPDATE_FAILED, error: true };
        }

        const vendorId = product.vendorId.toString();
        const productPrice = product.price * item.quantity;
        totalMasterOrderPrice += productPrice; // Add to master order total

        if (!vendorWiseOrders[vendorId]) {
          vendorWiseOrders[vendorId] = {
            vendorId: product.vendorId,
            items: [],
            totalPrice: 0, // Track total price for vendor
          };
        }

        vendorWiseOrders[vendorId].items.push({
          product: item.product,
          quantity: item.quantity,
          price: product.price, // Include price per unit
          totalPrice: productPrice, // Store total price per product
        });

        vendorWiseOrders[vendorId].totalPrice += productPrice; // Update vendor total price
      }

      // Create an Order document with vendor-wise breakdown
      const order = new Order({
        customerId: userId,
        vendorOrders: Object.values(vendorWiseOrders),
        totalPrice: totalMasterOrderPrice, // Store total price in Order
      });

      await order.save({ session });

      // Create a MasterOrder document linking to this order
      const masterOrder = new MasterOrder({
        user: userId,
        subOrders: [order._id], // Single order linking multiple vendors
        totalPrice: totalMasterOrderPrice, // Store total price in MasterOrder
      });

      await masterOrder.save({ session });

      await session.commitTransaction();
      session.endSession();

      return {
        status: STATUS_CODES.CREATED,
        message: MESSAGES.ORDER.ORDER_PLACED_SUCCESS,
        data: {
          masterOrderId: masterOrder._id,
          orderId: order._id,
          totalPrice: totalMasterOrderPrice, // Return total price in response
        },
        error: false
      };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      return {
        status: error.status || STATUS_CODES.INTERNAL_SERVER_ERROR,
        message: error.message || MESSAGES.INTERNAL_SERVER_ERROR,
        error: error.error || true
      };
    }
  }
}

module.exports = new OrderService();
