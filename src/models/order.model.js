const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  customerId: { 
    type: mongoose.Schema.Types.ObjectId, ref: "User", required: true 
  },
  vendorOrders: [{
    vendorId: { 
      type: mongoose.Schema.Types.ObjectId, ref: "User", required: true 
    },
    items: [{
      product: { 
        type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true 
      },
      quantity: { 
        type: Number, required: true, min: 1 
      }
    }]
  }],
  totalPrice: { 
    type: Number, required: true, default: 0 
  }
}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);
module.exports = Order
