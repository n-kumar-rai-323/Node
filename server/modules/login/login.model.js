const {Schema, model, Types}=require("mongoose")


const Login = new Schema({
    email:{Types:String, required:true}
})

module.exports = new model("Login", Login)