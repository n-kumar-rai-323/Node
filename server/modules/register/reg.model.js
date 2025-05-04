const { Schema, model } = require("mongoose");

const Register = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  
});

module.exports = new model("Register", Register);
