const mongo = require("mongoose");
const speciesSchema = new mongo.Schema({
  speciesName: {
    type: String,
  },
  fisherPin: {
    type: [String],
  },
  stock: {
    type: [Number],
  },
  available: {
    type: Boolean,
    default: true,
  },
  total_stock: {
    type: Number,
    default: 0,
  },
  favourite_count: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
  },
});
module.exports = mongo.model("Species", speciesSchema);
