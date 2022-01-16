const mongo = require("mongoose");
const stockSchema = new mongo.Schema({
  fisherName: {
    type: String,
    require: true,
  },
  fisherPin: {
    type: Number,
    required: true,
  },
  tripName: {
    type: String,
    require: true,
  },
  species: {
    type: String,
    require: true,
  },
  speciesQuantity: {
    type: Number,
    require: true,
  },
  price: {
    type: Number,
    default: 0,
  },
  date: {
    type: String,
    default: Date().toString().slice(4, 15),
  },
  paid: {
    type: Boolean,
    default: false,
  },
  pending:{
    type:Number,
  }
});
module.exports = mongo.model("Stock", stockSchema);
