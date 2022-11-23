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

module.exports = {
  client,
  createProduct,
  getAllProducts,
  getProductById,
};
