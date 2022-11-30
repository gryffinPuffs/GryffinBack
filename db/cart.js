const { client } = require("./client");
const { attachProductsToCart } = require("./product");
const { getUserByUsername } = require("./user");

async function createCart({ user_id, active }) {
  try {
    const {
      rows: [cart],
    } = await client.query(
      `
      INSERT INTO carts(user_id, active)
      VALUES($1, $2)
      RETURNING *;
      `,
      [user_id, active]
    );
    return cart;
  } catch (error) {
    throw error;
  }
}
// will need this function to get all user purchase history for admin
async function getAllCarts() {
  try {
    const { rows } = await client.query(`
    SELECT carts.*,
    users.username AS user_id
    FROM carts
    JOIN users ON users.id = carts.user_id
    `);
    const carts = rows;
    return carts;
  } catch (error) {
    throw error;
  }
}
async function getCartById(id) {
  try {
    const {
      rows: [cart],
    } = await client.query(`
    SELECT *
    FROM carts
    WHERE id=${id}
    `);
    return cart;
  } catch (error) {
    throw error;
  }
}
async function getActiveCartByUser({username}) {
  try {
    const user = await getUserByUsername(username);
    const userId = user.id;
    const {
      rows: [cart],
    } = await client.query(
      `
    SELECT carts.*, users.username AS user_username
    FROM carts
    JOIN users on users.id=carts.user_id
    WHERE user_id = $1 AND carts.active = true
    `,
      [userId]
    );

    const cartsProducts = await attachProductsToCart(cart)
    return cartsProducts;
  } catch (error) {
    throw error;
  }
}
async function getActiveCartByUserId({userId}) {
  try {
    const {
      rows: [cart],
    } = await client.query(
      `
    SELECT carts.*, users.username AS user_username
    FROM carts
    JOIN users on users.id=carts.user_id
    WHERE user_id = $1 AND carts.active = true
    `,
      [userId]
    );
    const cartsProducts = await attachProductsToCart(cart)
    console.log(cartsProducts, "potato")
    return cartsProducts;
  } catch (error) {
    throw error;
  }
}
async function getInactiveCartsByUser({ username }) {
  try {
    const user = await getUserByUsername(username);
    const userId = user.id;
    const { rows: carts } = await client.query(
      `
    SELECT carts.*, users.username AS user_username
    FROM carts
    JOIN users on users.id=carts.user_id
    WHERE user_id = $1 AND carts.active = false
    `,
      [userId]
    );
    return carts;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createCart,
  getCartById,
  getActiveCartByUser,
  getActiveCartByUserId,
  getInactiveCartsByUser,
  getAllCarts,
};
