const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  notification: {type: Boolean, default: false},
});



module.exports = mongoose.model("User", UserSchema);
