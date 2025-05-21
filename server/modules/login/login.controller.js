const Model = require("../register/reg.model");
const { genToken, genOTP, verifyToken } = require("../../utils/token"); // Import verifyToken
const { genHash, compareHash } = require("../../utils/secure");
const { sendEmail } = require("../../services/mailer");

const Login = async (payload) => {
  const { email, password } = payload;
  const user = await Model.findOne({ email, isActive: true, isBlocked: false });
  if (!user) throw new Error("User not found");
  const isValidPw = compareHash(password, user?.password);
  if (!isValidPw) throw new Error("Username or Password didn't match");

  const data = {
    name: user?.name,
    email: user?.email,
  };
  return genToken(data);
};

const genForgetPasswordToken = async (payload) => {
  const { email } = payload;
  const user = await Model.findOne({ email, isActive: true, isBlocked: false });
  if (!user) throw new Error("User not found");
  const myToken = genOTP();
  await Model.updateOne({ email }, { token: myToken }); // Save as String

  const isEmailSent = await sendEmail(
    {
      to: user.email,
      subject: "Forget Password Token",
      htmlMessage: `<h1> Your forget Password token is ${myToken}</h2>`,
    }
  );
  if (!isEmailSent) throw new Error("User email sending failed.");
  return { data: null, msg: "Please check your email for token" };
};

const verifyForgetPasswordToken = async ({ email, token, newPassword }) => {
  const user = await Model.findOne({ email, isActive: true, isBlocked: false });
  if (!user) throw new Error("User not found");

  let cleanedStoredToken = user?.token;
  const cleanedProvidedToken = token.trim();

  console.log("Step 1: User Data from Database");
  console.log("User Email:", user.email);
  console.log("Stored Token (from DB):", user.token);
  console.log("Stored Token Type:", typeof user.token);

  if (typeof cleanedStoredToken === 'string') {
    cleanedStoredToken = cleanedStoredToken.trim();
  }
  console.log("Step 2: After Trimming");
  console.log("Cleaned Stored Token:", cleanedStoredToken);
  console.log("Cleaned Provided Token:", cleanedProvidedToken);
  console.log("Cleaned Stored Token Type:", typeof cleanedStoredToken);
  console.log("Cleaned Provided Token Type:", typeof cleanedProvidedToken);

  // Character code logging
  let storedCodes = "";
  if (cleanedStoredToken) {
    for (let i = 0; i < cleanedStoredToken.length; i++) {
      storedCodes += cleanedStoredToken.charCodeAt(i) + " ";
    }
  }
  console.log("Stored Token Codes:", storedCodes);

  let providedCodes = "";
  if (cleanedProvidedToken) {
    for (let i = 0; i < cleanedProvidedToken.length; i++) {
      providedCodes += cleanedProvidedToken.charCodeAt(i) + " ";
    }
  }
  console.log("Provided Token Codes:", providedCodes);

  const isValidToken = cleanedProvidedToken === cleanedStoredToken;
  console.log("Step 3: Comparison Result");
  console.log("isValidToken:", isValidToken);

  if (!isValidToken) throw new Error("Token mismatch");

  const passwordHash = genHash(newPassword);
  const updatedUser = await Model.updateOne({ email }, { password: passwordHash, token: "" });
  if (!updatedUser) throw new Error("Forget Password Change failed");
  return { data: null, msg: "Password Changed Successfully" };
};
const changePassword = async ({ email, oldpassword, newPassword }) => {
  const user = await Model.findOne({ email, isActive: true, isBlocked: false });
  if (!user) throw new Error("User not found");
  console.log(oldpassword, newPassword)
  const isValidPw = compareHash(oldpassword, user?.password); // Use user.password
  console.log(isValidPw)
  if (!isValidPw) throw new Error("Password mismatch");
  const passwordHash = genHash(newPassword); // Hash the *new* password
  const updatedUser = await Model.findOneAndUpdate( // Use findOneAndUpdate
    { email },  // Use email to find the user
    { password: passwordHash }, // Update the password field
    { new: true } // Return the modified document
  );
  if (!updatedUser) throw new Error("Password Change failed");
  return { data: null, msg: "Password Changed Successfully" };
};


const resetPassword = async({email, newPassword})=>{
  const user = await Model.findOne({email, isActive:true, isBlocked:false});
  if(!user) throw new Error("User not found");
  const password = genHash(newPassword);
  const updatedUser = await Model.findOneAndUpdate(
    {email},
    {password},
    {new:true}
  )
  if(!updatedUser) throw new Error("Password Reset failed");
  return {data:null, msg:"Password Reset Successfully"};
}

const blockUser = async({email})=>{
  const user = await Model.findOne({email, isActive:true});
  if(!user) throw new Error("User not found")

    const updatedUser = await Model.findOneAndUpdate(
      {email},
      {isBlocked: !user?.isBlocked},
      {new:true}
    );
    if(!updatedUser) throw new Error("User Block failed");
    return {
      data: {isBlocked: updatedUser?.isBlocked},
      msg:`User ${updatedUser?.isBlocked? "Blocked" : "unblock"} Successfully`,
    };
}
module.exports = { Login, genForgetPasswordToken, verifyForgetPasswordToken, changePassword, resetPassword, blockUser};