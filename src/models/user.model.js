const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: { 
    type: String, required: true, trim: true
  },
  email: { 
    type: String, unique: true, required: true, lowercase: true, index: true 
  },
  password: { 
    type: String, required: true, minlength: 6 
  },
  role: { 
    type: String, enum: ["customer", "vendor", "admin"], required: true 
  }
}, { timestamps: true });


const User = mongoose.model("User", userSchema);
module.exports = User;
