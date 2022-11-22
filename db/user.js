const { client } = require("./client");
const bcrypt = require("bcrypt")

async function createUser({ username, password, name, address_id }) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
          INSERT INTO users(username, password, name, address_id)
          VALUES ($1, $2, $3, $4)
          ON CONFLICT (username) DO NOTHING
          RETURNING *;
        `,
      [username, password, name, address_id]
    );
    return user;
    //QUESTION on Conflict, how is it working do we need it
  } catch (error) {
    throw error;
  }
}

async function getUserById(user_id) {
  try {
    const {
      rows: [user],
    } = await client.query(`SELECT id, username FROM user WHERE id=${user_id}`);
    if (!user) {
      return null;
    }
    delete user.password;
    return user;
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  client,
  createUser,
  getUserById
};
