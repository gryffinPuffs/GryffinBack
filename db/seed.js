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
      email VARCHAR(255) UNIQUE NOT NULL,
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
      email: "dumdum@dumdum.com",
      address_id: userAddress.id,
    });
    await createUser({
      username: "harry",
      password: "ABCD1234",
      name: "dumm-e",
      admin: true,
      email: "harry@potter.com",
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
      name: "DUNE",
      price: 150,
      image_url:
        "https://res.cloudinary.com/dew089bag/image/upload/v1669314312/Dune%20First%20Edition-signed%20by%20FH.jpg",
      image_url2:
        "https://res.cloudinary.com/dew089bag/image/upload/v1669314369/Dune%20page.jpg",
      author: "Frank Herbert",
      description:
        "Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family tasked with ruling an inhospitable world where the only thing of value is the “spice” melange, a drug capable of extending life and enhancing consciousness. Coveted across the known universe, melange is a prize worth killing for. When House Atreides is betrayed, the destruction of Paul’s family will set the boy on a journey toward a destiny greater than he could ever have imagined. And as he evolves into the mysterious man known as Muad’Dib, he will bring to fruition humankind’s most ancient and unattainable dream.",
      audience: "adult",
    });
    await createProduct({
      name: "Do Androids Dream of Electric Sheep?: Signed First Edition",
      price: 150,
      image_url:
        "https://res.cloudinary.com/dew089bag/image/upload/v1669326496/Androids%20Dream%20Page%20First%20Edition.jpg",
      image_url2:
        "https://res.cloudinary.com/dew089bag/image/upload/v1670074512/DADES:%20Page.jpg",
      author: "Philip K. Dick",
      description:
        "Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family tasked with ruling an inhospitable world where the only thing of value is the “spice” melange, a drug capable of extending life and enhancing consciousness. Coveted across the known universe, melange is a prize worth killing for. When House Atreides is betrayed, the destruction of Paul’s family will set the boy on a journey toward a destiny greater than he could ever have imagined. And as he evolves into the mysterious man known as Muad’Dib, he will bring to fruition humankind’s most ancient and unattainable dream.",
      audience: "adult",
    });
    await createProduct({
      name: "Finnegan's Wake",
      price: 150,
      image_url:
        "https://res.cloudinary.com/dew089bag/image/upload/v1669473339/Finnegans%20Wake%20James%20Joyce.jpg",
      image_url2:
        "https://res.cloudinary.com/dew089bag/image/upload/v1669473940/Finnegans%20Wake%20Page.jpg",
      author: "James Joyce",
      description:
        "Finnegans Wake is the book of Here Comes Everybody and Anna Livia Plurabelle and their family - their book, but in a curious way the book of us all as well as all our books. Joyce's last great work, it is not comprised of many borrowed styles, like Ulysses, but, rather, formulated as one dense, tongue-twisting soundscape. This 'language' is based on English vocabulary and syntax but, at the same time, self-consciously designed to function as a pun machine with an astonishing capacity for resisting singularity of meaning. Announcing a 'revolution of the word', this astonishing book amounts to a powerfully resonant cultural critique - a unique kind of miscommunication which, far from stabilizing the world in meaning, constructs a universe radically unfixed by a wild diversity of possibilities and potentials. It also remains the most hilarious, 'obscene', book of innuendos ever to be imagined.",
      audience: "adult",
    });
    await createProduct({
      name: "Le Petit Prince",
      price: 498,
      image_url:
        "https://res.cloudinary.com/dew089bag/image/upload/v1669332056/Le%20Petite%20Prince%203d.png",
      image_url2:
        "https://res.cloudinary.com/dew089bag/image/upload/v1669334024/Little%20Prince%20Pop%20Up%20PNG.png",
      author: "Antoine de Saint-Exupéry",
      description:
        "A pilot crashes in the Sahara Desert and encounters a strange young boy who calls himself the Little Prince. The Little Prince has traveled there from his home on a lonely, distant asteroid with a single rose. The story that follows is a beautiful and at times heartbreaking meditation on human nature",
      audience: "child",
    });
    await createProduct({
      name: "The Lord of the Rings Trilogy: First Edition Set",
      price: 2455,
      image_url:
        "https://res.cloudinary.com/dew089bag/image/upload/v1669328566/LOTR%20First%20Edition.jpg",
      image_url2:
        "https://res.cloudinary.com/dew089bag/image/upload/v1669329160/LOTR%20Page%203d.jpg",
      author: "J. R. R. TOLKEIN",
      description:
        "The Lord of the Rings is an epic high-fantasy novel by English author and scholar J. R. R. Tolkien. Set in Middle-earth, intended to be Earth at some time in the distant past, the story began as a sequel to Tolkien's 1937 children's book The Hobbit, but eventually developed into a much larger work.",
      audience: "adult",
    });
    await createProduct({
      name: "Harry Potter and the Philosopher's Stone: Signed First Edition",
      price: 2399,
      image_url:
        "https://res.cloudinary.com/dew089bag/image/upload/v1669387490/HP%20Philosopher%27s%20Stone%20First%20Edition.jpg",
      image_url2:
        "https://res.cloudinary.com/dew089bag/image/upload/v1669387673/HP%20Philosopher%20page.jpg",
      author: "J. K. Rowling",
      description:
        "Harry Potter has no idea how famous he is. That's because he's being raised by his miserable aunt and uncle who are terrified Harry will learn that he's really a wizard, just as his parents were. But everything changes when Harry is summoned to attend an infamous school for wizards, and he begins to discover some clues about his illustrious birthright. From the surprising way he is greeted by a lovable giant, to the unique curriculum and colorful faculty at his unusual school, Harry finds himself drawn deep inside a mystical world he never knew existed and closer to his own noble destiny.",
      audience: "teen",
    });
    await createProduct({
      name: "Harry Potter and the Chamber of Secrets",
      price: 399,
      image_url:
        "https://res.cloudinary.com/dew089bag/image/upload/v1670074868/HP%20and%20the%20Chamber%20of%20Secrets.jpg",
      image_url2:
        "https://res.cloudinary.com/dew089bag/image/upload/v1670075003/HP%20Chamber%20of%20Secrets%20Page.jpg",
      author: "J. K. Rowling",
      description:
        "The Dursleys were so mean that hideous that summer that all Harry Potter wanted was to get back to the Hogwarts School for Witchcraft and Wizardry. But just as he's packing his bags, Harry receives a warning from a strange, impish creature named Dobby who says that if Harry Potter returns to Hogwarts, disaster will strike. And strike it does. For in Harry's second year at Hogwarts, fresh torments and horrors arise, including an outrageously stuck-up new professor, Gilderoy Lockheart, a spirit named Moaning Myrtle who haunts the girls' bathroom, and the unwanted attentions of Ron Weasley's younger sister, Ginny.But each of these seem minor annoyances when the real trouble begins, and someone--or something--starts turning Hogwarts students to stone. Could it be Draco Malfoy, a more poisonous rival than ever? Could it possibly be Hagrid, whose mysterious past is finally told? Or could it be the one everyone at Hogwarts most suspects...Harry Potter himself?",
      audience: "teen",
    });
    await createProduct({
      name: "Harry Potter and the Prisoner of Azkaban: Signed First Edition",
      price: 399,
      image_url:
        "https://res.cloudinary.com/dew089bag/image/upload/v1669388275/harry-potter-and-the-prisoner-of-azkaban-j-k-rowling-first-edition-signed_nj0wjf.jpg",
      image_url2:
        "https://res.cloudinary.com/dew089bag/image/upload/v1670073958/HP%20Prisoner%20of%20Azkaban%20Page.jpg",
      author: "J. K. Rowling",
      description:
        "For twelve long years, the dread fortress of Azkaban held an infamous prisoner named Sirius Black. Convicted of killing thirteen people with a single curse, he was said to be the heir apparent to the Dark Lord, Voldemort. Now he has escaped, leaving only two clues as to where he might be headed: Harry Potter's defeat of You-Know-Who was Black's downfall as well. And the Azkban guards heard Black muttering in his sleep, He's at Hogwarts...he's at Hogwarts. Harry Potter isn't safe, not even within the walls of his magical school, surrounded by his friends. Because on top of it all, there may well be a traitor in their midst..",
      audience: "teen",
    });
    await createProduct({
      name: "Harry Potter and the Goblet of Fire: Signed First Edition",
      price: 399,
      image_url:
        "https://res.cloudinary.com/dew089bag/image/upload/v1669388397/HP%20Goblet%20of%20Fire%20Signed.jpg",
      image_url2:
        "https://res.cloudinary.com/dew089bag/image/upload/v1669388708/Harry%20Potter%20Goblet%20of%20Fire%20Page.jpg",
      author: "J. K. Rowling",
      description:
        "Harry Potter is midway through his training as a wizard and his coming of age. Harry wants to get away from the pernicious Dursleys and go to the International Quidditch Cup. He wants to find out about the mysterious event that's supposed to take place at Hogwarts this year, an event involving two other rival schools of magic, and a competition that hasn't happened for a hundred years. He wants to be a normal, fourteen-year-old wizard. But unfortunately for Harry Potter, he's not normal - even by wizarding standards. And in his case, different can be deadly.",
      audience: "teen",
    });
    await createProduct({
      name: "Harry Potter and the Order of the Phoenix",
      price: 399,
      image_url:
        "https://res.cloudinary.com/dew089bag/image/upload/v1669388468/HP%20Order%20of%20the%20Phoenix.jpg",
      image_url2:
        "https://res.cloudinary.com/dew089bag/image/upload/v1669388549/HP%20Order%20of%20the%20Phoenix%20Page.jpg",
      author: "J. K. Rowling",
      description:
        "Harry Potter is due to start his fifth year at Hogwarts School of Witchcraft and Wizardry. He is desperate to get back to school and find out why his friends Ron and Hermione have been so secretive all summer. However, what Harry is about to discover in his new year at Hogwarts will turn his world upside down ...Harry Potter and the Order of the Phoenix continues the riveting tale of a 15-year-old wizard and his extraordinary powers.",
      audience: "teen",
    });
    await createProduct({
      name: "Harry Potter and the Half-Blood Prince",
      price: 399,
      image_url:
        "https://res.cloudinary.com/dew089bag/image/upload/v1670076323/HP%20and%20the%20Half%20Blood%20Prince.jpg",
      image_url2:
        "https://res.cloudinary.com/dew089bag/image/upload/v1670076425/HP%20Half%20Blood%20Page.jpg",
      author: "J. K. Rowling",
      description:
        "The war against Voldemort is not going well; even the Muggles have been affected. Dumbledore is absent from Hogwarts for long stretches of time, and the Order of the Phoenix has already suffered losses. And yet . . . as with all wars, life goes on. Sixth-year students learn to Apparate. Teenagers flirt and fight and fall in love. Harry receives some extraordinary help in Potions from the mysterious Half-Blood Prince. And with Dumbledore's guidance, he seeks out the full, complex story of the boy who became Lord Voldemort -- and thus finds what may be his only vulnerability.",
      audience: "teen",
    });
    await createProduct({
      name: "Harry Potter and the Deathly Hallows: Signed First Edition",
      price: 399,
      image_url:
        "https://res.cloudinary.com/dew089bag/image/upload/v1670076599/HP%20and%20the%20Deathly%20Hallows%20FES.jpg",
      image_url2:
        "https://res.cloudinary.com/dew089bag/image/upload/v1670076748/Dealthy%20Hallows%20Page.jpg",
      author: "J. K. Rowling",
      description:
        "The heart of Book 7 is a hero's mission--not just in Harry's quest for the Horcruxes, but in his journey from boy to man--and Harry faces more danger than that found in all six books combined, from the direct threat of the Death Eaters and you-know-who, to the subtle perils of losing faith in himself. Attentive readers would do well to remember Dumbledore's warning about making the choice between what is right and what is easy, and know that Rowling applies the same difficult principle to the conclusion of her series. While fans will find the answers to hotly speculated questions about Dumbledore, Snape, and you-know-who, it is a testament to Rowling's skill as a storyteller that even the most astute and careful reader will be taken by surprise.",
      audience: "teen",
    });

    console.log("finished creating product");

    console.log("Finished creating carts");
  } catch (error) {
    console.error("error creating product");
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

    // console.log("Calling updateProduct on products[1]");
    // const updateProductResult = await updateProduct(products[1].id, {
    //   name: "We Love You",
    //   description: "cult classic",
    // });
    // console.log("Result:", updateProductResult);

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
    // const deletedItem = await destroyItemInCart(1);

    console.log("deleting product");
    const deletedProduct = await destroyProduct(3);
    console.log("this is deleted product:", deletedProduct);
    console.log("Finished DB Tests");
  } catch (error) {
    console.log("Error during testDB");
    throw error;
  }
}

buildingDB() //line 125
  .then(testDB)
  .catch(console.error)
  .finally(() => client.end());
