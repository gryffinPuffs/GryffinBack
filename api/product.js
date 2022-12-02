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
  destroyProduct,
} = require("../db/product");
const { requireAdmin } = require("./utils");

productRouter.use((req, res, next) => {
  console.log("A request is being made to /product");
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
//GET/api/products/:id
productRouter.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const productId = await getProductById(id);
    res.send(productId);
  } catch ({ name, message, error }) {
    next({ name, message, error });
  }
});

// GET /api/products/audience
productRouter.get("/audience/:type", async (req, res, next) => {
  console.log("hello");
  const { type: audience } = req.params;
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
    const {
      name,
      price,
      image_url,
      image_url2,
      author,
      description,
      audience,
    } = req.body;
    const productData = {
      name,
      price,
      image_url,
      image_url2,
      author,
      description,
      audience,
    };
    const possibleProduct = await getProductByName(name);
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

productRouter.delete("/:productId", requireAdmin, async (req, res, next) => {
  try {
    const { productId } = req.params;
    const product = await getProductById(productId);
    const deletedProduct = await destroyProduct(product.id);
    res.send(deletedProduct);
  } catch ({ name, message, error }) {
    next({ name, message, error });
  }
});

productRouter.patch("/:productId", requireAdmin, async (req, res, next) => {
  const { productId } = req.params;
  const { name, price, image_url, image_url2, author, description, audience } =
    req.body;
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
  if (image_url2) {
    updateFields.image_url2 = image_url2;
  }
  if (author) {
    updateFields.author = author;
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
        image_url2,
        author,
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
