const express = require("express");
const productRouter = express.Router();
const { getAllProducts } = require("../db/product");

// GET /api/products
productRouter.get("/", async (req, res, next) => {
  try {
    const allProducts = await getAllProducts();
    res.send(allProducts);
  } catch ({ name, message, error }) {
    next({ name, message, error });
  }
});

//QUESTION  - DO WE NEED A POST FOR PRODUCT? IS THIS FOR ADMIN ONLY?
//POST /api/products

// productRouter.post("/", requireUser, async (req, res, next) => {
//     try {
//         const { name, description } = req.body;
//         const activity = await getActivityByName(name)
//         if (activity) {
//             next({
//                 name: "ActivityExistsError",
//                 message: `An activity with name ${name} already exists`,
//                 error: "ActivityExistsError",
//             });
//         }
//         else {
//             const activityData = {
//                 description,
//                 name
//             };
//             const newActivity = await createActivity(activityData)
//             res.send(newActivity)
//         }
//     } catch ({ name, message, error }) {
//         next({ name, message, error });
//       }
// })

module.exports = productRouter;
