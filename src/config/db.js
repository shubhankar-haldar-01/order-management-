const mongoose = require("mongoose")
require("dotenv").config()

const ConnectDB = async () => {
  try{

    await mongoose.connect(process.env.MONGO_URI)
    console.log("Database Connected")

  }catch (error){
    console.error("MongoDB Connection Error", error);
    process.exit(1);
  }
}

module.exports = ConnectDB