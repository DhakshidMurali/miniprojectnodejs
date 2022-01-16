const mongo = require("mongoose");

const customerSchema = new mongo.Schema({
  customerName: {
    type: String,
    require: true,
  },
  customerMail: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  products: {
    type: Array,
  },
  favourite: {
    type: Array,
  },
  amount: {
    type: Number,
    default: 0,
  },
  role: {
    type: String,
    default: "customer",
  },
  customerAddress: {
    type: String,
  },
});

module.exports = mongo.model("Customer", customerSchema);
