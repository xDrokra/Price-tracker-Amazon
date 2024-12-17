const path = require("path");
const sqlite3 = require("sqlite3").verbose();
require("dotenv").config();

// Create connection to SQLite database
const dbPath = path.resolve(__dirname, process.env.DATABASE_PATH || "../database.sqlite");
const db = new sqlite3.Database(dbPath);

// Create table if not exists
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      url TEXT NOT NULL PRIMARY KEY,
      image TEXT,
      price FLOAT,
      name TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

// Retrieve all products from the database
async function retriveAllProducts() {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM products", [], (err, rows) => {
      if (err) {
        console.error(err.message);
        reject(err);
        return;
      }

      resolve(rows);
    });
  });
}

module.exports = {
  db,
  retriveAllProducts,
};
