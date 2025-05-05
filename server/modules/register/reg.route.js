const router = require("express").Router();
const RegisterController = require("./reg.controller");

router.post("/register", async (req, res, next) => {
  try {
    const result = await RegisterController.Register(req.body);
    res.json({ data: result, msg: "User registered successfully" });
  } catch (e) {
    next(e);
  }
});

router.post("/verify-email", async (req, res, next) => {
  try {
    const result = await RegisterController.verifyEmailToken(req.body);
    res.json(result);
  } catch (e) {
    next(e);
  }
});

router.post("/resend-otp", async (req, res, next) => {
  try {
    const result = await RegisterController.resendOTP(req.body);
    res.json(result);
  } catch (e) {
    next(e);
  }
});

module.exports = router;