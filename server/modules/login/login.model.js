const { Schema, model } = require("mongoose");

const Login = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true},
});

module.exports = new model("Login", Login);
