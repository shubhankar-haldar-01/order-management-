require("dotenv").config();
const express = require("express");
const authRoutes = require("./routes/auth.routes");
const productRoutes = require("./routes/product.routes")
const orderRoutes = require("./routes/order.routes")
const analyticsRoutes = require("./routes/analytics.routes")

const connectDB = require("./config/db");
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/auth", productRoutes)
app.use("/api/auth", orderRoutes)
app.use("/api/auth", analyticsRoutes)



module.exports = app;
