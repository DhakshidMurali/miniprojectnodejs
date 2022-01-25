const customerModels = require("../models/customer.models");
const deliveryModels = require("../models/delivery.models");
const deliverymanModels = require("../models/deliveryman.models");
const HttpError = require("../models/error.models");
const Fisher = require("../models/fishman.models");
const speciesModels = require("../models/species.models");
const stockModels = require("../models/stock.models");
const nodemailer = require("nodemailer");
const Excel = require("exceljs");
const fs = require("fs");

const viewFisherman = async (req, res, next) => {
  let fisherdetails;
  try {
    fisherdetails = await Fisher.find({
      role: "fisher",
    }).select({
      fisherName: 1,
      amount: 1,
      _id: 0,
    });
  } catch {
    const error = new HttpError("Error No Fisher Man Details", 500);
    return next(error);
  }
  res.status(201).json({
    details: fisherdetails,
  });
};

const addFisherman = async (req, res, next) => {
  let fisher = req.body;
  const savefisher = Fisher();
  savefisher.fisherName = fisher.name;
  savefisher.pin = fisher.pin;
  try {
    savefisher.save();
  } catch {
    const error = new HttpError("Error add Fisher Man Details", 500);
    return next(error);
  }
  res.status(201).json({
    name: savefisher.fisherName,
    code: "201",
  });
};

const changePin = async (req, res, next) => {
  let fisher = req.body;
  let findfisher;
  try {
    findfisher = await Fisher.findOne({
      pin: fisher.pin,
    });
  } catch {
    const error = new HttpError("Fisher name not available", 500);
    return next(error);
  }
  if (findfisher) {
    findfisher.pin = fisher.newpin;
  }
  try {
    await findfisher.save();
  } catch {
    const error = new HttpError("Fisher not able to update", 500);
    return next(error);
  }
  res.status(201).json({
    code: 200,
  });
};

const viewFisherDetails = async (req, res, next) => {
  let fisherpin = req.body;
  let findFisherDetails;
  try {
    findFisherDetails = await Fisher.findOne({
      pin: fisherpin.pin,
    });
  } catch {
    const error = new HttpError("Fisher not able to update", 500);
    return next(error);
  }
  res.status(201).json({
    data: findFisherDetails,
    status: 200,
  });
};

const viewCustomer = async (req, res, next) => {
  let viewCustomer;
  try {
    viewCustomer = await customerModels
      .find({
        role: "customer",
      })
      .select({
        customerName: 1,
        amount: 1,
        _id: 0,
      });
  } catch {
    const error = new HttpError("Error No Fisher Man Details", 500);
    return next(error);
  }
  res.status(201).json({
    data: viewCustomer,
    status: 201,
  });
};

const viewCustomerDetails = async (req, res, next) => {
  let CustomerMail = req.body;
  let findCustomerDetails;
  try {
    findCustomerDetails = await customerModels.findOne({
      customerMail: CustomerMail.mail,
    });
  } catch {
    const error = new HttpError("Fisher not able to update", 500);
    return next(error);
  }
  res.status(201).json({
    data: findCustomerDetails,
    status: 200,
  });
};

const viewDelivery = async (req, res, next) => {
  let viewDelivery;
  try {
    viewDelivery = await deliveryModels.find({
      delivered: true,
    });
  } catch {
    const error = new HttpError("No Delivery ", 500);
    return next(error);
  }
  res.status(201).json({
    data: viewDelivery,
    status: 200,
  });
};

const viewPendingDelivery = async (req, res, next) => {
  let viewDelivery;
  try {
    viewDelivery = await deliveryModels.find({
      delivered: false,
    });
  } catch {
    const error = new HttpError("No Delivery ", 500);
    return next(error);
  }
  res.status(201).json({
    data: viewDelivery,
    status: 200,
  });
};
const addDeliveryman = async (req, res, next) => {
  let addDeliveryman = req.body;
  let saveDeliveryman = deliverymanModels();
  saveDeliveryman.deliverName = addDeliveryman.deliverName;
  console.log(saveDeliveryman);
  try {
    await saveDeliveryman.save();
  } catch {
    const error = new HttpError("Error", 500);
    return next(error);
  }
  res.status(201).json({
    deliverName: saveDeliveryman.deliverName,
    status: 200,
  });
};

