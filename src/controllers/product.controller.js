const express = require("express");
const ProductService = require("../services/product.service");

class ProductController {
  async createProduct(req, res) {

     try {
      const { name, price, stock, category } = req.body
      const vendorId = req.user.id;
      const response = await ProductService.createProduct({ vendorId, name, price, stock, category });

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

  async updateProduct(req, res) {
    
    try {
      const { updates } = req.body
      const vendorId = req.user.id;
      const { productId } = req.params;

      const response = await ProductService.updateProduct({
        vendorId: vendorId,
        productId: productId,
        updates: updates,
      });
  
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

  async deleteProduct(req, res) {

    try {
      const { productId } = req.params;
      const vendorId = req.user.id;

      const response = await ProductService.deleteProduct({
        vendorId: vendorId,
        productId: productId,
      });

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

  async getVendorProducts(req, res) {

    try {
      const vendorId = req.user.id;
      const response = await ProductService.getVendorProducts(vendorId);

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

module.exports = new ProductController();
