const express = require("express");
const {
  getCartItemById,
  destroyItemInCart,
  editCartItem,
} = require("../db/cart_item");
const { requireUser } = require("./utils");
const cart_itemRouter = express.Router();

cart_itemRouter.patch("/:cart_itemId", requireUser, async (req, res, next) => {
  console.log("hello");
  const { cart_itemId } = req.params;
  console.log("cart_itemId", cart_itemId);
  const { product_id, price, quantity } = req.body;
  console.log("this is req.body", req.body);

  const updateFields = {};

  // if (product_id) {
  //   updateFields.product_id = product_id;
  // }
  // if (price) {
  //   updateFields.price = price;
  // }
  if (quantity) {
    updateFields.quantity = quantity;
  }
  try {
    const originalCart = await getCartItemById(product_id);
    console.log("original cart", originalCart);
    if (originalCart && originalCart.id) {
      const updatedCart = await editCartItem(cart_itemId, {
        product_id: originalCart.product_id,
        price: originalCart.price,
        quantity,
      });

      res.send(updatedCart);
    } else {
      next({
        name: "unauthorizedUserError",
        message: `user ${req.user.username} is not allowed to update ${originalCart}
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
