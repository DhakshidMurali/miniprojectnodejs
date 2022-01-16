const express = require("express");

const admincontroller = require("../controller/admin.controller");
const adminRouter = express.Router();

adminRouter.post("/view-fisher", admincontroller.viewFisherman);
adminRouter.post("/add-fisher", admincontroller.addFisherman);
adminRouter.post("/change-pin", admincontroller.changePin);
adminRouter.post("/view-fisherdetails", admincontroller.viewFisherDetails);
adminRouter.post("/view-customer", admincontroller.viewCustomer);
adminRouter.post("/view-customerdetails", admincontroller.viewCustomerDetails);
adminRouter.post("/view-delivery", admincontroller.viewDelivery);
adminRouter.post("/view-pendingdelivery", admincontroller.viewPendingDelivery);
adminRouter.post("/add-deliverman", admincontroller.addDeliveryman);
adminRouter.post("/assign-delivery", admincontroller.assignDelivery);
adminRouter.post("/set-price", admincontroller.setPrice);
adminRouter.post("/view-unassigned", admincontroller.getUnassigned);
adminRouter.post("/view-datedetails", admincontroller.dateDetails);
adminRouter.post("/get-email", admincontroller.getEmail);

module.exports = adminRouter;
