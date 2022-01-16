const express = require("express");
const {
  newTrip,
  getTrip,
  getDemandSpecies,
  getAmount,
} = require("../controller/fisher.controller");
const fishmanRouter = express.Router();

fishmanRouter.post("/book-trip", newTrip);
fishmanRouter.post("/get-triplist", getTrip);
fishmanRouter.post("/get-demandspecies", getDemandSpecies);
fishmanRouter.post("/get-amount", getAmount);

module.exports = fishmanRouter;
