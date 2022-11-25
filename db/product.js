const { client } = require("./client");

async function createProduct({
  name,
  price,
  image_url,
  description,
  audience,
}) {
  try {
    const {
      rows: [product],
    } = await client.query(
      `
          INSERT INTO products(name, price, image_url, description, audience)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING *;
        `,
      [name, price, image_url, description, audience]
    );
    return product;
  } catch (error) {
    throw error;
  }
}

async function getAllProducts() {
  try {
    const { rows: productIds } = await client.query(`
    SELECT id
    FROM products
    `);
    const products = await Promise.all(
      productIds.map((product) => getProductById(product.id))
    );
    return products;
  } catch (error) {
    console.error(error);
  }
}

async function getProductById(id) {
  try {
    const {
      rows: [product],
    } = await client.query(
      `
    SELECT *
    FROM products
    WHERE id=$1
    `,
      [id]
    );
    if (!product) {
      throw {
        name: "ProductNotFoundError",
        message: "Could not find a product with that id",
      };
    }
    return product;
  } catch (error) {
    console.error(error);
  }
}

async function updateProduct(id, fields = {}) {
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  if (setString.length === 0) {
    return;
  }

  try {
    const {
      rows: [product],
    } = await client.query(
      `
    UPDATE products
    SET ${setString}
    WHERE id=${id}
    RETURNING *;
    `,
      Object.values(fields)
    );

    return product;
  } catch (error) {
    throw error;
  }
}

async function getProductByName(name) {
  try {
    const { rows: products } = await client.query(
      `
    SELECT * FROM products
    WHERE name = $1;
    `,
      [name]
    );
    return products;
  } catch (error) {
    throw error;
  }
}
async function attachProductsToCart(carts) {
  console.log(carts, "merry christmas");
  const cartToReturn = { ...carts };
  //const binds = carts.map((_, index) => `$${index + 1}`).join(", ");
  //const cartIds = carts.map((cart) => cart.id);
  //console.log(binds, cartIds,"")
  //if (!cartIds?.length) return [];
  try {
    const { rows: products } = await client.query(
      `
    SELECT products.*, cart_item.quantity, cart_item.price, cart_item.id AS "cartProductId", cart_item.cart_id
    FROM products
    JOIN cart_item ON cart_item.product_id= products.id
    WHERE cart_item.cart_id IN ($1);
    `,
      [cartToReturn.id]
    );
    console.log("these are products", products);
    // for (const cart of cartToReturn) {
    //   const productsToAdd = products.filter(
    //     (product) => product.cartId === cart.id
    //   );
    //   cart.products = productsToAdd;
    // }
    // console.log("cart to return");
    cartToReturn.products = products;
    return cartToReturn;
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  client,
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  getProductByName,
  attachProductsToCart,
};
