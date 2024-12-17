const express = require("express");
const path = require("path");
const { startCronJobs } = require("./cronJobs");
const { db, retriveAllProducts } = require("./db");
const { scrapeAmazonProduct } = require("./scraper");
require("dotenv").config();

const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

// Serve static files and parse request body as JSON
app.use(express.static(path.join(__dirname, "../views/css")));
app.use(express.static(path.join(__dirname, "../views/script")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", async (req, res) => {
  try {
    const rows = await retriveAllProducts();
    res.render("index", { products: rows });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

// Scrape the Amazon product and save it in the database
app.post("/scrape", async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).send({ error: "URL missing" });

  try {
    const { newPrice, name, imageSrc } = await scrapeAmazonProduct(url);

    await new Promise((resolve, reject) => {
      db.run(
        "INSERT INTO products (url, price, name, image) VALUES (?, ?, ?, ?)",
        [url, newPrice, name, imageSrc],
        (err) => {
          if (err) {
            console.error("Error during the saving:", err.message);
            return reject(err);
          }
          resolve();
        }
      );
    });

    console.log("Product saved in database successfully:", {
      name,
      newPrice,
      url,
    });

    const rows = await retriveAllProducts();
    res.redirect("/");
    if (rows.length === 1) {
      startCronJobs();
    }
  } catch (error) {
    console.error("Error during the scraping:", error.message);
    res.status(500).send({ error: error.message });
  }
});

// Remove the product from the database
app.post("/remove", async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).send({ error: "URL mancante" });

  await new Promise((resolve, reject) => {
    db.run("DELETE FROM products WHERE url = ?", [url], (err) => {
      if (err) {
        console.error("Error deleting from database:", err.message);
        return reject(err);
      }
      resolve();
    });
  });
  console.log(`URL removed: ${url}`);
  res.redirect("/");
});

startCronJobs();

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
