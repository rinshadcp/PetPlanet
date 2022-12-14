const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn}= require('../middlewrares/authentication')
const User = require('../models/user/userModel');
const user = require('../controllers/user/authController');
const cartController = require("../controllers/user/cartController");
const wishlistController = require("../controllers/user/wishlistController");

router.get('/',user.home);
router.route('/signup')
    .get(user.renderRegister)
    .post(catchAsync(user.register));

router.route('/login')
    .get(user.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), user.login)

router.get('/logout', user.logout)



//wishlist routes

router.get("/wishlist", isLoggedIn,wishlistController.wishlist);
router.post("/addToWishlist",wishlistController.addToWishlist);
router.get("/removeWishlistProduct/:id",wishlistController.removeWishlistProduct);
router.get('/moveToCart/:id', isLoggedIn , wishlistController.moveToCart);

//cart routes                   

router.get("/cart", isLoggedIn, cartController.cart);
router.post("/addToCart/:id", isLoggedIn, cartController.addToCart);
router.get("/removeProduct/:id/:total",isLoggedIn,cartController.removeCartProduct);
router.post("/QtyIncrement",isLoggedIn,cartController.QtyIncrement);
router.post("/QtyDecrement",isLoggedIn,cartController.QtyDecrement);



module.exports = router;