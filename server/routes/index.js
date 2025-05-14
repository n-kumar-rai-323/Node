const router = require("express").Router();
const logRoute = require("../modules/login/login.route")
const regRoute = require("../modules/register/reg.route");
const venueRoute = require("../modules/venue/venue.route")
router.use("/reg", regRoute);
router.use("/log", logRoute)
router.use("/venue", venueRoute)
module.exports = router;
