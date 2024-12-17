const puppeteer = require("puppeteer");

// Scaper function that takes an Amazon product URL and returns the product name, image and price
async function scrapeAmazonProduct(url) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
  );

  try {
    await page.goto(url, { waitUntil: "networkidle2" });
    // Selectors for the product name, image, price and lowest price
    const priceSelector = ".a-offscreen";
    const nameSelector = "#productTitle";
    const imageSelector = "#landingImage";

    const imageSrc = await page.$eval(imageSelector, (el) => el.src);
    let price = await page.$eval(priceSelector, (el) => el.textContent.trim());
    newPrice = parseFloat(price.replace("€", "").replace(",", "."));
    const name = await page.$eval(nameSelector, (el) => el.textContent.trim());
    return { newPrice, name, imageSrc };
  } catch (error) {
    console.error("Error during the scraping:", error.message);
    return null;
  } finally {
    await browser.close();
  }
}

module.exports = { scrapeAmazonProduct };
