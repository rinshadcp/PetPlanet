if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}

const express = require("express");
const path = require("path");
const ejs = require("ejs");
const bodyParser = require('body-parser');
const session = require("express-session");
const flash = require("connect-flash");
const logger = require("morgan");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const ExpressError = require('./utils/expressError');
const User = require("./models/user/userModel");
const multer= require('multer');
const userRoutes= require('./routes/user');
const adminRoutes= require('./routes/admin');

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));



// Multer (file upload setup)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, "public/images/petproduct/");
  },
  filename: (req, file, cb) => {
      cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
      console.log(file.fieldname + Date.now() + path.extname(file.originalname));
  },
});
// const upload = multer({ storage: storage})
app.use(multer({ storage: storage }).array("image", 10))

const secret = process.env.SECRET || 'thisshouldbeabettersecret!';
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

app.use(logger("dev"));
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use('/',userRoutes);
app.use('/admin',adminRoutes);


app.get('/', (req, res) => {
  res.render('user/index')
});



app.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404))
})

// app.use((err, req, res, next) => {
//   const { statusCode = 500 } = err;
//   if (!err.message) err.message = 'Oh No, Something Went Wrong!'
//   res.status(statusCode).render('user/error', { err })
// })

module.exports = app;
