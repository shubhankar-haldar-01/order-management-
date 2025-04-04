const Joi = require("joi");
const Product = require("../models/product.model");
const {STATUS_CODES, MESSAGES} = require("../utils/constants")

class ProductService {
  async createProduct({ vendorId, name, price, stock, category }) {
    const schema = Joi.object({
      vendorId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
      name: Joi.string().min(2).max(100).required(),
      price: Joi.number().min(0).required(),
      stock: Joi.number().integer().min(0).required(),
      category: Joi.string().min(2).max(50).required(),
    });

    const { error } = schema.validate({ vendorId, name, price, stock, category });
    if (error) {
      throw { status: STATUS_CODES.BAD_REQUEST, message: error.details[0].message, error: true };
    }

    try {
      const product = await Product.create({ vendorId, name, price, stock, category });
      return { 
        status: STATUS_CODES.CREATED,
        message: MESSAGES.PRODUCT.PRODUCT_CREATE_SUCCESS, 
        data: product,  
        error: false, 
      };
    } catch (error) {
      return {
        status: error.status || STATUS_CODES.INTERNAL_SERVER_ERROR,
        message: error.message || MESSAGES.INTERNAL_SERVER_ERROR,
        error: error.error || true
      };
    }
  }

  async updateProduct({ vendorId, productId, updates }) {
    const schema = Joi.object({
      vendorId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
      productId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
      updates: Joi.object({
        name: Joi.string().min(2).max(100),
        price: Joi.number().min(0),
        stock: Joi.number().integer().min(0),
        category: Joi.string().min(2).max(50),
      }),
    });

    const { error } = schema.validate({ vendorId, productId, updates });
   if (error) {
        throw { status: STATUS_CODES.BAD_REQUEST, message: error.details[0].message, error: true };
      }

    try {
      const product = await Product.findOneAndUpdate(
        { _id: productId, vendorId },
        updates,
        { new: true, runValidators: true }
      );

      if (!product) {
        throw { status: STATUS_CODES.NOT_FOUND, message: MESSAGES.PRODUCT.PRODUCT_NOT_FOUND, error: true };
      }

      return { 
        status: STATUS_CODES.SUCCESS, 
        message: MESSAGES.PRODUCT.PRODUCT_UPDATE_SUCCESS, 
        data: product,
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

  async deleteProduct({ vendorId, productId }) {
    const schema = Joi.object({
      vendorId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
      productId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    });

    const { error } = schema.validate({ vendorId, productId });
    if (error) {
      throw { status: STATUS_CODES.BAD_REQUEST, message: error.details[0].message, error: true };
    }

    try {
      const deletedProduct = await Product.findOneAndDelete({ _id: productId, vendorId });
      if (!deletedProduct) {
        throw { status: STATUS_CODES.NOT_FOUND, message: MESSAGES.PRODUCT.PRODUCT_NOT_FOUND, error: true };
      }
  
      return { 
        status: STATUS_CODES.SUCCESS, 
        message: MESSAGES.PRODUCT.PRODUCT_DELETE_SUCCESS, 
        data: deletedProduct,
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

  async getVendorProducts(vendorId) {
    const schema = Joi.object({
      vendorId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    });

    const { error } = schema.validate({ vendorId });
    if (error) {
      throw { status: STATUS_CODES.BAD_REQUEST, message: error.details[0].message, error: true };
    }

    try {
      const products = await Product.find({ vendorId }).lean();
      return { 
        status: STATUS_CODES.SUCCESS, 
        message: MESSAGES.PRODUCT.PRODUCT_RETRIEVE_SUCCESS, 
        data: products,
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

module.exports = new ProductService();
