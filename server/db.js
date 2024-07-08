const uuid = require("uuid");
const bcrypt = require("bcrypt");
const pg = require("pg");
const client = new pg.Client(
  process.env.DATABASE_URL || "postgres://localhost/acme_store"
);

const createTables = async () => {
  const SQL = `
  DROP TABLE IF EXISTS favorite;
  DROP TABLE IF EXISTS product;
  DROP TABLE IF EXISTS users;
  
  CREATE TABLE users(
    id UUID PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
    );
    CREATE TABLE product(
    id UUID PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
    );
    CREATE TABLE favorite(
      id UUID PRIMARY KEY,
      users_id UUID REFERENCES users(id) NOT NULL,
      product_id UUID REFERENCES product(id) NOT NULL
    );
  `;
  await client.query(SQL);
  return true;
};

const createProduct = async (name) => {
  const SQL = `
    INSERT INTO product(id, name) VALUES($1, $2) RETURNING *
    `;
  const response = await client.query(SQL, [uuid.v4(), name]);
  return response.rows[0];
};

const createUser = async ({ username, password }) => {
  const SQL = `
    INSERT INTO users(id, username, password) VALUES($1, $2, $3) RETURNING *
    `;
  console.log(username);
  const hashedPassword = await bcrypt.hash(password, 10);
  const response = await client.query(SQL, [
    uuid.v4(),
    username,
    hashedPassword,
  ]);
  return response.rows[0];
};

const fetchUsers = async () => {
  const SQL = `
    SELECT * FROM users
    `;
  const response = await client.query(SQL);
  return response.rows;
};

const fetchProducts = async () => {
  const SQL = `
    SELECT * FROM product
    `;
  const response = await client.query(SQL);
  return response.rows;
};

const createFavorite = async ({ users_id, product_id }) => {
  const SQL = `
    INSERT INTO favorite(id, users_id, product_id) VALUES($1, $2, $3) RETURNING *
    `;
  const response = await client.query(SQL, [uuid.v4(), users_id, product_id]);
  return response.rows[0];
};

const fetchFavorites = async (id) => {
  const SQL = `
    SELECT * FROM favorite
    WHERE users_id=$1
    `;
  const response = await client.query(SQL);
  return response.rows;
};

const destroyFavorite = async ({ id, users_id }) => {
  const SQL = `
    DELETE FROM favorite
    WHERE id = $1 AND users_id = $2
    `;
  await client.query(SQL, [id, users_id, product_id]);
};

module.exports = {
  client,
  createTables,
  createProduct,
  createUser,
  fetchUsers,
  fetchProducts,
  createFavorite,
  fetchFavorites,
  destroyFavorite,
};
