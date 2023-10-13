const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
  email: { type: String, required: [true, "email is required"] },
  password: { type: String, required: [true, "password is required"] },
  role: { type: String, required: [true, "role is required"] },
});

const UserModel = mongoose.model("users", userSchema);

module.exports = UserModel;