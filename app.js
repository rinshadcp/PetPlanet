if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const path = require("path");
const ejs = require("ejs");
const ejsMate = require("ejs-mate");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const session = require("express-session");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user/userModel");
const multer = require("multer");
const { notFound, errorHandler } = require("./middlewrares/errorHandler");
const userRoutes = require("./routes/user");
const adminRoutes = require("./routes/admin");
const dbConnect = require("./config/dbConnect");
dbConnect();
const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(cors());
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

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
const upload = multer({ storage: storage });
app.use(
  multer({ dest: "public/images/petproduct/", storage: storage }).array(
    "image",
    10
  )
);

const secret = process.env.SECRET || "thisshouldbeabettersecret!";
const sessionConfig = {
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(flash());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/", userRoutes);
app.use("/admin", adminRoutes);

app.use(notFound);
app.use(errorHandler);

app.get("*", (req, res) => {
  app.render("error");
});

// start server
const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`);
});
