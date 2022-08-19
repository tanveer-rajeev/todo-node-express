const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const todoHandler = require("./routeHandler/TodoHandler");
const userHandler = require("./routeHandler/UserHandler");
const app = express();

dotenv.config();
app.use(express.json());

// database connection
mongoose
  .connect("mongodb://localhost/todos")
  .then((res) => console.log("Connection successfully"))
  .catch((err) => console.log(err));

// application routes
app.use("/todo", todoHandler);
app.use("/user", userHandler);

const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).json({ error: err });
};
app.use(errorHandler);

app.listen(3000, () => {
  console.log("listening on port 3000");
});
