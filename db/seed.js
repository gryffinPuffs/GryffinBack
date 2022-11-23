const { createAddress, getAddressById } = require("./address");
const { client } = require("./client");
const {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
} = require("./user");
const bcrypt = require("bcrypt");
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  getProductByName,
  attachProductsToCart,
} = require("./product");
const { createCart, getActiveCartByUser } = require("./cart");
const {
  addItemToCart,
  getCartItemById,
  editCartItem,
  destroyItemInCart,
} = require("./cart_item");

//QUESTION seed server is not starting. Not recognized as a command on my local device. May need other pieces for functionality.

async function dropTables() {
  try {
    console.log("Starting to drop tables..");
    await client.query(`
    DROP TABLE IF EXISTS cart_item;
    DROP TABLE IF EXISTS products;
    DROP TABLE IF EXISTS carts;
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
      name TEXT NOT NULL,
      price INTEGER NOT NULL,
      image_url TEXT NOT NULL,
      description TEXT NOT NULL,
      audience audience_type
    );
    CREATE TABLE carts(
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      active BOOLEAN DEFAULT true
    );
    CREATE TABLE cart_item(
      id SERIAL PRIMARY KEY,
      cart_id INTEGER REFERENCES carts(id),
      product_id INTEGER REFERENCES products(id),
      price INTEGER,
      quantity INTEGER,
      UNIQUE (cart_id, product_id)
   );

    `);
    console.log("Finish building tables");
  } catch (error) {
    console.error("Error building tables");
    throw error;
  }
}

async function createInitialUsers() {
  try {
    console.log("Starting to create users");
    const userAddress = await getAddressById(1);
    console.log("this is userAddress", userAddress);
    await createUser({
      username: "dum-dum",
      password: "ABCD1234",
      name: "dumm-e",
      address_id: userAddress.id,
    });
    console.log("Finished creating users");
  } catch (error) {
    console.error("error creating users");
    throw error;
  }
}

async function createInitialAddress() {
  try {
    console.log("starting to create address");
    await createAddress({
      address_line1: "123 maple street",
      address_line2: "apt 3",
      city: "fort collins",
      state: "colorado",
      zip_code: "80525",
    });
    console.log("finished creating address");
  } catch (error) {
    console.error("error creating address");
    throw error;
  }
}

async function createInitialProduct() {
  try {
    console.log("starting to create products");
    await createProduct({
      name: "AWESOME BOOK",
      price: 415,
      image_url:
        "https://hips.hearstapps.com/vader-prod.s3.amazonaws.com/1646849115-41oigHHgNAL._SL500_.jpg?crop=1xw:1xh;center,top&resize=480:*",
      description: "Awesome book of awesome",
      audience: "teen",
    });
    await createProduct({
      name: "Not an Awesome book",
      price: 498,
      image_url:
        "https://hips.hearstapps.com/vader-prod.s3.amazonaws.com/1646849115-41oigHHgNAL._SL500_.jpg?crop=1xw:1xh;center,top&resize=480:*",
      description: "A book that is not awesome",
      audience: "child",
    });
    await createProduct({
      name: "Ok book",
      price: 399,
      image_url:
        "https://hips.hearstapps.com/vader-prod.s3.amazonaws.com/1646849115-41oigHHgNAL._SL500_.jpg?crop=1xw:1xh;center,top&resize=480:*",
      description: "This book is OK",
      audience: "adult",
    });
    console.log("finished creating product");
  } catch (error) {
    console.error("error creating product");
    throw error;
  }
}
async function createInitialCart() {
  try {
    console.log("starting to create carts");
    await createCart({
      user_id: 1,
      active: true,
    });
    console.log("finished creating cart");
  } catch (error) {
    console.error("error creating cart");
    throw error;
  }
}

async function buildingDB() {
  try {
    client.connect();
    await dropTables();
    await createTables();
    await createInitialAddress();
    await createInitialUsers();
    await createInitialProduct();
    await createInitialCart();
  } catch (error) {
    console.log("error during building");
    throw error;
  }
}

async function testDB() {
  try {
    console.log("Starting to test database...");

    console.log("Calling getAllProducts");
    const products = await getAllProducts();
    console.log("Result:", products);

    console.log("Calling getProductById[1]");
    const product = await getProductById(1);
    console.log("Result:", product);

    console.log("Calling updateProduct on products[1]");
    const updateProductResult = await updateProduct(products[1].id, {
      name: "UpdatedName weLoveIt",
      description: "cult classic",
    });
    console.log("Result:", updateProductResult);

    console.log("Calling getProductByName");
    const productName = await getProductByName("AWESOME BOOK");
    console.log("Result:", productName);

    console.log("get user with Password hashing");
    const user = await getUser({ username: "dum-dum", password: "ABCD1234" });
    console.log(user, "user with hashed password");

    console.log("getting user by Id");
    const userId = await getUserById(1);
    console.log(userId, "this is user Id");

    console.log("getting user by username");
    const username = await getUserByUsername("dum-dum");
    console.log("result:", username);

    console.log("item added to cart");
    const item = await addItemToCart({
      cart_id: 1,
      product_id: 1,
      price: 415,
      quantity: 2,
    });
    console.log("result:", item);

    console.log("Querying for cart");
    const currentCart = await getActiveCartByUser({ username: "dum-dum" });
    console.log(currentCart, "these are currentCart");
    const cartItems = await attachProductsToCart(currentCart[0]);

    console.log("Cart with products", cartItems);
  } catch (error) {
    console.log("Error during testDB");
    throw error;
  }
}

buildingDB() //line 125
  .then(testDB)
  .catch(console.error)
  .finally(() => client.end());
