require("dotenv").config();
const express = require("express");
const app = express();
const PORT = Number(process.env.PORT || 9000);

app.get("/user", (req, res) => { // Changed "user" to "/user" for a valid route path
  console.log(["ram", "shyam", "gita"]);
  res.send(["ram", "shyam", "gita"]); // Added res.send to send a response
});

app.listen(PORT, () => {
  console.log(`Application running on port ${PORT}`); // Corrected the console log message
});