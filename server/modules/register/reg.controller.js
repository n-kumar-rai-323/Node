const Model = require("./reg.model");
const bcrypt = require("bcrypt");

const Register = async (payload) => {
  try {
    const hashedPassword = await bcrypt.hash(payload.password, 10);
    payload.password = hashedPassword;
    const newUser = await Model.create(payload);
    return newUser; // Return the newly created user data
  } catch (error) {
    console.error("Error creating user:", error);
    throw error; // Re-throw the error to be caught in the route handler
  }
};

module.exports = { Register };