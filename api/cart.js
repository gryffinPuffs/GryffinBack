const express = require("express");
const cartRouter = express.Router();
const { getAllCarts } = require("../db/cart");
const { attachProductsToCart } = require("../db/product");

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
//PATCH /api/cart
cartRouter.patch(
  "/:cartId/cart_items",

  async (req, res, next) => {
    try {
      const cartId = req.params.cartId;
      const cart = await getCartById(cartId);

      if (cart) {
        {
          const updatedCartItems = await attachProductsToCart({
            cart_id,
            product_id,
            price,
            quantity,
          });

          res.send(updatedCartItems);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
);

module.exports = cartRouter;
