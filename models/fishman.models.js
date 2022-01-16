const mongo = require("mongoose");

const fishmanSchema = new mongo.Schema({
  fisherName: {
    type: String,
    require: true,
  },
  amount: {
    type: Number,
    default: 0,
  },
  role: {
    type: String,
    default: "fisher",
  },
  pin: {
    type: Number,
    require: true,
    unique:true
  },
});
module.exports = mongo.model("Fisher", fishmanSchema);
