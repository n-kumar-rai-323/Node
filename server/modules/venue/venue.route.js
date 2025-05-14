const router = require("express").Router();
const VenueController = require("./venue.controller");

router.post("/venue", async (req, res, next) => {
  try {
    const result = await VenueController.venueCreate(req.body);
    res.json(result);
  } catch (e) {
    next(e);
  }
});

router.get("/venueList", async (req, res, next) => {
  try {
    const result = await VenueController.getVenue(req.body);
    res.json(result);
  } catch (e) {
    next(e);
  }
});
module.exports = router;
