const express = require("express");
const cartRouter = express.Router();
const { getAllCarts } = require("../db/cart");

// GET /api/cart
cartRouter.get("/", async (req, res, next) => {
  try {
    const allCarts = await getAllCarts();
    res.send(allCarts);
  } catch ({ name, message, error }) {
    next({ name, message, error });
  }
});
// POST /api/cart
//QUESTION verify if needed.
//Do we need update cart?

module.exports = cartRouter;
