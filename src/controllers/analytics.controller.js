const express = require("express");
const AnalyticsService = require("../services/analytics.service");

class AnalyticsController {
  async getAdminAnalytics(req, res) {
    try {
     
      const response = await AnalyticsService.getAdminAnalytics()

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

  async getVendorAnalytics(req, res) {
    try {

      const vendorId = req.user.id
      const response = await AnalyticsService.getVendorAnalytics(vendorId)

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

module.exports = new AnalyticsController();
