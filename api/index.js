
const express = require("express");
const apiRouter = express.Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const { getUserById } = require("../db/users");

apiRouter.use("/", async (req, res, next) => {
  console.log("find some books");
  next();
});

apiRouter.get("/", (req, res) => {
  console.log("A get request was made to /api");
  res.send({ message: "success" });
});

apiRouter.use(async (req, res, next) => {
  const prefix = "Bearer ";
  const auth = req.header("Authorization");

  if (!auth) {
    return next();
  }

  if (!auth.startsWith(prefix)) {
    return next({
      name: "AuthorizationHeaderError",
      message: `Authorization token must start with ${prefix}`,
    });
  }

  if (!JWT_SECRET) {
    return next({
      name: "ConfigurationError",
      message: "JWT_SECRET is not configured.",
    });
  }

  const token = auth.slice(prefix.length);

  try {
    const { id } = jwt.verify(token, JWT_SECRET, {
      algorithms: ["HS256"],
    });

    if (!id) {
      return next({
        name: "AuthorizationError",
        message: "Invalid authentication token.",
      });
    }

    req.user = await getUserById(id);

    if (!req.user) {
      return next({
        name: "AuthorizationError",
        message: "User not found.",
      });
    }

    return next();
  } catch (error) {
    return next({
      name: error.name,
      message: error.message,
    });
  }
});

const addressRouter = require("./address");
apiRouter.use("/address", addressRouter);

const userRouter = require("./user");
apiRouter.use("/user", userRouter);

const productRouter = require("./product");
apiRouter.use("/product", productRouter);

const cartRouter = require("./cart");
apiRouter.use("/cart", cartRouter);

const cart_itemRouter = require("./cart_item");
apiRouter.use("/cart_item", cart_itemRouter);

apiRouter.use((error, req, res, next) => {
  const status =
    error.name === "AuthorizationError" ||
      error.name === "AuthorizationHeaderError" ||
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
      ? 401
      : 500;

  res.status(status).send({
    error: error.name || "ServerError",
    message: error.message || "An unexpected error occurred.",
  });
});

module.exports = apiRouter;

