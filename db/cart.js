const { client } = require("./client");

async function createCart({user_id, active}){
  try {
const{rows:[cart]}=await client.query(`
INSERT INTO carts(user_id, active)
VALUES($1, $2)
RETURNING *;
`, [user_id, active]);
return cart

  } catch (error) {
    console.error(error)
    }
}

module.exports = {
  client,
  createCart
}
