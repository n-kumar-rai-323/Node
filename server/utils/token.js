const crypto = require("crypto")
const JWT = require("jsonwebtoken")




const genToken = (data, expiresIn = '1h') => { // Default expiration of 1 hour
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }
  return JWT.sign(data, process.env.JWT_SECRET, {
    expiresIn: expiresIn,
  });
};

const verifyToken = (token) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }
  try {
    return JWT.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    //  Handle different JWT errors (e.g., expired, invalid signature)
    throw new Error("Invalid or expired token");
  }
};
const genOTP = () => {
  return crypto.randomInt(100000, 999999)
}

module.exports = { genOTP, genToken, verifyToken }