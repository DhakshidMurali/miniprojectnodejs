const HttpError = require("../models/error.models");
const Stock = require("../models/stock.models.js");
const Species = require("../models/species.models.js");
const Fisher = require("../models/fishman.models.js");
const speciesModels = require("../models/species.models.js");

const newTrip = async (req, res, next) => {
  let tripDetails = req.body;
  let saveDetails = Stock(tripDetails);
  try {
    saveDetails.pending = tripDetails.speciesQuantity;
    await saveDetails.save();
  } catch {
    const error = new HttpError("Error No Fisher Man Details", 500);
    return next(error);
  }

  let findSpecies;
  try {
    findSpecies = await Species.findOne({
      speciesName: tripDetails.species,
    });
  } catch {
    const error = new HttpError("Error No Species available", 500);
    return next(error);
  }
  if (!findSpecies) {
    findSpecies = new Species();
    findSpecies.speciesName = tripDetails.species;
  }
  try {
    findSpecies.fisherPin.push(tripDetails.fisherPin);
    findSpecies.stock.push(tripDetails.speciesQuantity);
    let count = findSpecies.stock;
    let sum = count.reduce(function (a, b) {
      return a + b;
    }, 0);
    findSpecies.total_stock = sum;
    if (sum > 0) {
      findSpecies.available = true;
    }
    await findSpecies.save();
  } catch {
    const error = new HttpError("Error No Fisher Man Details", 500);
    return next(error);
  }

  res.status(201).json({
    trip: saveDetails,
    code: 200,
  });
};

const getTrip = async (req, res, next) => {
  let findFishername = req.body.name;
  let fisherDetails;
  try {
    fisherDetails = await Stock.find({
      fisherName: findFishername,
    });
  } catch {
    const error = new HttpError("Error No Fisher Man Details", 500);
    return next(error);
  }
  if (!fisherDetails) {
    return res.status(201).json({
      error_message: "Fisher man Not available",
    });
  }
  res.status(201).json({
    data: fisherDetails,
    count: fisherDetails.length,
  });
};

const getDemandSpecies = async (req, res, next) => {
  let species;
  try {
    species = await speciesModels.find().sort({ favourite_count: -1 }).select({
      _id: 0,
      fisherPin: 0,
      stock: 0,
      available: 0,
      total_stock: 0,
      price: 0,
    });
  } catch {
    const error = new HttpError("Error", 500);
    return next(error);
  }
  res.status(201).json({
    demandSpecies: species,
    code: 200,
  });
};

const getAmount = async (req, res, next) => {
  let fisherDetails = req.body;
  let findFisher;
  try {
    findFisher = await Fisher.findOne({
      pin: fisherDetails.pin,
    });
  } catch {
    const error = new HttpError("Error", 500);
    return next(error);
  }
  console.log(findFisher);
  res.status(201).json({
    amount: findFisher.amount,
    status: 200,
  });
};
exports.getTrip = getTrip;

exports.newTrip = newTrip;

exports.getDemandSpecies = getDemandSpecies;

exports.getAmount = getAmount;
