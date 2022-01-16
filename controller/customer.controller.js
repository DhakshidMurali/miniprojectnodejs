const fisherModels = require("../models/fishman.models");
const customerModels = require("../models/customer.models");
const HttpError = require("../models/error.models");
const speciesModels = require("../models/species.models");
const customerRouter = require("../routes/customer.routes");
const fishmanModels = require("../models/fishman.models");
const stockModels = require("../models/stock.models.js");
const deliveryModels = require("../models/delivery.models");

const getProducts = async (req, res, next) => {
  //   let findMail = req.body.mail;
  // try {
  //   let findfavourite = customerModels.find({
  //     customerMail: findMail,
  //   });
  // } catch {
  //   const error = new HttpError("Error No Fisher Man Details", 500);
  //   return next(error);
  // }
  let species;
  try {
    species = await speciesModels.find({
      available: true,
    });
  } catch {
    const error = new HttpError("Error", 500);
    return next(error);
  }
  if (!species) {
    const error = new HttpError("No Stock to display", 500);
    return next(error);
  }
  console.log(species);
  let data = species.map(({ speciesName, total_stock }) => ({
    speciesName,
    total_stock,
  }));
  res.status(201).json({
    data: data,
    code: 200,
  });
};

const signUp = async (req, res, next) => {
  let customerDetails = req.body;
  let checkCustomer;
  try {
    checkCustomer = await customerModels.findOne({
      customerMail: customerDetails.customerMail,
    });
  } catch {
    const error = new HttpError("Error", 500);
    return next(error);
  }
  if (checkCustomer) {
    const error = new HttpError("Email already Exists", 500);
    return next(error);
  }
  let saveCustomer = customerModels(customerDetails);
  try {
    saveCustomer.save();
  } catch {
    const error = new HttpError("Error", 500);
    return next(error);
  }
  res.status(201).json({
    status: "Successfully login",
    code: 200,
  });
};

const signIn = async (req, res, next) => {
  let customerDetails = req.body;
  let checkCustomer;
  try {
    checkCustomer = await customerModels.findOne({
      customerMail: customerDetails.customerMail,
      password: customerDetails.password,
    });
  } catch {
    const error = new HttpError("Error", 500);
    return next(error);
  }
  if (!checkCustomer) {
    const error = new HttpError("Email does not Exists", 500);
    return next(error);
  }
  res.status(201).json({
    data: checkCustomer,
    status: "Successfully login",
    code: 200,
  });
};

const changePassword = async (req, res, next) => {
  let customerDetails = req.body;
  let checkCustomer;
  try {
    checkCustomer = await customerModels.findOne({
      customerMail: customerDetails.customerMail,
      password: customerDetails.password,
    });
  } catch {
    const error = new HttpError("Error", 500);
    return next(error);
  }
  if (!checkCustomer) {
    const error = new HttpError("Email does not Exists", 500);
    return next(error);
  }
  try {
    checkCustomer.password = customerDetails.newPassword;
    await checkCustomer.save();
  } catch {
    const error = new HttpError("Error", 500);
    return next(error);
  }
  res.status(201).json({
    status: "Successfully changed",
    code: 200,
  });
};

const favouriteProduct = async (req, res, next) => {
  let customerDetails = req.body;
  let findcustomer;
  let findSpecies;
  try {
    findcustomer = await customerModels.findOne({
      customerMail: customerDetails.customerMail,
    });
    findSpecies = await speciesModels.findOne({
      speciesName: customerDetails.product,
    });
  } catch {
    const error = new HttpError("Error", 500);
    return next(error);
  }
  if (!findcustomer) {
    const error = new HttpError("Email does not Exists", 500);
    return next(error);
  }
  if (findcustomer.favourite.includes(customerDetails.product)) {
    const error = new HttpError("Already it Exists", 500);
    return next(error);
  }
  try {
    findcustomer.favourite.push(customerDetails.product);
    findSpecies.favourite_count = findSpecies.favourite_count + 1;
    console.log(findSpecies);
    await findSpecies.save();
    await findcustomer.save();
  } catch {
    const error = new HttpError("Error", 500);
    return next(error);
  }
  res.status(201).json({
    status: "Successfully Added",
    code: 200,
  });
};

