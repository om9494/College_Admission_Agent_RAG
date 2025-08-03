const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const DTESchema = new mongoose.Schema({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true }
});



module.exports = mongoose.model("DTE", DTESchema);
