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
  destroyProduct,
  getProductByName,
  getProductByAudience,
  attachProductsToCart,
} = require("./product");
const {
  createCart,
  getActiveCartByUser,
  getInactiveCartsByUser,
  getAllCarts,
} = require("./cart");
const {
  addItemToCart,
  getCartItemById,
  editCartItem,
  destroyItemInCart,
} = require("./cart_item");

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
      image_url2 TEXT,
      author TEXT NOT NULL,
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
      admin: true,
      address_id: userAddress.id,
    });
    await createUser({
      username: "harry",
      password: "ABCD1234",
      name: "dumm-e",
      admin: true,
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
      image_url2:
        "https://hips.hearstapps.com/vader-prod.s3.amazonaws.com/1646849115-41oigHHgNAL._SL500_.jpg?crop=1xw:1xh;center,top&resize=480:*",
      author:"Ed Haddican",
      description: "Awesome book of awesome",
      audience: "teen",
    });
    await createProduct({
      name: "Not an Awesome book",
      price: 498,
      image_url:
        "https://hips.hearstapps.com/vader-prod.s3.amazonaws.com/1646849115-41oigHHgNAL._SL500_.jpg?crop=1xw:1xh;center,top&resize=480:*",
      image_url2:
        "https://hips.hearstapps.com/vader-prod.s3.amazonaws.com/1646849115-41oigHHgNAL._SL500_.jpg?crop=1xw:1xh;center,top&resize=480:*",
      author:"Jessica Piesco",
      description: "A book that is not awesome",
      audience: "child",
    });
    await createProduct({
      name: "Ok book",
      price: 399,
      image_url:
        "https://hips.hearstapps.com/vader-prod.s3.amazonaws.com/1646849115-41oigHHgNAL._SL500_.jpg?crop=1xw:1xh;center,top&resize=480:*",
      image_url2:
        "https://hips.hearstapps.com/vader-prod.s3.amazonaws.com/1646849115-41oigHHgNAL._SL500_.jpg?crop=1xw:1xh;center,top&resize=480:*",
      author:"Kevin Larson",
      description: "This book is OK",
      audience: "adult",
    });
    await createProduct({
      name: "Definitely an Adult Book",
      price: 399,
      image_url:
        "https://hips.hearstapps.com/vader-prod.s3.amazonaws.com/1646849115-41oigHHgNAL._SL500_.jpg?crop=1xw:1xh;center,top&resize=480:*",
      image_url2:
        "https://hips.hearstapps.com/vader-prod.s3.amazonaws.com/1646849115-41oigHHgNAL._SL500_.jpg?crop=1xw:1xh;center,top&resize=480:*",
      author:"Randy Smith",
      description: "This book is ADULT",
      audience: "adult",
    });
    await createProduct({
      name: "Not for Youngin's",
      price: 399,
      image_url:
        "https://hips.hearstapps.com/vader-prod.s3.amazonaws.com/1646849115-41oigHHgNAL._SL500_.jpg?crop=1xw:1xh;center,top&resize=480:*",
        image_url2:
        "https://hips.hearstapps.com/vader-prod.s3.amazonaws.com/1646849115-41oigHHgNAL._SL500_.jpg?crop=1xw:1xh;center,top&resize=480:*",
      author:"Jenniffer Melchiade",
      description: "This book is rated PG Adult",
      audience: "adult",
    });
    console.log("finished creating product");

    // const cart_items = await Promise.all(
    //   createInitialProduct.map((cart) => createCart(cart))
    // );

    // console.log("Products created: ", cart_items);
    console.log("Finished creating carts");
  } catch (error) {
    console.error("error creating product");
    throw error;
  }
}
//QUESTION - struggling to run a promise/map and get all carts...

async function createInitialCart() {
  try {
    console.log("starting to create carts");
    await createCart({
      user_id: 1,
      active: true,
    });
    await createCart({
      user_id: 1,
      active: false,
    });
    // await createCart({
    //   user_id: 2,
    //   active: true,
    // });
    console.log("finished creating carts");
    console.log("creating cart items");
    const newItem = await addItemToCart({
      cart_id: 1,
      product_id: 1,
      price: 199,
      quantity: 1,
    });
    const newItem2 = await addItemToCart({
      cart_id: 1,
      product_id: 2,
      price: 199,
      quantity: 1,
    });
    console.log(newItem2, "this is new item 2");
    console.log("finished creating cart items");
  } catch (error) {
    console.error("error creating carts");
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
    console.log("Current cart", currentCart);

    const cartItems = await attachProductsToCart(currentCart[0]);
    console.log("Cart with products", cartItems);

    console.log("Testing getting all carts...");
    const allCarts = await getAllCarts();
    console.log("These are all carts", allCarts);

    console.log("getting cart items by Id");
    const cartItemId = await getCartItemById(1);
    console.log("got cart item by Id:", cartItemId);

    console.log("getting product audience");
    const audienceType = await getProductByAudience("adult");
    console.log("this is product audience:", audienceType);

    console.log("deleting cart item");
    const deletedItem = await destroyItemInCart(1);

    console.log("deleting product");
    const deletedProduct = await destroyProduct(3);
    console.log("this is deleted product:", deletedProduct);
    console.log("item deleted:", deletedItem);
  } catch (error) {
    console.log("Error during testDB");
    throw error;
  }
}

buildingDB() //line 125
  .then(testDB)
  .catch(console.error)
  .finally(() => client.end());
