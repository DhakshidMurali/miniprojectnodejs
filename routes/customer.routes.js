const express = require("express");
const {
  getProducts,
  signUp,
  signIn,
  changePassword,
  favouriteProduct,
  orderProducts,
} = require("../controller/customer.controller");
const customerRouter = express.Router();

customerRouter.post("/sign-up", signUp);
customerRouter.post("/sign-in", signIn);
customerRouter.post("/change-password", changePassword);
customerRouter.post("/view-products", getProducts);
customerRouter.post("/order-products", orderProducts);
customerRouter.post("/favourite-products", favouriteProduct);

module.exports = customerRouter;
