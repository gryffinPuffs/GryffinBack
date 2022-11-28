const express = require("express");
const addressRouter = express.Router();
const jwt = require("jsonwebtoken");
const {
  createAddress,
  getAddressById,
  updateAddress,
  getAllAddresses,
} = require("../db/address");
const { requireAdmin } = require("./utils");

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

addressRouter.patch("/address", async (req, res, next) => {
  try {
    const addressId = req.params.addressId;
    const address = await getAddressById(addressId);

    if (address) {
      {
        const updatedAddress = await updateAddress({
          address_line1,
          address_line2,
          city,
          state,
          zip_code,
        });
        res.send(updateAddress);
      }
    }
  } catch (error) {
    console.log(error);
  }
});

addressRouter.get("/", requireAdmin, async (req, res, next) => {
  try {
    const allAddresses = await getAllAddresses();
    res.send(allAddresses);
  } catch ({ name, message, error }) {
    next({ name, message, error });
  }
});
module.exports = addressRouter;
