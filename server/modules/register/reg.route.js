const router = require("express").Router();
const RegisterController = require("./reg.controller");

router.post("/register", async (req, res, next) => {
  try {
    const result = await RegisterController.Register(req.body)
    res.json({data: result, msg:"User register successfully"})
  } catch (e) {
    next(e)
  }
});

module.exports = router;
