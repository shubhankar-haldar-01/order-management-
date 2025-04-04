const mongoose = require("mongoose");

const MasterOrderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    subOrders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
    status: { type: String, enum: ["Pending", "Completed", "Cancelled"], default: "Pending" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MasterOrder", MasterOrderSchema);
