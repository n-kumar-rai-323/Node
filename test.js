require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const PORT = Number(process.env.PORT || 9000);

mongoose.connect("mongodb://127.0.0.1:27017/nodeTest");
app.use(express.json())

const Product = mongoose.model("product", {
  productName: String,
  productPrice: Number,
  isFeatured: Boolean,
});

const User = mongoose.model("User",{
  name:String,
  email: String,
  password:String,
  role:{type:String, enum:['admin', 'user', 'driver'], default:'user'},
  phoneNumber : Number,
  avatar : String
})
app.post("/products", (req, res) => {
  const data =Product.create(req.body)
  console.log(req.body)
 res.json({msg:"product created"})
});

app.get("/products", async (req, res) => {
 const data = await Product.find({productName:"Computer"})
 res.send(data)
});


app.listen(PORT, () => {
  console.log(`Application running on port ${PORT}`); // Corrected the console log message
});
