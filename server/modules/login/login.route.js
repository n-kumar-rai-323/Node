const router = require("express").Router()
const LoginController = require("./login.controller")

router.post("/login",(req,res,next)=>{
    console.log(LoginController.Login(req.body))
    res.json("User Login successfully")
})



module.exports=router