const getUnassigned = async (req, res, next) => {
  let viewDelivery;
  try {
    viewDelivery = await deliveryModels.find({
      assigned: false,
    });
  } catch {
    const error = new HttpError("No Delivery ", 500);
    return next(error);
  }
  res.status(201).json({
    data: viewDelivery,
    status: 200,
  });
};

const assignDelivery = async (req, res, next) => {
  let deliveryDetails = req.body;
  let findFreeDeliveryMan;
  try {
    let findDelivery = await deliveryModels.findOne({
      customerName: deliveryDetails.customerName,
    });
    console.log(findDelivery);
    findFreeDeliveryMan = await deliverymanModels.findOne({
      available: true,
    });
    if (!findFreeDeliveryMan) {
      const error = new HttpError("NO Free Delivery Man", 500);
      return next(error);
    }
    findDelivery.deliveryMan = findFreeDeliveryMan.deliverName;
    findDelivery.bucketno = deliveryDetails.bucketno;
    findDelivery.assigned = true;
    findFreeDeliveryMan.available = false;
    console.log(findDelivery);
    await findDelivery.save();
    await findFreeDeliveryMan.save();
  } catch {
    const error = new HttpError("Error", 500);
    return next(error);
  }
  res.status(201).json({
    deliverName: findFreeDeliveryMan.deliverName,
    status: 200,
  });
};

const setPrice = async (req, res, next) => {
  let setSpeciesPrice = req.body;
  let findSpecies;
  try {
    findSpecies = await speciesModels.findOne({
      speciesName: setSpeciesPrice.speciesName,
    });
    findSpecies.price = setSpeciesPrice.price;
    await findSpecies.save();
  } catch {
    const error = new HttpError("Error", 500);
    return next(error);
  }
  res.status(201).json({
    speciesName: findSpecies.speciesName,
    speciesPrice: findSpecies.price,
    status: 200,
  });
};

const dateDetails = async (req, res, next) => {
  let getDate = req.body;
  let findDateDelivery;
  let findDateTrip;
  try {
    findDateDelivery = await deliveryModels.find({
      date: getDate.date,
    });
    findDateTrip = await stockModels.find({
      data: getDate.date,
    });
  } catch {
    const error = new HttpError("Error", 500);
    return next(error);
  }
  res.status(201).json({
    Delivery: findDateDelivery,
    Trip: findDateTrip,
    status: 200,
  });
};

