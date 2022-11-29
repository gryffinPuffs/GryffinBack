const e = require("express");
const express = require("express");
const cartRouter = express.Router();
const {
  getAllCarts,
  createCart,
  getActiveCartByUser,
  getInactiveCartsByUser,
} = require("../db/cart");
const { attachProductsToCart } = require("../db/product");
const { requireUser } = require("./utils");

cartRouter.use((req, res, next) => {
  console.log("A request is being made to /cart");
  next();
});

// GET /api/cart
cartRouter.get("/", async (req, res, next) => {
  try {
    const allCarts = await getAllCarts();
    res.send(allCarts);
  } catch ({ name, message, error }) {
    next({ name, message, error });
  }
});

//GET activeCarts
cartRouter.get("/:username/active", requireUser, async (req, res, next) => {
  let { username } = req.params;
  try {
    const userCart = await getActiveCartByUser({ username });
    console.log("this is user cart", userCart);
    res.send(userCart);
  } catch ({ name, message, error }) {
    next({
      name: "noCart",
      message: "Nothing to grab",
      error: `no cart found for ${username}`,
    });
  }
});

//GET inActiveCarts
cartRouter.get("/:username/inactive", requireUser, async (req, res, next) => {
  let { username } = req.params;
  try {
    const userCart = await getInactiveCartsByUser({ username });
    res.send(userCart);
  } catch ({ name, message, error }) {
    next({
      name: "noCart",
      message: "Nothing to grab",
      error: `no inactive carts found for ${username}`,
    });
  }
});
// POST /api/cart
cartRouter.post("/", requireUser, async (req, res, next) => {
  const { user_id, active } = req.body;
  console.log(req.body, "this is req.body");
  const cartData = { user_id, active };
  console.log(cartData, "this is cart data");
  const cart = await createCart(cartData);
  if (cart) {
    res.send(cart);
  } else {
    return null;
  }
});

//Do we need update cart?

//PATCH /api/cart
//I think this needs to be in cart_items
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
