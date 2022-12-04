const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");

dotenv.config({ path: "./config.env" });

//Connect to  database ...
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);
mongoose.connect(
  DB,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) throw err;
    console.log("  Connected to MongoDB!!!");
  }
);
// start server
const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`);
});
