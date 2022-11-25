const express = require("express");
const apiRouter = express.Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const { getUserById } = require("../db");

const usersRouter = require("./users");
apiRouter.use("/users", usersRouter);

const addressRouter = require("./product");
apiRouter.use("/product", addressRouter);

const productsRouter = require("./product");
apiRouter.use("/product", productsRouter);

const cartsRouter = require("./cart");
apiRouter.use("/cart", cartsRouter);

const cart_itemRouter = require("./cart");
apiRouter.use("/cart", cart_itemRouter);

apiRouter.use(async (req, res, next) => {
  const prefix = "Bearer ";
  const auth = req.header("Authorization");
  if (!auth) {
    next();
  } else if (auth.startsWith(prefix)) {
    const token = auth.slice(prefix.length);
    try {
      const { id } = jwt.verify(token, JWT_SECRET);
      if (id) {
        req.user = await getUserById(id);
        next();
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  } else {
    next({
      name: "AuthorizationHeaderError",
      message: `Authorization token must start with ${prefix}`,
    });
  }
});

apiRouter.use((error, req, res, next) => {
  error.error == "Unauthorized" && res.status(401);
  const errorObj = {
    error: error.name,
    name: error.name,
    message: error.message,
  };
  res.send(errorObj);
});

module.exports = apiRouter;
