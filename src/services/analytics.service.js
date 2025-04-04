const Order = require("../models/order.model");
const Product = require("../models/product.model");
const { MESSAGES, STATUS_CODES } = require("../utils/constants")

class AnalyticsService {
  async getAdminAnalytics() {
    try {
      const past30Days = new Date();
      past30Days.setDate(past30Days.getDate() - 30);

      // Revenue per vendor (last 30 days)
      const revenuePerVendor = await Order.aggregate([
        { $match: { createdAt: { $gte: past30Days }, status: "Completed" } },
        { $unwind: "$products" },
        {
          $group: {
            _id: "$products.vendorId",
            totalRevenue: { $sum: { $multiply: ["$products.price", "$products.quantity"] } },
          },
        },
      ]);

      // Top 5 products by sales
      const topProducts = await Order.aggregate([
        { $match: { createdAt: { $gte: past30Days }, status: "Completed" } },
        { $unwind: "$products" },
        {
          $group: {
            _id: "$products.productId",
            totalSold: { $sum: "$products.quantity" },
          },
        },
        { $sort: { totalSold: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: "products",
            localField: "_id",
            foreignField: "_id",
            as: "productDetails",
          },
        },
        { $unwind: "$productDetails" },
        {
          $project: {
            _id: 1,
            name: "$productDetails.name",
            totalSold: 1,
          },
        },
      ]);

      // Average order value
      const avgOrderValue = await Order.aggregate([
        { $match: { createdAt: { $gte: past30Days }, status: "Completed" } },
        {
          $group: {
            _id: null,
            avgValue: { 
              $avg: { 
                $sum: { $map: { input: "$products", as: "product", in: { $multiply: ["$$product.price", "$$product.quantity"] } } } 
              } 
            }, // Fixed: Ensuring proper summing
          },
        },
      ]);

      return {
        status: STATUS_CODES.SUCCESS,
        message: MESSAGES.ANALYTICS.ADMIN,
        data: { revenuePerVendor, topProducts, avgOrderValue: avgOrderValue[0]?.avgValue || 0 },
        error: false
      };
    } catch (error) {
      return {
        status: error.status || STATUS_CODES.INTERNAL_SERVER_ERROR,
        message: error.message || MESSAGES.INTERNAL_SERVER_ERROR,
        error: error.error || true
      };
    }
  }

  async getVendorAnalytics(vendorId) {
    try {
      const past7Days = new Date();
      past7Days.setDate(past7Days.getDate() - 7);

      // Daily sales (last 7 days)
      const dailySales = await Order.aggregate([
        { $match: { createdAt: { $gte: past7Days }, status: "Completed" } },
        { $unwind: "$products" },
        { $match: { "products.vendorId": vendorId } },
        {
          $group: {
            _id: { day: { $dayOfMonth: "$createdAt" }, month: { $month: "$createdAt" } },
            totalSales: { $sum: { $multiply: ["$products.price", "$products.quantity"] } },
          },
        },
        { $sort: { "_id.month": 1, "_id.day": 1 } },
      ]);

      // Low-stock items
      const lowStockItems = await Product.find({ vendorId, stock: { $lt: 10 } });

      return {
        status: STATUS_CODES.SUCCESS,
        message: MESSAGES.ANALYTICS.VENDOR,
        data: { dailySales, lowStockItems },
        error: false
      };
    } catch (error) {
      return {
        status: error.status || STATUS_CODES.INTERNAL_SERVER_ERROR,
        message: error.message || MESSAGES.INTERNAL_SERVER_ERROR,
        error: error.error || true
      };
    }
  }
}

module.exports = new AnalyticsService();


