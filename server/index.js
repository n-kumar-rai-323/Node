require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const PORT = Number(process.env.PORT) | 9200;

mongoose
  .connect("mongodb://127.0.0.1:27017/Jatra")
  .then((req, res) => {
    console.log("Database connection successfully");
  })

  .catch((e) => {
    console.log(`Database Error ${e}`);
  });
const indeRoute = require("./routes/index");
app.use(express.urlencoded({ extended: true }));

app.use(express.json());
app.use("/",indeRoute)
app.listen(PORT, (req, res) => {
  console.log(`Application Running ${PORT}`);
});
