
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");


const deliverymanRouter = require("./routes/deliveryman.routes");
const customerRouter = require("./routes/customer.routes");
const adminRouter = require("./routes/admin.routes");
const fishmanRouter = require("./routes/fishman.routes");

const app = express();

app.use(cors());

app.use(express.json());

app.use("/delivery", deliverymanRouter);

app.use("/customer", customerRouter);

app.use("/admin", adminRouter);

app.use("/fisher", fishmanRouter);

mongoose
  .connect(
    "mongodb+srv://Roseline:roseline@cluster0.0ruvr.mongodb.net/roseline?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connected");
    app.listen(process.env.PORT || 8080);
  })
  .catch((err) => console.log(err));
