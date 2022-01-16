const express = require("express");
const { getTask, taskCompleted } = require("../controller/deliveryman.models");
const deliverymanRouter = express.Router();

deliverymanRouter.post("/get-assigntask", getTask);
deliverymanRouter.post("/task-completed", taskCompleted);

module.exports = deliverymanRouter;
