const router = require("express").Router()
const LoginController = require("./login.controller")

router.post("/login", async(req,res,next)=>{
   try{
    const result = await LoginController.Login(req.body)
    res.json({data:result, msg:"User logged in successfully"});
   }catch(e){
    next(e)
   }
})



module.exports=router