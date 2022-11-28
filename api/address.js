const express = require("express");
const addressRouter = express.Router();
const jwt = require("jsonwebtoken");
const {
  createAddress,
  getAddressById,
  updateAddress,
  getAllAddresses,
} = require("../db/address");
const { requireAdmin, requireUser } = require("./utils");

addressRouter.use((req, res, next) => {
  console.log("A request is being made to /address");
  next();
});

addressRouter.post("/", async (req, res, next) => {
  const { address_line1, address_line2, city, state, zip_code } = req.body;
  try {
    //   const userAddress = await getAddressById(address.id);

    //   if (userAddress) {
    //     next({
    //       name: "Address exists",
    //       message: "Address is already on file",
    //     });
    //   } else {
    const newAddress = await createAddress({
      address_line1,
      address_line2,
      city,
      state,
      zip_code,
    });

    res.send({
      message: "Address has been added!",
      userAddress: newAddress,
    });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

addressRouter.patch("/:address_id", requireUser, async (req, res, next) => {
  console.log("banana")
  
  try {
    const { address_line1, address_line2, city, state, zip_code } = req.body;
    const id = req.params.address_id;

    const address = await getAddressById(id);
console.log(address, "this is the address")
    if (address) {
      {
        const updatedAddress = await updateAddress({
          id,
          address_line1,
          address_line2,
          city,
          state,
          zip_code,
        });
        res.send(updatedAddress);
      }
    }
  } catch (error) {
    console.log(error);
  }
});

addressRouter.get("/", requireAdmin, async (req, res, next) => {
  try {
    console.log("hello world");
    const allAddresses = await getAllAddresses();
    console.log(allAddresses, "getting all addresses");
    res.send(allAddresses);
  } catch ({ name, message, error }) {
    next({ name, message, error });
  }
});
module.exports = addressRouter;
