const express = require("express");
const userRouter = express.Router();
const jwt = require("jsonwebtoken");
const { getActiveCartByUser } = require("../db/cart");
const { createUser, getUser, getUserByUsername } = require("../db/user");

userRouter.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await getUser({ username, password });

    if (user) {
      const token = jwt.sign(user, process.env.JWT_SECRET, {
        expiresIn: "1w",
      });
      res.send({
        token,
        user,
        message: "you're logged in!",
      });
    } else {
      next({
        name: "IncorrectCredentialsError",
        message: "Username or Password is Incorrect",
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

userRouter.get("/:username", async (req, res, next) => {
    
    const username = req.params.username;
    
    console.log(username, "this is the username")
    try {
        const user = await getUserByUsername(username)
        console.log(user, "this is our user")
        res.send(user)
        
    } catch (error) {
       next ({message: "no user by this username"}) 
    }
})

userRouter.post("/register", async (req, res, next) => {
  const { username, password, name, admin, address_id } = req.body;
  try {
    const user = await getUserByUsername(username);

    if (password.length < 8) {
      next({
        error: "Password too short",
        message: "Password Too Short!",
        name: "password too short",
      });
    }

    if (user) {
      next({
        name: "User exists",
        message: `User ${username} already exists.`,
      });
    } else {
      const newUser = await createUser({
        username,
        password,
        name,
        admin,
        address_id,
      });

      const token = jwt.sign(newUser, process.env.JWT_SECRET, {
        expiresIn: "1w",
      });

      res.send({
        message: "Thank you for registering!",
        token,
        user: newUser,
      });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

userRouter.get("/me", async (req, res, next) => {
  try {
    if (req.user) {
      const cart = await getActiveCartByUser({ username: user.username });
      user.cart = cart;
      res.send(req.user);
    } else {
      next({
        error: "Unauthorized",
        name: "Invalid credentials",
        message: "You must be logged in",
      });
    }
  } catch (err) {
    console.log(err.message);
    next();
  }
});

module.exports = userRouter;
