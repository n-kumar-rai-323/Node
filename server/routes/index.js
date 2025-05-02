const router = require("express").Router();
const logRoute = require("../modules/login/login.route")
const regRoute = require("../modules/register/reg.route");
router.use("/reg", regRoute);
router.use("/log", logRoute)
module.exports = router;
