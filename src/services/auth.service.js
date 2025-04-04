const bcrypt = require("bcrypt");
const Joi = require("joi");
const User = require("../models/user.model");
const { generateToken } = require("../middlewares/auth.middleware");
const {STATUS_CODES, MESSAGES} = require("../utils/constants")

class AuthService {
  async register({ name, email, password, role }) {
    try {
      const schema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).max(30).required(),
        role: Joi.string().valid("customer", "vendor", "admin").required(),
      });

      const { error } = schema.validate({ name, email, password, role });
      if (error) {
        throw { status: STATUS_CODES.BAD_REQUEST, message: error.details[0].message, error: true };
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw { status: STATUS_CODES.UNAUTHORIZED, message: MESSAGES.AUTH.USER_ALREADY_EXISTS, error: true };
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({ name, email, password: hashedPassword, role });

      // const token = generateToken(user);

      return {
        status: STATUS_CODES.CREATED,
        message: MESSAGES.AUTH.USER_REGISTERED_SUCCESS,
        error: false,
        // data: { token, userId: user._id },
      };
    } catch (error) {
      return {
        status: error.status || STATUS_CODES.INTERNAL_SERVER_ERROR,
        message: error.message || MESSAGES.INTERNAL_SERVER_ERROR,
        error: error.error || true
      };
    }
  }

  async login({ email, password }) {
    try {
      const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).max(30).required(),
      });

      const { error } = schema.validate({ email, password });
      if (error) {
        throw { status: STATUS_CODES.BAD_REQUEST, message: error.details[0].message, error: true };
      }

      const user = await User.findOne({ email });
      if (!user) {
        throw { status: STATUS_CODES.UNAUTHORIZED, message: MESSAGES.AUTH.INVALID_CREDENTIALS, error: true };
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw { status: STATUS_CODES.UNAUTHORIZED, message: MESSAGES.AUTH.INVALID_CREDENTIALS, error: true };
      }

      const token = generateToken(user);

      return {
        status: STATUS_CODES.SUCCESS,
        message: MESSAGES.AUTH.LOGIN_SUCCESS,
        error: false,
        data: { token, userId: user._id },
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

module.exports = new AuthService();
