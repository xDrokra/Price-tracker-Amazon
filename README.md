# Price-tracker-Amazon
A local application to track product prices on Amazon (and similar websites if set right). It uses Node.js, Puppeteer, and SQLite to scrape prices and maintain a local database.

## Features
- Scrape product prices dynamically using Puppeteer.
- Store product information locally with SQLite.
- Automatic price monitoring with scheduled cron jobs (you can set on the env file the time frame).
- Real-time price updates displayed in a clean interface.
- Email notifications for price changes (set it on the env file).
- Fully functional locally on your own machine.

## **Installation**
1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/price-tracker.git
   cd price-tracker
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Set up the environment**: Create a `.env` file in the project root directory and add your email credentials, port number, :
   ```env
   PORT=3000 #Server port
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-email@example.com
   EMAIL_PASS=your-email-password 
   CRON_SCHEDULE=*/15 * * * * * #
   DATABASE_PATH=../database.sqlite #Path to SQLite database
   ```
4. **Run the application**:
   ```bash
   node src/server.js
   ```
5. **Access the app locally**:
   Open your browser and navigate to `http://localhost:3000` or the port that you configured.

## Usage

- Add a Product for Price Tracking (insert the amazon url): 
<br><img src="https://github.com/user-attachments/assets/7fcd6194-06dd-4f47-8676-792dd501cd0a" width="300">
- The app will scrape and update product prices automatically using a cron job:
<br><img src="https://github.com/user-attachments/assets/6775c741-28ab-43fc-92c7-48383a1fb5aa" width="300">
- If a product's price changes, you will receive an email notification.

## Notes
- This app is intended to work locally only and does not require external hosting.
- Make sure you have Node.js installed on your machine.
