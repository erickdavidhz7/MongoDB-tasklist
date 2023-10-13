const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async function(){
  try {
    await mongoose.connect(process.env.MONGO_URI);
    return mongoose.connection;
  } catch (error) {
    console.log(error);
  }
}

module.exports = connectDB;