if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}

const express = require("express");
const path = require("path");
const ejs = require("ejs");
const session = require("express-session");
const flash = require("connect-flash");
const logger = require("morgan");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const ExpressError = require('./utils/expressError');
const User = require("./models/userModel");

const userRoutes= require('./routes/user')

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
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




app.get('/', (req, res) => {
  res.render('user/index')
});


app.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = 'Oh No, Something Went Wrong!'
  res.status(statusCode).render('user/error', { err })
})

module.exports = app;
