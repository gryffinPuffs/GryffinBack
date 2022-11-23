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
    console.error(error);
  }
}
// will need this function to get all user purchase history for admin
// async function getAllCarts(){
//   try {
//     const { carts } = await client.query(`
// SELECT carts.*, users.username AS user_id
// FROM carts
// JOIN users ON users.id = carts.user_id
// `);
//     const carts = await attach(rows);
//     return routines;
//   } catch (error) {
//     throw error;
//   }
// }

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

async function getActiveCartByUser({ username }) {
  try {
    console.log(username);
    const user = await getUserByUsername(username);
    const userId = user.id;
    const { rows: carts } = await client.query(
      `
    SELECT carts.*, users.username AS user_username
    FROM carts
    JOIN users on users.id=carts.user_id
    WHERE user_id = $1 AND carts.active = true
    `,
      [userId]
    );
    //return attachProductsToCart(carts);
    console.log(carts, "these are carts");
    return carts;
  } catch (error) {
    throw error;
  }
}
async function getInactiveCartsByUser({ username }) {
  try {
    console.log(username);
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
    //return attachProductsToCart(carts);
    console.log(carts, "these are carts");
    return carts;
  } catch (error) {
    throw error;
  }
}
//need a separate function to get old carts and get active carts using promise.all and map to map over array of all carts and attach products to them (main difference is where)

module.exports = {
  createCart,
  getCartById,
  getActiveCartByUser,
  getInactiveCartsByUser,
};
