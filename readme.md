# 🛒 Multi-Vendor E-commerce Backend (Node.js + MongoDB)

This is a backend service for a multi-vendor e-commerce platform built with **Node.js**, **Express**, and **MongoDB** using **Mongoose**. It includes user authentication, product management for vendors, and order processing.

---

## 🚀 Getting Started

Follow these steps to get the project up and running on your local machine.

### 📦 Prerequisites

- Node.js >= 14.x  
- MongoDB instance (local or cloud, like MongoDB Atlas)  
- Git  

---

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/your-repo-name.git
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