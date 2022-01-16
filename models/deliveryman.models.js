const mongo = require("mongoose");

const deliverymanSchema = new mongo.Schema({
  deliverName: {
    type: String,
    require: true,
  },
  available: {
    type: Boolean,
    required: true,
    default: true,
  },
  role: {
    type: String,
    default: "deliveryman",
  },
});

module.exports = mongo.model("Deliveryman", deliverymanSchema);