const orderProducts = async (req, res, next) => {
  let orderDetails = req.body;
  let findSpecies;
  let speciesList = orderDetails.speciesName;
  speciesList = speciesList.slice(1, -1);
  speciesList = speciesList.split(",");
  let speciesCountList = orderDetails.count;
  speciesCountList = speciesCountList.slice(1, -1);
  speciesCountList = speciesCountList.split(",");
  let calculatePriceforCustomer = 0;

  for (
    let speciesCount = 0;
    speciesCount < speciesList.length;
    speciesCount++
  ) {
    let particularSpeciesName = speciesList[speciesCount];
    let particularSpeciesCount = speciesCountList[speciesCount];
    // updateStock
    try {
      findSpecies = await speciesModels.findOne({
        speciesName: particularSpeciesName,
      });
    } catch {
      const error = new HttpError("Error1", 500);
      return next(error);
    }
    console.log(" fisherman 2update" + findSpecies);
    let orderCount = particularSpeciesCount;
    findSpecies.total_stock = findSpecies.total_stock - orderCount;
    let reduceStock = findSpecies.stock;
    let reduceStock_1 = findSpecies.stock;
    let reduceFisherPin = findSpecies.fisherPin;
    let i = 0;
    console.log(" fisherman1 update");
    while (1) {
      if (orderCount == 0) {
        console.log(" fisherman update");
        break;
      }
      if (orderCount - reduceStock[i] >= 0) {
        console.log(" fisherman update");
        orderCount = orderCount - reduceStock[i];
        i++;
      } else {
        reduceStock[i] = reduceStock[i] - orderCount;
        break;
      }
    }

    console.log(" fisherman update" + i);
    //fisherman update
    let calculatePriceforFisher = 0;
    //halfly purchased
    if (orderCount != 0) {
      let fishermanPin = reduceFisherPin[i];
      try {
        let findFisherman = await fisherModels.findOne({
          pin: fishermanPin,
        });
        console.log(reduceStock_1[i]);
        console.log(findSpecies.price);
        calculatePriceforFisher = orderCount * findSpecies.price;
        console.log(calculatePriceforFisher + "assaas");
        calculatePriceforCustomer =
          calculatePriceforCustomer + calculatePriceforFisher;
        findFisherman.amount = findFisherman.amount + calculatePriceforFisher;
        const saveFisherman = fishmanModels(findFisherman);
        console.log("save" + saveFisherman);
        // await saveFisherman.save();
      } catch {
        const error = new HttpError("Error", 500);
        return next(error);
      }
    }
    //fully purchased
    for (let j = 0; j < i; j++) {
      let fishermanPin = reduceFisherPin[j];
      try {
        let findFisherman = await fisherModels.findOne({
          pin: fishermanPin,
        });
        console.log(reduceStock_1[j]);
        console.log(findSpecies.price);
        calculatePriceforFisher = reduceStock_1[j] * findSpecies.price;
        console.log(calculatePriceforFisher + "assaas");
        calculatePriceforCustomer =
          calculatePriceforCustomer + calculatePriceforFisher;
        findFisherman.amount = findFisherman.amount + calculatePriceforFisher;
        const saveFisherman = fishmanModels(findFisherman);
        console.log("save" + saveFisherman);
        // await saveFisherman.save();
      } catch {
        const error = new HttpError("Error" + j, 500);
        return next(error);
      }
    }

    //update customer
    console.log(" update customer");
    try {
      let findCustomer = await customerModels.findOne({
        customerMail: orderDetails.customerMail,
      });
      findCustomer.amount = findCustomer.amount + calculatePriceforFisher;
      let saveCustomer = customerModels(findCustomer);
      console.log(saveCustomer);
      // await saveCustomer.save();
    } catch {
      const error = new HttpError("Error3", 500);
      return next(error);
    }

    //update Trip
    console.log("update Trip");
    try {
      let orderCount_2 = particularSpeciesCount;
      for (let j = 0; j <= i; j++) {
        console.log(j);
        let fishermanPin = reduceFisherPin[j];

        let findTrip = await stockModels.find({
          fisherPin: fishermanPin,
          paid: false,
          species: particularSpeciesName,
        });
        console.log(fishermanPin);
        for (let k = 0; k < findTrip.length; k++) {
          if (orderCount_2 == 0) {
            break;
          }
          if (orderCount_2 - findTrip[k].pending >= 0) {
            let calculatePriceforTrip = findTrip[k].pending * findSpecies.price;
            orderCount_2 = orderCount_2 - findTrip[k].pending;
            findTrip[k].price = findTrip[k].price + calculatePriceforTrip;
            findTrip[k].pending = 0;
            findTrip[k].paid = true;
            let saveTrip = stockModels(findTrip[k]);
            console.log(saveTrip);
            // await saveTrip.save();
          } else {
            let calculatePriceforTrip = orderCount_2 * findSpecies.price;
            findTrip[k].price = findTrip[k].price + calculatePriceforTrip;
            findTrip[k].pending = findTrip[k].pending - orderCount_2;
            let saveTrip = stockModels(findTrip[k]);
            console.log(saveTrip);
            // await saveTrip.save();
            break;
          }
        }
      }
    } catch {
      const error = new HttpError("Error4", 500);
      return next(error);
    }
    reduceStock = reduceStock.slice(i, reduceStock.length);
    reduceFisherPin = reduceFisherPin.slice(i, reduceFisherPin.length);
    findSpecies.stock = reduceStock;
    findSpecies.fisherPin = reduceFisherPin;
    try {
      if (reduceStock == 0) {
        findSpecies.available = false;
      }
      // await findSpecies.save();
      console.log(findSpecies);
    } catch {
      const error = new HttpError("Error5", 500);
      return next(error);
    }
  }
  //update delivery
  try {
    let saveDelivery = deliveryModels();
    let findCustomer = await customerModels.findOne({
      customerMail: orderDetails.customerMail,
    });
    saveDelivery.customerName = findCustomer.customerName;
    saveDelivery.customerAddress = findCustomer.customerAddress;
    saveDelivery.speciesName = speciesList;
    saveDelivery.speciesQuantity = speciesCountList;
    saveDelivery.amount = calculatePriceforCustomer;
    await saveDelivery.save();
  } catch {
    const error = new HttpError("Error", 500);
    return next(error);
  }
  res.status(201).json({
    amount: calculatePriceforCustomer,
  });
};

exports.getProducts = getProducts;

exports.signUp = signUp;

exports.signIn = signIn;

exports.changePassword = changePassword;

exports.favouriteProduct = favouriteProduct;

exports.orderProducts = orderProducts;

exports.orderProducts = orderProducts;
