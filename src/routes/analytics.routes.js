const express = require("express");
const AnalyticsController = require("../controllers/analytics.controller");
const { authenticate, authorize } = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/analytics/admin", authenticate, authorize("admin"), AnalyticsController.getAdminAnalytics);
router.get("/analytics/vendor", authenticate, authorize("vendor"), AnalyticsController.getVendorAnalytics);

module.exports = router;
