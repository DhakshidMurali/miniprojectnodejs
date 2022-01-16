const mongo = require("mongoose");
const deliverySchema = new mongo.Schema({
  customerName: {
    type: String,
    required: true,
  },
  customerAddress: {
    type: String,
  },
  bucketno: {
    type: Number,
  },
  speciesName: {
    type: [String],
  },
  speciesQuantity: {
    type: [Number],
  },
  amount: {
    type: Number,
    require: true,
  },
  assigned: {
    type: Boolean,
    default: false,
  },
  deliveryMan: {
    type: String,
  },
  delivered: {
    type: Boolean,
    default: false,
  },
  date: {
    type: String,
    default: Date().toString().slice(4, 15),
  },
});
module.exports = mongo.model("Delivery", deliverySchema);
