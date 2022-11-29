const { getActiveCartByUser } = require("./cart");
const { client } = require("./client");

async function addItemToCart({ cart_id, product_id, price, quantity }) {
  try {
    const {
      rows: [cart_item],
    } = await client.query(
      `
            INSERT INTO cart_item
     (cart_id, product_id, price, quantity)
            VALUES($1, $2, $3, $4)
            ON CONFLICT (cart_id, product_id) DO NOTHING
            RETURNING *;
            `,
      [cart_id, product_id, price, quantity]
    );
    return cart_item;
  } catch (error) {
    throw error;
  }
}

async function getCartItemById(id) {
  console.log(id, "this is cart item id");
  try {
    const {
      rows: [cart_item],
    } = await client.query(`SELECT * FROM cart_item WHERE product_id=$1;`, [
      id,
    ]);
    return cart_item;
  } catch (error) {}
}

async function editCartItem(id, fields = {}) {
  console.log(id, "This is Id");
  console.log(fields, "this is fields update");
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");
  console.log(setString, "this is string to edit");
  if (setString.length === 0) {
    return;
  }
  try {
    const {
      rows: [cart],
    } = await client.query(
      `
            UPDATE cart_item
            SET ${setString}
            WHERE id=${id}
            RETURNING *;
            `,
      Object.values(fields)
    );
    return cart;
  } catch (error) {
    throw error;
  }
}

async function destroyItemInCart(id) {
  try {
    const {
      rows: [cart_item],
    } = await client.query(
      `DELETE
            FROM cart_item
            WHERE id=$1
            RETURNING *;
            `,
      [id]
    );
    return cart_item;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  addItemToCart,
  getCartItemById,
  editCartItem,
  destroyItemInCart,
};
