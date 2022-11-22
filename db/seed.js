const { client, createUser } = require("./index");
//QUESTION seed server is not starting. Not recognized as a command on my local device. May need other pieces for functionality.

async function dropTables() {
  try {
    console.log("Starting to drop tables..");
    await client.query(`
    DROP TABLE IF EXISTS cart_item;
    DROP TABLE IF EXISTS products;
    DROP TABLE IF EXISTS cart;
    DROP TABLE IF EXISTS users;
    DROP TABLE IF EXISTS address;
    DROP TYPE IF EXISTS audience_type;
    `);
    console.log("Finished dropping tables");
  } catch (error) {
    console.log("Error dropping tables");
    throw error;
  }
}

async function createTables() {
  try {
    console.log("Starting to build tables...");
    await client.query(` 
    CREATE TABLE address(
    id SERIAL PRIMARY KEY,
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    zip_code INTEGER NOT NULL
   );
    CREATE TABLE users(
      id SERIAL PRIMARY KEY,
      username VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      admin BOOLEAN DEFAULT false, 
      address_id INTEGER REFERENCES address(id)
    );
  CREATE TYPE audience_type AS ENUM ('adult','teen','child');
    CREATE TABLE products(
      id SERIAL PRIMARY KEY,
      price INTEGER NOT NULL,
      description TEXT NOT NULL,
      audience audience_type 
    );
    CREATE TABLE cart(
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      active BOOLEAN DEFAULT true
    );
    CREATE TABLE cart_item(
      id SERIAL PRIMARY KEY,
      cart_id INTEGER REFERENCES cart(id),
      product_id INTEGER REFERENCES products(id),
      quantity INTEGER,
      UNIQUE (cart_id, product_id)
   );

    `);
    //QUESTION will there be an issue with cart_item and cart using products(id)
    console.log("Finish building tables");
  } catch (error) {
    console.error("Error building tables");
    throw error;
  }
}

async function buildingDB() {
  try {
    client.connect();
    await dropTables();
    await createTables();
  } catch (error) {
    console.log("error during building");
    throw error;
  }
}

async function createInitialUsers() {
  try {
    console.log("Starting to create users");
    await createUser({
      username: "dum-dum",
      password: "ABCD1234",
      name: "dumm-e",
      address: "123 hilltop",
    });
    console.log("Finished creating users");
    //QUESTION address with multiple lines??
  } catch (error) {
    console.error("error creating users");
    throw error;
  }
}

buildingDB()
  .catch(console.error)
  .finally(() => client.end());
