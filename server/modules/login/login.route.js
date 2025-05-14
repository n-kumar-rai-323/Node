const router = require("express").Router()
const LoginController = require("./login.controller")
const {validate, forgetPasswordValidation}= require("./user.validation")

router.post("/login", validate, async(req,res,next)=>{
   try{
    const result = await LoginController.Login(req.body)
    res.json({data:result, msg:"User logged in successfully"});
   }catch(e){
    next(e)
   }
})

router.post("/forget-password", async (req, res, next) => { // Corrected route path
  try {
    const result = await LoginController.genForgetPasswordToken(req.body);
    res.json(result);
  } catch (e) {
    next(e);
  }
});

router.post("/verify-forget-password",forgetPasswordValidation, async (req, res, next) => {  // Added route for verifyForgetPasswordToken
  try {
    const result = await LoginController.verifyForgetPasswordToken(req.body);
    res.json(result);
  } catch (e) {
    next(e);
  }
});

router.put("/change-password", async (req, res, next) => {  // Added route for verifyForgetPasswordToken
  try {
    const result = await LoginController.changePassword(req.body);
    res.json(result);
  } catch (e) {
    next(e);
  }
});



module.exports=router