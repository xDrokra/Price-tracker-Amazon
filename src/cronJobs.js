const cron = require("node-cron");
const scraper = require("./scraper"); 
const { db, retriveAllProducts } = require("./db");
const { sendEmail } = require("./notification"); 
require("dotenv").config();

// Function to start the cron job

function startCronJobs() {
  cronTask = cron.schedule(process.env.CRON_SCHEDULE || '*/30 * * * * *', async () => {
    try {
      // check if there are products in the database
      const products = await retriveAllProducts();

      if (products.length === 0) {
        console.log("No products found in the database. stopping the cron job");
        cronTask.stop(); // stop the cron job if there are no products
        return;
      }

      for (const product of products) {
        const { price, url, name } = product;
        const { newPrice } = await scraper.scrapeAmazonProduct(url);

        // Update the price in the database if it has changed
        await new Promise((resolve, reject) => {

          if (price !== newPrice) {
            db.run(
              "UPDATE products SET price = ? WHERE url = ?",
              [price, url],
              (err) => {
                if (err) {
                  console.error(
                    `Error: updating the item ${name.slice(0, 40)}:`,
                    err.message
                  );
                  return reject(err);
                }
                console.log(`Price updated for ${name.slice(0, 40)}: ${price}`);
                resolve();
                // sendEmail(name, price, url); // send an email if the price has changed, uncomment this line to enable the email notification feature but you need to configure the email settings on the file notification.js
              }
            );
          } else {
            console.log(`The price of ${name.slice(0, 40)} it's the same`);
            resolve();
          }
        });
      }
    } catch (error) {
      console.error("Error of the cron job:", error.message);
    }
  });
}

module.exports = { startCronJobs };
