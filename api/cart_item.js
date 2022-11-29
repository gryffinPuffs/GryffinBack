const express = require("express");
const { getCartItemById, destroyItemInCart } = require("../db/cart_item");
const { requireUser } = require("./utils");
const cart_itemRouter = express.Router();

cart_itemRouter.patch("/:cart_id", requireUser, async (req, res, next) => {
  const { cart_id } = req.params;
  const { product_id, price, quantity } = req.body;

  const updateFields = {};

  if (product_id) {
    updateFields.product_id = product_id;
  }
  if (price) {
    updateFields.price = price;
  }
  if (quantity) {
    updateFields.quantity = quantity;
  }
  try {
    const originalCart = await getCartItemById(cart_id);
    if (originalCart === req.user.id) {
      const updatedCart = await updateCart({
        id: cart_id,
        product_id,
        price,
        quantity,
      });

      res.send(updatedCart);
    } else {
      next({
        name: "unauthorizedUserError",
        message: `user ${req.user.username} is not allowed to update ${originalCart})
        `,
      });
    }
  } catch (error) {
    throw error;
  }
});

cart_itemRouter.delete("/:cart_id", requireUser, async (req, res, next) => {
  try {
    const cart = await getCartItemById(req.params.cart_id);

    if (cart && cart.user_id === req.user.id) {
      const deleteCartItem = await destroyItemInCart(cart);
      res.send(deleteCartItem);
    } else {
      next({
        name: "unauthorizedUserError",
        message: `user ${req.user.username} is not allowed to delete ${cart.name}`,
      });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});
module.exports = cart_itemRouter;
