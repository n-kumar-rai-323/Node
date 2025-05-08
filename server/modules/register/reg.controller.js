const Model = require("./reg.model");
const { genHash, compareHash } = require("../../utils/secure");
const { genOTP } = require("../../utils/token");
const mailerService = require("../../services/mailer"); // More semantic import name

const AuthController = {

  Register: async (payload) => {
    try {
      const { password, ...userData } = payload;

      const existingUser = await Model.findOne({ email: userData.email });
      if (existingUser) {
        throw new Error("This email has already been taken");
      }

      const hashedPassword = await genHash(password);
      userData.password = hashedPassword;

      const newUser = await Model.create(userData);
      if (!newUser) {
        throw new Error("User registration failed. Try again later");
      }

      const otp = genOTP();
      const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // OTP expires in 5 minutes

      await Model.updateOne({ email: newUser.email }, { token: otp, otpExpiresAt });
      console.log({ otp, otpExpiresAt });

      const isEmailSent = await AuthController.sendVerificationEmail(
        newUser.email,
        otp
      );
      if (!isEmailSent) {
        console.error(`Warning: Email sending failed for user ${newUser.email}. User created but not notified.`);
        return { data: null, msg: "Registration successful, but failed to send verification email. Please try again later." };
      }

      return { data: null, msg: "Please check your email for verification" };
    } catch (error) {
      console.error("Error during user registration:", error);
      throw error; // Re-throw the error to be caught in the route handler
    }
  },


  sendVerificationEmail: async (to, otp) => {
    const subject = "Welcome to xyz JATRA - Verify Your Email";
    const htmlMessage = `<h1> Your OTP code for verification is: ${otp}</h1>`;

    try {
      const isSent = await mailerService.sendEmail({ to, subject, htmlMessage });
      return isSent;
    } catch (error) {
      console.error("Error sending verification email:", error);
      return false;
    }
  },

  verifyEmailToken: async ({ email, token }) => {
    try {
      const user = await Model.findOne({ email, isBlocked: false });
      if (!user) {
        throw new Error("User not found");
      }

      // Check if OTP has expired
      if (user.otpExpiresAt && user.otpExpiresAt < new Date()) {
        await Model.updateOne({ _id: user._id }, { token: null, otpExpiresAt: null });
        throw new Error("OTP has expired. Please request a new one.");
      }

      const isValidToken = Number(token) === user?.token;
      if (!isValidToken) {
        throw new Error("Invalid token");
      }

      const updateUser = await Model.updateOne(
        { email },
        { isActive: true, token: null, otpExpiresAt: null }
      );
      if (!updateUser.modifiedCount) {
        throw new Error("Email verification failed");
      }

      return { data: null, msg: "Thank you for verifying your email" };
    } catch (error) {
      console.error("Error during email verification:", error);
      throw error;
    }
  },

  resendOTP: async ({ email }) => {
    try {
      const user = await Model.findOne({ email, isBlocked: false });
      if (!user) {
        throw new Error("User not found");
      }

      const newOtp = genOTP();
      const newOtpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // New OTP expires in 5 minutes

      await Model.updateOne({ email }, { token: newOtp, otpExpiresAt: newOtpExpiresAt });
      console.log({ newOtp, newOtpExpiresAt });

      const isEmailSent = await AuthController.sendVerificationEmail(email, newOtp);
      if (!isEmailSent) {
        throw new Error("Failed to resend OTP.");
      }

      return { data: null, msg: "New OTP has been sent to your email address." };
    } catch (error) {
      console.error("Error resending OTP:", error);
      throw error;
    }
  },
};

module.exports = AuthController;