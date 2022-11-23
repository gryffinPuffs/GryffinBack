const client = require("./client")

async function addItemToCart({
    productId,
    cartId,
    quantity
}) {
    try {
        const{
            rows: [product],
        } = await client.query(
            `
            INSERT INTO cart_items ("productId", "cartId", "quantity")
            VALUES($1, $2, $3)
            ON CONFLICT ("productId", "cartId") DO NOTHING
            RETURNING *;
            `,
            [productId, cartId, quantity]
        );
        return product;
        
    } catch (error) {
        throw error;
    }

}

async function getCartItemById(id) {
    try {
        const {
            rows: [cart_items],
        } = await client.query(`SELECT * FROM cart_items WHERE id=$1;`,
        [id,]);
        return cart_items;
    } catch (error) {
        
    }

}

async function editCartItem({ id, ...fields }) {
    const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");
    if (setString.length === 0) {
        return;
    }
    try {
        const {
            rows: [cart],
        } = await client.query(
            `
            UPDATE cart_items
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
            rows: [cart_items],
        } = await client.query(
            `DELETE
            FROM cart_item
            WHERE id=$1
            RETURNING *;
            `,
            [id]
        );
        return cart_items;
    } catch (error) {
        throw error;
    }

}

module.exports = {
addItemToCart,
getCartItemById,
editCartItem,
destroyItemInCart
}