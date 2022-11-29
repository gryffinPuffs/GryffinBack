const e = require("express");
const express = require("express");
const productRouter = express.Router();
const {
  getAllProducts,
  getProductByName,
  createProduct,
  getProductById,
  updateProduct,
  getProductByAudience,
} = require("../db/product");
const { requireAdmin } = require("./utils");

productRouter.use((req, res, next) => {
  console.log("A request is being made to /products");
  next();
});

// GET /api/products
productRouter.get("/", async (req, res, next) => {
  try {
    const allProducts = await getAllProducts();
    res.send(allProducts);
  } catch ({ name, message, error }) {
    next({ name, message, error });
  }
});

// GET /api/products/:audience
productRouter.get("/:audience", async (req, res, next) => {
  const { audience } = req.params;
  try {
    const audienceType = await getProductByAudience(audience);
    res.send(audienceType);
  } catch ({ name, message, error }) {
    next({ name, message, error });
  }
});

//POST /api/products
productRouter.post("/", requireAdmin, async (req, res, next) => {
  try {
    const { name, price, image_url, description, audience } = req.body;
    const productData = {
      name,
      price,
      image_url,
      description,
      audience,
    };
    const possibleProduct = await getProductByName(name);
    console.log(possibleProduct, "new book");
    if (!possibleProduct) {
      const newProduct = await createProduct(productData);
      if (newProduct) {
        res.send(newProduct);
      }
    } else {
      next({
        name: "ProductExists",
        message: `A product with the name ${name} already exists`,
        error: "productExists",
      });
    }
  } catch ({ name, message, error }) {
    next({ name, message, error });
  }
});

productRouter.patch("/:productId", requireAdmin, async (req, res, next) => {
  const { productId } = req.params;
  const { name, price, image_url, description, audience } = req.body;
  const updateFields = {};
  if (name) {
    const possibleName = await getProductByName(name);
    if (possibleName === undefined) {
      updateFields.name = name;
    } else {
      next({
        name: "ProductAlreadyExist",
        message: `An product with name ${name} already exists`,
        Error: "product duplicate",
      });
    }
  }
  if (price) {
    updateFields.price = price;
  }
  if (image_url) {
    updateFields.image_url = image_url;
  }
  if (description) {
    updateFields.description = description;
  }
  if (audience) {
    updateFields.audience = audience;
  }
  try {
    const originalProduct = await getProductById(productId);

    if (originalProduct) {
      const updatedProduct = await updateProduct(productId, {
        name,
        price,
        image_url,
        description,
        audience,
      });
      console.log("hellooo", updatedProduct);
      res.send(updatedProduct);
    } else {
      next({
        name: "productDoesNotExist",
        message: `Product ${productId} not found`,
        Error: "Product does not exist",
      });
    }
  } catch ({ name, message, error }) {
    next({ name, message, error });
  }
});

module.exports = productRouter;
