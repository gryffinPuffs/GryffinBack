const express = require("express");
const { requireUser } = require("./utils");
const cart_itemRouter = express.Router();

cart_itemRouter.patch("/:cart_id", requireUser, async (req, res, next) => {
  try {
    const {} = req.params;
  } catch {
    next();
  }
});

cart_itemRouter.delete("/:cart_id", requireUser, async (req, res, next) => {
  try {
    const {} = req.params;
  } catch {
    next();
  }
});
module.exports = cart_itemRouter;
