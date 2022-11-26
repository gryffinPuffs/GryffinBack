const express = require("express");
const addressRouter = express.Router();
const jwt = require('jsonwebtoken')
const {
  createAddress,
  getAddressById,
  updateAddress
} = require ("../db")

addressRouter.use((req, res, next) => {
  console.log("A request is being made to /address");
  next();
});

addressRouter.post("/:username/address", async (req, res, next) => {
  const { username, password, address_id } = req.body;
  try {
    const userAddress = await getAddressById(username, password, address_id);

    if(userAddress) {
      next({
        name: "Address exists",
        message: "Address is already on file",
      });
    } else {
      const newAddress = await createAddress({
        address_line1,
        address_line2,
        city,
        state,
        zip_code,
        });

        const token = jwt.sign(newAddress, process.env.JWT_SECRET, {
          expiresIn: "1w",
        });
        res.send({
          message: "Address has been added!",
          token,
          userAddress: newAddress
        })
    }
  } catch ({ name, message }) {
    next({ name, message });    
  }
});

addressRouter.patch("/address", async (req, res, next) => {
  try{
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

module.exports = addressRouter;
