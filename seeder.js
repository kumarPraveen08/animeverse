const fs = require("fs");
const mongoose = require("mongoose");
const colors = require("colors");
const dotenv = require("dotenv");

// Load env vars
dotenv.config({ path: "./config/config.env" });

// Load models
const Quote = require("./models/Quotes");

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
});

// Read JSON files
const quotes = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/quotes2.json`, "utf-8")
);

// Import into DB
const importData = async () => {
  try {
    await Quote.create(quotes);
    console.log(`Data Imported...`.green.inverse);
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

// Delete data from DB
const deleteData = async () => {
  try {
    await Quote.deleteMany();
    console.log(`Data Destroyed...`.red.inverse);
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}
