const { Pool } = require("pg");

if (!process.env.PGDATABASE) {
  throw new Error("PGDATABASE HAS NOT BEEN SET!");
}
const db = new Pool();

module.exports = db;
