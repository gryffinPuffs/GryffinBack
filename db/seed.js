const{client, createUser}=require("./index");

async function dropTables(){
  try{
    console.log("Starting to drop tables..");
    await client.query(`
    DROP TABLE IF EXISTS users;
    `);
    console.log("Finished dropping tables");

  }catch(error){
    console.log("Error dropping tables");
    throw error;
  }
}

async function createTables(){
  try {
    console.log("Starting to build tables...");
    await client.query(`
    CREATE TABLE users(
      id SERIAL PRIMARY KEY,
      username VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      address VARCHAR(255) NOT NULL,
    )
    CREATE TABLE products(
      id SERIAL PRIMARY KEY,
      price INTEGER NOT NULL,
      description TEXT NOT NULL,
      "ageRange" TEXT NOT NULL,
    )
    CREATE TABLE cart(
      id SERIAL PRIMARY KEY,
      "userId" INTEGER REFERENCES users(id),
      "productId" INTEGER REFERENCES products(id),
      active BOOLEAN DEFAULT true,
    )
    CREATE TABLE cart_item(
      id SERIAL PRIMARY KEY,
      "cartId" INTEGER REFERENCES cart(id),
      "productId" INTEGER REFERENCES products(id),
      UNIQUE ("cartId", "productId"),
   );
    `);
    //QUESTION will there be an issue with cart_item and cart using products(id)
    console.log("Finish building tables");

  } catch (error) {
    console.error("Error building tables");
    throw error;
  }
}

async function buildingDB(){
  try {
    client.connect();
    await dropTables()
    await createTables()

  } catch (error) {
    console.log("error during building");
    throw error;

  }
}

async function createInitialUsers(){
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
