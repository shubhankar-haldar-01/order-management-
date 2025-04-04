const STATUS_CODES = {
  SUCCESS: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

const MESSAGES = {
  // General
  DEFAULT_ERROR: "Something went wrong",
  INTERNAL_SERVER_ERROR: "Internal Server Error",

  // Auth Messages
  AUTH: {
    USER_ALREADY_EXISTS: "User already exists",
    USER_REGISTERED_SUCCESS: "User registered successfully",
    LOGIN_SUCCESS: "Login successful",
    INVALID_CREDENTIALS: "Invalid credentials",
  },
 
  // Product Messages
  PRODUCT: {
    PRODUCT_CREATE_SUCCESS: "Product created successfully",
    PRODUCT_CREATE_FAILED: "Product creation failed",
    PRODUCT_UPDATE_SUCCESS: "Product updated successfully",
    PRODUCT_UPDATE_FAILED: "Product update failed",
    PRODUCT_DELETE_SUCCESS: "Product deleted successfully",
    PRODUCT_DELETE_FAILED: "Product deletion failed",
    PRODUCT_NOT_FOUND: "Product not found or unauthorized",
    PRODUCT_RETRIEVE_SUCCESS: "Products retrieved successfully",
    PRODUCT_RETRIEVE_FAILED: "Failed to retrieve products",
  },

  // Order Messages
 ORDER: {
  ORDER_PLACED_SUCCESS: "Order placed successfully",
  ORDER_PLACED_FAILED: "Order placement failed",
  PRODUCT_NOT_FOUND_ID: (id) => `Product with ID ${id} not found`,
  PRODUCT_HAS_NO_VENDOR: (name) => `Product "${name}" has no vendor assigned`,
  INSUFFICIENT_STOCK: (name) => `Insufficient stock for "${name}"`,
  STOCK_UPDATE_FAILED: (name) => `Failed to update stock for "${name}"`,
 },

 // Analytics Messages 
 ANALYTICS: {
  ADMIN: "Admin analytics retrieved successfully",
  VENDOR: "Vendor analytics retrieved successfully"
 }

};

module.exports = { STATUS_CODES, MESSAGES };

