const Model = require("../register/reg.model");
const { genToken } = require("../../utils/token");
const {genHash, compareHash}=require("../../utils/secure")




const Login = async (payload) => {
  const { email, password } = payload;
  const user = await Model.findOne({ email, isActive: true, isBlocked: false });
  if(!user) throw new Error("User not found");
  const isValidPw = compareHash(password, user?.password);
  if(!isValidPw) throw new Error("Username or Password didn't match");


  const data = {
    name:user?.name,
    email:user?.email,
  }
  return genToken(data)
};

module.exports = { Login };
