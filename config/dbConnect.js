const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "../.env" });
//Connect to  database ...
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);
const dbConnect = () => {
  try {
    mongoose.connect(
      DB,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      console.log("Database Connected Successfully!!!")
    );
  } catch (err) {
    if (err) throw err;
    console.log("  Database error!!!");
  }
};
module.exports = dbConnect;
