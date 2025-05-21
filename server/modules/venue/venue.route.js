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
    const result = await VenueController.getVenue();
    res.json(result);
  } catch (e) {
    next(e);
  }
});


router.get("/venue/:id", async (req, res, next) => {
  try {
    const result = await VenueController.getVenueById(req.params.id); // Passing req.params.id
    res.json(result);
  } catch (e) {
    next(e);
  }
});


router.put("/venue/:id", async (req, res, next) => {
  try {
    const result = await VenueController.updateVenueById(req.params.id, req.body); // Passing both id and body
    res.json(result);
  } catch (e) {
    next(e);
  }
});

router.delete("/venue/:id", async (req, res, next) => {
  try {
    const result = await VenueController.deletebyId(req.params.id); // Passing req.params.id
    res.json(result);
  } catch (e) {
    next(e);
  }
});
module.exports = router;
