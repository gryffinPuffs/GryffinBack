const {Client} = require("pg");

const client = new Client({
  connectionString: process.env.DATABASE_URL || 'postgres://localhost:5432/GryffinBack',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
});

async function createUser({username, password, name, address }){
  try {
    const{
      rows:[user],}
      = await client.query(`
        INSERT INTO users(username, password, name, address)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (username) DO NOTHING
        RETURNING *;
      `,
      [username, password, name, address]);
      return user;
      //QUESTION on Conflict, how is it working do we need it

  } catch (error) {
    throw error;

  }
}

module.exports={
  client,
  createUser,

}
