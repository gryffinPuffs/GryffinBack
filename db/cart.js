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

async function getCartByUser({ username }) {
  try {
    console.log(username);
    const user = await getUserByUsername(username);
    const userId = user.id;
    const { rows: carts } = await client.query(
      `
    SELECT carts.*, users.username AS user_id
    FROM carts
    JOIN users on users.id=carts.user_id
    WHERE user_id = $1 
    `,
      [userId]
    );
    return attachProductsToCart(carts);
  } catch (error) {
    throw error;
  }
}
//QUESTION
//verify with ed if we want to DESTROY cart
// potential for admin function ?

module.exports = {
  client,
  createCart,
  getCartById,
  getCartByUser,
};