const getEmail = async (req, res, next) => {
  let getDate = req.body;
  let startDate = new Date(getDate.startDate);
  let endDate = new Date(getDate.endDate);
  let formattedStartDate = formatDate(startDate);
  let formattedEndate = formatDate(endDate);
  console.log(formattedStartDate);
  console.log(formattedEndate);
  function formatDate(date) {
    var day = date.getDate();
    if (day < 10) {
      day = "0" + day;
    }
    var month = date.getMonth() + 1;
    if (month < 10) {
      month = "0" + month;
    }
    var year = date.getFullYear();
    return year + "-" + month + "-" + day;
  }
  var noOfDays = Math.floor(
    (Date.parse(getDate.endDate) - Date.parse(getDate.startDate)) / 86400000
  );
  let customerNameList = [];
  let speciesNameList = [];
  let speciesCountList = [];
  let amountList = [];
  let fisherNameList = [];
  let amountFisherList = [];
  let speciesNameListStock = [];
  let speciesCountListStock = [];
  let deliverNamelist = [];
  let deliverCount = [];
  let mydate = new Date(formattedStartDate);
  for (let i = 0; i < noOfDays; i++) {
    let stringDate = mydate.toDateString().toString().slice(4, 15);
    console.log(stringDate);
    try {
      let findDelivery = await deliveryModels.find({
        // delivered: true,
        date: stringDate,
      });
      let findStock = await stockModels.find({
        date: stringDate,
      });

      for (let i = 0; i < findDelivery.length; i++) {
        let delivery = findDelivery[i];
        console.log(delivery.customerName);
        console.log(customerNameList.includes(delivery.customerName));

        if (!customerNameList.includes(delivery.customerName)) {
          console.log(123);
          customerNameList[customerNameList.length] = delivery.customerName;
        }

        let findcustomerIndex = 0;
        for (let i = 0; i < customerNameList.length; i++) {
          if (customerNameList[i] == delivery.customerName) {
            findcustomerIndex = i;
            break;
          }
        }
        if (isNaN(amountList[findcustomerIndex])) {
          amountList[findcustomerIndex] = 0;
        }
        amountList[findcustomerIndex] =
          delivery.amount + amountList[findcustomerIndex];
        //species
        for (let j = 0; j < delivery.speciesName.length; j++) {
          try {
            if (speciesNameList[findcustomerIndex].length == 0) {
              speciesNameList[findcustomerIndex] = [];
            }
          } catch {
            speciesNameList[findcustomerIndex] = [];
          }
          if (
            !speciesNameList[findcustomerIndex].includes(
              delivery.speciesName[j]
            )
          ) {
            speciesNameList[findcustomerIndex][
              speciesNameList[findcustomerIndex].length
            ] = delivery.speciesName[j];
          }
        }
        console.log(3);
        console.log(speciesNameList);

        //speciesCount
        try {
          if (speciesCountList[findcustomerIndex].length == 0) {
            speciesCountList[findcustomerIndex] = [];
          }
        } catch {
          speciesCountList[findcustomerIndex] = [];
        }
        let findSpeciesIndex = 0;
        for (let i = 0; i < delivery.speciesName.length; i++) {
          let species = delivery.speciesName[i];
          for (let j = 0; j < speciesNameList[findcustomerIndex].length; j++) {
            if (speciesNameList[findcustomerIndex][j] == species) {
              findSpeciesIndex = j;
              break;
            }
          }
          if (isNaN(speciesCountList[findcustomerIndex][findSpeciesIndex])) {
            speciesCountList[findcustomerIndex][findSpeciesIndex] = 0;
          }
          speciesCountList[findcustomerIndex][findSpeciesIndex] =
            speciesCountList[findcustomerIndex][findSpeciesIndex] +
            delivery.speciesQuantity[i];
        }

        console.log(speciesCountList);
      }

      //fisher

      for (let i = 0; i < findStock.length; i++) {
        let stock = findStock[i];
        console.log(stock.fisherName);
        console.log(fisherNameList.includes(stock.fisherName));

        if (!fisherNameList.includes(stock.fisherName)) {
          console.log(123);
          fisherNameList[fisherNameList.length] = stock.fisherName;
        }

        let findfisherIndex = 0;
        for (let i = 0; i < fisherNameList.length; i++) {
          if (fisherNameList[i] == stock.fisherName) {
            findfisherIndex = i;
            break;
          }
        }
        if (isNaN(amountFisherList[findfisherIndex])) {
          amountFisherList[findfisherIndex] = 0;
        }
        amountFisherList[findfisherIndex] =
          stock.price + amountFisherList[findfisherIndex];
        //species
        try {
          if (speciesNameListStock[findfisherIndex].length == 0) {
            speciesNameListStock[findfisherIndex] = [];
          }
        } catch {
          speciesNameListStock[findfisherIndex] = [];
        }
        console.log("asas" + stock.species);
        if (!speciesNameListStock[findfisherIndex].includes(stock.species)) {
          speciesNameListStock[findfisherIndex][
            speciesNameListStock[findfisherIndex].length
          ] = stock.species;
        }

        console.log(3);
        console.log(speciesNameListStock);

        //speciesCount
        try {
          if (speciesCountListStock[findfisherIndex].length == 0) {
            speciesCountListStock[findfisherIndex] = [];
          }
        } catch {
          speciesCountListStock[findfisherIndex] = [];
        }
        let findSpeciesIndex = 0;
        let species = stock.speciesQuantity;
        for (let j = 0; j < speciesNameListStock[findfisherIndex].length; j++) {
          if (speciesNameListStock[findfisherIndex][j] == species) {
            findSpeciesIndex = j;
            break;
          }
        }
        if (isNaN(speciesCountListStock[findfisherIndex][findSpeciesIndex])) {
          speciesCountListStock[findfisherIndex][findSpeciesIndex] = 0;
        }
        speciesCountListStock[findfisherIndex][findSpeciesIndex] =
          speciesCountListStock[findfisherIndex][findSpeciesIndex] +
          stock.speciesQuantity;

        console.log(speciesCountListStock);
      }

      //deliver

      for (let i = 0; i < findDelivery.length; i++) {
        let delivery = findDelivery[i];
        console.log(delivery.deliveryMan);
        console.log(deliverNamelist.includes(delivery.deliveryMan));

        if (!deliverNamelist.includes(delivery.deliveryMan)) {
          console.log(123);
          deliverNamelist[deliverNamelist.length] = delivery.deliveryMan;
        }
      }

      for (let i = 0; i < deliverNamelist.length; i++) {
        let countDelivery;
        try {
          countDelivery = await deliveryModels.find({
            deliveryMan: deliverNamelist[i],
            date: stringDate,
          });
        } catch {
          const error = new HttpError("Error", 500);
          return next(error);
        }
        if (isNaN(deliverCount[i])) {
          deliverCount[i] = 0;
        }
        deliverCount[i] = deliverCount[i] + countDelivery.length;
        console.log(1224);
      }
    } catch {
      const error = new HttpError("Error", 500);
      return next(error);
    }

    mydate = new Date(mydate.getTime() + 24 * 60 * 60 * 1000);
  }

  console.log("Final");
  console.log(customerNameList);
  console.log(speciesNameList);
  console.log(speciesCountList);
  console.log(amountList);
  console.log(fisherNameList);
  console.log(amountFisherList);
  console.log(speciesNameListStock);
  console.log(speciesCountListStock);
  console.log(deliverNamelist);
  console.log(deliverCount);
  let allDetails = customerNameList.concat(
    speciesNameList,
    speciesCountList,
    amountList,
    fisherNameList,
    amountFisherList,
    speciesNameListStock,
    speciesCountListStock,
    deliverNamelist,
    deliverCount
  );
  let keys = [
    "customerName",
    "speciesName",
    "speciesCount",
    "amountList",
    "fisherMan",
    "fisherAmount",
    "fisherSpeciesName",
    "fisherSpeciesCount",
    "deliverName",
    "deliverCount",
  ];

  let allObj = {};
  for (let i = 0; i < keys.length; i++) {
    allObj[keys[i]] = [];
  }

  for (let i = 0; i < customerNameList.length; i++) {
    for (let j = 0; j < speciesNameList[i].length; j++) {
      allObj[keys[0]][allObj[keys[0]].length] = customerNameList[i];
      allObj[keys[1]][allObj[keys[1]].length] = speciesNameList[j];
      allObj[keys[2]][allObj[keys[2]].length] = speciesCountList[j];
      allObj[keys[3]][allObj[keys[3]].length] = amountList[i];
    }
  }

  for (let i = 0; i < fisherNameList.length; i++) {
    for (let j = 0; j < speciesNameListStock[i].length; j++) {
      allObj[keys[4]][allObj[keys[4]].length] = fisherNameList[i];
      allObj[keys[5]][allObj[keys[5]].length] = amountFisherList[i];
      allObj[keys[6]][allObj[keys[6]].length] = speciesNameListStock[j];
      allObj[keys[7]][allObj[keys[7]].length] = speciesCountListStock[j];
    }
  }

  for (let i = 0; i < deliverNamelist.length; i++) {
    allObj[keys[8]][allObj[keys[8]].length] = deliverNamelist[i];
    allObj[keys[9]][allObj[keys[9]].length] = deliverCount[i];
  }

  const filename = `${getDate.startDate}-${getDate.endDate}.xlsx`;
  let workbook = new Excel.Workbook();
  let worksheet = workbook.addWorksheet();
  // for (let i = 0; i < 10; i++) {
  //   worksheet.getColumn(i).header = keys[i];
  //   worksheet.getColumn(i).key = i;
  // }
  worksheet.columns = [
    {
      header: "Customer",
      key: 1,
    },
    {
      header: "OrderSpecies",
      key: 2,
    },
    {
      header: "Quantity",
      key: 3,
    },
    {
      header: "Totol Amount",
      key: 4,
    },
    {
      header: "Fisher",
      key: 5,
    },
    {
      header: "FisheAmount",
      key: 6,
    },
    {
      header: "SpeciesAdded",
      key: 7,
    },
    {
      header: "SpeciesQuantity",
      key: 8,
    },
    {
      header: "Deliver",
      key: 9,
    },
    {
      header: "No of Deliver",
      key: 10,
    },
  ];
  let temp = 0;
  let temp2 = 0;
  for (let i = 0; i < customerNameList.length; i++) {
    worksheet.getRow(temp).getCell(1).value = customerNameList[i];
    temp = temp + speciesNameList[i].length;
    for (let j = temp2; j < speciesNameList.length; j++) {
      temp2++;
      worksheet.getRow(temp2).getCell(2).value = speciesNameList[j];
      worksheet.getRow(temp2).getCell(3).value = speciesCountList[j];
    }
    worksheet.getRow(temp - 1).getCell(4).value = amountList[i];
  }
  temp = 0;
  temp2 = 0;
  for (let i = 0; i < fisherNameList.length; i++) {
    worksheet.getRow(temp).getCell(5).value = fisherNameList[i];
    temp = temp + speciesNameListStock[i].length;
    for (let j = temp2; j < speciesNameListStock.length; j++) {
      temp2++;
      worksheet.getRow(temp2).getCell(7).value = speciesNameListStock[j];
      worksheet.getRow(temp2).getCell(8).value = speciesCountListStock[j];
    }
    worksheet.getRow(temp - 1).getCell(6).value = amountList[i];
  }
  for (let i = 0; i < deliverNamelist.length; i++) {
    worksheet.getRow(i).getCell(9).value = deliverNamelist[i];
    worksheet.getRow(i).getCell(10).value = deliverCount[i];
  }

  const buffer = await workbook.xlsx.writeBuffer();
  fs.writeFileSync(filename, buffer, "buffer", (err) => {
    if (err) {
      console.log("writeFileSync :", err);
    }
    console.log(filename + " file is saved!");
    console.log(1212);
  });
  console.log(12121);
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
      user: "email123@gmail.com",
      pass: "email@123",
    },
  });
  console.log(12122);
  const mailOptions = {
    from: "equizz123@gmail.com",
    to: "dhakshidmurali2001@gmail.com",
    subject: "subject",
    html: `${getDate.startDate}-${getDate.endDate} Analysis `,
    attachments: [
      {
        filename,
        content: buffer,
        contentType:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    ],
  };
  try {
    console.log(1113);
    await transporter.sendMail(mailOptions).then((res) => console.log(res));
    console.log(1114);
  } catch (e) {
    console.log(e);
    const error = new HttpError("Please try again later3.", 500);
    return next(error);
  }
  console.log(allObj);
  res.status(201).json({
    customerNameList: customerNameList,
    speciesNameList: speciesNameList,
    speciesCountList: speciesCountList,
    amountList: amountList,
    fisherNameList: fisherNameList,
    amountFisherList: amountFisherList,
    speciesNameListStock: speciesNameListStock,
    speciesCountListStock: speciesCountListStock,
    deliverNamelist: deliverNamelist,
    deliverCount: deliverCount,
    allobj: allObj,
  });
};

exports.getEmail = getEmail;

exports.setPrice = setPrice;

exports.dateDetails = dateDetails;

exports.assignDelivery = assignDelivery;

exports.addDeliveryman = addDeliveryman;

exports.viewPendingDelivery = viewPendingDelivery;

exports.viewFisherman = viewFisherman;

exports.addFisherman = addFisherman;

exports.changePin = changePin;

exports.viewFisherDetails = viewFisherDetails;

exports.viewCustomer = viewCustomer;

exports.viewCustomerDetails = viewCustomerDetails;

exports.viewDelivery = viewDelivery;

exports.getUnassigned = getUnassigned;
