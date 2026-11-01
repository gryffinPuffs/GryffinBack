const express = require("express");
const userRouter = express.Router();
const jwt = require("jsonwebtoken");

const {
  getActiveCartByUserId,
} = require("../db/cart");

const {
  createUser,
  getUser,
  getWithUsername,
  getAllUsers,
} = require("../db/users");

const { requireAdmin } = require("./utils");

// Check JWT configuration
function createToken(userId) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured.");
  }

  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    {
      expiresIn: "1w",
      algorithm: "HS256",
    }
  );
}

// Request logging
userRouter.use((req, res, next) => {
  console.log("A request is being made to /user");
  next();
});

// User login
userRouter.post("/login", async (req, res, next) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      return res.status(400).send({
        error: "ValidationError",
        message: "Username and password are required.",
      });
    }

    const user = await getUser({ username, password });

    if (!user) {
      return next({
        name: "IncorrectCredentialsError",
        message: "Username or password is incorrect.",
      });
    }

    const cart = await getActiveCartByUserId({
      userId: user.id,
    });

    user.cart = cart;

    const token = createToken(user.id);

    res.send({
      token,
      user,
      message: "You're logged in!",
    });
  } catch (error) {
    next(error);
  }
});

// User registration
userRouter.post("/register", async (req, res, next) => {
  const {
    username,
    password,
    name,
    email,
    address_id,
  } = req.body;

  try {
    if (!username || !password || !name || !email) {
      return res.status(400).send({
        error: "ValidationError",
        message: "Username, password, name, and email are required.",
      });
    }

    if (typeof password !== "string" || password.length < 8) {
      return next({
        name: "PasswordValidationError",
        message: "Password must be at least 8 characters long.",
      });
    }

    const existingUser = await getWithUsername(username);

    if (existingUser) {
      return next({
        name: "User exists",
        message: `User ${username} already exists.`,
      });
    }

    const newUser = await createUser({
      username,
      password,
      name,
      email,
      address_id,
    });

    if (!newUser) {
      return next({
        name: "RegistrationError",
        message: "Unable to create user.",
      });
    }

    // createUser already creates the user's cart.
    // Retrieve that cart instead of creating a duplicate.
    newUser.cart = await getActiveCartByUserId({
      userId: newUser.id,
    });

    const token = createToken(newUser.id);

    res.status(201).send({
      message: "Thank you for registering!",
      token,
      user: newUser,
    });
  } catch (error) {
    next(error);
  }
});

// Get current logged-in user
userRouter.get("/me", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).send({
        error: "Unauthorized",
        message: "You must be logged in.",
      });
    }

    const userId = req.user.id;

    const cart = await getActiveCartByUserId({
      userId,
    });

    req.user.cart = cart;

    res.send(req.user);
  } catch (error) {
    next(error);
  }
});

// Get user by username
userRouter.get("/:username", async (req, res, next) => {
  try {
    const user = await getWithUsername(req.params.username);

    if (!user) {
      return res.status(404).send({
        error: "NotFound",
        message: "No user found with that username.",
      });
    }

    res.send(user);
  } catch (error) {
    next(error);
  }
});

// Get all users (admin only)
userRouter.get("/", requireAdmin, async (req, res, next) => {
  try {
    const users = await getAllUsers();
    res.send(users);
  } catch (error) {
    next(error);
  }
});

module.exports = userRouter;
