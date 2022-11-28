const express = require("express");
const { getCartItemById } = require("../db/cart_item");
const { requireUser } = require("./utils");
const cart_itemRouter = express.Router();
const{
  getCartItemById,
} = require("../db")

cart_itemRouter.patch("/:cart_id", requireUser, async (req, res, next) => {
  try {
    const { cart_id } = req.params;
    const { product_id, price, quantity } = req.body

    const updateFields = {}

    if (product_id) {
      updateFields.product_id = product_id
    }
    if (price){
      updateFields.price = price
    }
    if (quantity){
      updateFields.quantity = quantity
    }
    try {
      const originalCart = await 
      getCartItemById(cart_id);
      if (originalCart.cart_id = await 
        updateCart({
          id: cart_id,
          product_id,
          price,
          quantity
        }))
        
        res.send(updateCart)
    }else {
      next({
        name: "unauthorizedUserError",
        message: `user ${req.user.username} is not allowed to update ${originalCart})
        `,
      })
    }
  } catch(error) {
    throw error;
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
