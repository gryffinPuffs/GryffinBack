const express = require("express");
const addressRouter = express.Router();

addressRouter.use((req, res, next) => {
  console.log("A request is being made to /address");
  next();
});

module.exports = addressRouter;
