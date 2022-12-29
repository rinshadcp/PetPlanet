if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const path = require("path");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const methodOverride = require("method-override");
const User = require("./models/userModel");
const multer = require("multer");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const userRoutes = require("./routes/userRoute");
const adminRoutes = require("./routes/adminRoute");
const dbConnect = require("./config/dbConnect");
dbConnect();
const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(cors());
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.use(cors());
// Multer (file upload setup)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images/petproduct/");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
    console.log(file.fieldname + Date.now() + path.extname(file.originalname));
  },
});
// const upload = multer({ storage: storage})
app.use(multer({ storage: storage }).array("image", 10));

app.use("/", userRoutes);
app.use("/admin", adminRoutes);

app.use(notFound);
app.use(errorHandler);

app.get("/", (req, res) => {
  app.render("user/index");
});

// start server
const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`);
});
