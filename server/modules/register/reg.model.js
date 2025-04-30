const { Schema, model } = require("mongoose");

const Register = new Schema({
  name: { type: String, required: true },
});

module.exports = new model("Register", Register)