const { Schema, model } = require("mongoose");

const Register = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isBlocked: { type: Boolean, required: true, default: false },
  isActive: { type: Boolean, required: true, default: false },
  token: Number,
  otpExpiresAt: Date, // New field for OTP expiration
});

module.exports = model("Register", Register);