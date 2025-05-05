require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const PORT = Number(process.env.PORT) || 9200;

mongoose
  .connect("mongodb://127.0.0.1:27017/Jatra")
  .then(() => { // Removed (req, res)
    console.log("Database connection successfully");
  })
  .catch((e) => {
    console.log(`Database Error ${e}`);
  });

const indeRoute = require("./routes/index");
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
app.use("/", indeRoute);

app.use((err, req, res, next) => { 
  const errMsg = err ? err.toString() : "Something went wrong";
  res.status(500).json({ data: null, msg: errMsg }); 
});

app.listen(PORT, () => { 
  console.log(`Application Running ${PORT}`);
});