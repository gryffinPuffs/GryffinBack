const express = require("express");
const userRouter = express.Router();
const jwt = require('jsonwebtoken');
const {
    createUser,
    getUser,
    getUserByUsername,

} = require("../db/user");
const { getActiveCartByUser} = require("../db/cart");

userRouter.post("/login", async (req, res, next) => {
    const { username, password } = req.body;
    try {
        const user = await getUser({ username, password });
console.log(req.body, process.env.JWT_SECRET, "HEREJEJEJEJ")
        if (user) {
            const token = jwt.sign(user, process.env.JWT_SECRET, {
                expiresIn: "1w",
            });
        } else {
            next ({
                name: "IncorrectCredentialsError",
                message: "Username or Password is Incorrect",
            });
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
});

userRouter.post("/register", async (req, res, next) => {
    const { username, password } = req.body;
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
            res.send(req.user);
        } else {
            next({
                error: "Unauthorized",
                name: "Invalid credentials",
                message: "You must be logged in",
            });
        }
    } catch(err) {
        console.log(err.message);
        next();
    }
});

// userRouter.get("/:username/cart", async (req, res, next) => {
//     const username = req.params.username;

//     try {
//         const cart = await getActiveCartByUser({ username });
//         res.send(cart);
//     } catch (err) {
//         console.error(err.message);
//         next();
//     }
// })

module.exports = userRouter;
