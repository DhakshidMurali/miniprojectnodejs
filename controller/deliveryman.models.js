const deliveryModels = require("../models/delivery.models");
const deliverymanModels = require("../models/deliveryman.models");
const HttpError = require("../models/error.models");

const getTask = async (req, res, next) => {
  let deliveryman = req.body;
  let finddelivery;
  try {
    finddelivery = await deliveryModels
      .findOne({
        deliveryman: deliveryman.deliveryMan,
      })
      .select({
        customerName: 1,
        customerAddress: 1,
        bucketno: 1,
        amount: 1,
      });
  } catch {
    const error = new HttpError("Error", 500);
    return next(error);
  }
  res.status(201).json({
    details: finddelivery,
    code: 200,
  });
};

const taskCompleted = async (req, res, next) => {
  let deliveryman = req.body;
  let finddelivery;
  try {
    finddelivery = await deliveryModels.findOne({
      deliveryman: deliveryman.deliveryMan,
    });
    let finddeliver = await deliverymanModels.findOne({
      deliverName: deliveryman.deliveryMan,
    });
    finddeliver.available = true;
    finddelivery.delivered = true;
    await finddeliver.save();
    await finddelivery.save();
  } catch {
    const error = new HttpError("Error", 500);
    return next(error);
  }
  res.status(201).json({
    message: "SucessFul",
    code: 200,
  });
};

exports.getTask = getTask;

exports.taskCompleted = taskCompleted;
