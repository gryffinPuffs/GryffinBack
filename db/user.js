const { client } = require("./client");
const bcrypt = require("bcrypt");

async function createUser({ username, password, name, admin, address_id }) {
  console.log("hello");
  const saltRound = 10;
  const salt = await bcrypt.genSalt(saltRound);
  const bcryptPassword = await bcrypt.hash(password, salt);

  try {
    const {
      rows: [user],
    } = await client.query(
      `
          INSERT INTO users(username, password, name, admin, address_id)
          VALUES ($1, $2, $3, $4, $5)
          ON CONFLICT (username) DO NOTHING 
          RETURNING *;
        `,
      [username, bcryptPassword, name, admin, address_id]
    );
    delete user.password;
    return user;
  } catch (error) {
    throw error;
  }
}

async function getUser({ username, password }) {
  try {
    const user = await getUserByUsername(username);
    const hashedPassword = user.password;
    const validPassword = await bcrypt.compare(password, hashedPassword);
    if (validPassword) {
      delete user.password;
      return user;
    }
  } catch (error) {
    throw error;
  }
}
//QUESTION - do we need get all users? Maybe for admin.
// async function getAllUsers() {
//   const { rows } = await client.query(
//     `SELECT id, username
//           FROM users;
//         `
//   );

//   return rows;
// }

async function getUserById(user_id) {
  try {
    const {
      rows: [user],
    } = await client.query(`
    SELECT*
    FROM users 
    WHERE id=${user_id}
    `);
    if (!user) {
      return null;
    }
    delete user.password;
    return user;
  } catch (error) {
    console.log(error);
  }
}

async function getUserByUsername(username) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
    SELECT *
    FROM users
    WHERE username = $1;
    `,
      [username]
    );
    console.log(user, "from getUserByUsername");
    return user;
  } catch (error) {
    throw error;
  }
}
// update users function to add admin and potentially update users name and addresses

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
};
