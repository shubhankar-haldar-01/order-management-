# 🛒 Multi-Vendor E-commerce Backend (Node.js + MongoDB)

This is a backend service for a multi-vendor e-commerce platform built with **Node.js**, **Express**, and **MongoDB** using **Mongoose**. It includes user authentication, product management for vendors, and order processing.

---

## 🚀 Getting Started

Follow these steps to get the project up and running on your local machine.

### 📦 Prerequisites

- Node.js >= 14.x  
- MongoDB instance (local or cloud, like MongoDB Atlas)  
- Git  

## 🧪 API Testing (Postman Collection)

A Postman collection is included in the root directory for testing the API endpoints.

### How to Use:
1. Open Postman
2. Click on **Import**
3. Select the file: `ecommerce-api.postman_collection.json`
4. Start testing endpoints like Register, Login, Product CRUD, etc.

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/shubhankar-haldar-01/order-management-
cd your-repo-name

2. Create .env File
  In the root directory, create a .env file and add the following variables:

  PORT=5000
  MONGO_URI=your_mongodb_connection_string
  JWT_SECRET=your_jwt_secret_key

3. Install Dependencies
  npm install

4. Run the Project
  For development:
  npm run dev

  For production:
  npm start