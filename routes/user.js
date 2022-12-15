const express = require('express');
const router = express.Router();
const passport = require('passport');
const {isLoggedIn}= require('../middlewrares/authentication')
const User = require('../models/user/userModel');
const user = require('../controllers/user/userController');
const cartController = require("../controllers/user/cartController");
const wishlistController = require("../controllers/user/wishlistController");

router.get('/',user.home);
router.route('/signup')
    .get(user.renderRegister)
    .post(user.register);

router.route('/login')
    .get(user.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), user.login)

router.get('/logout', user.logout)



//user profile and address management

router.get('/profile',isLoggedIn,user.profile);
router.get("/addAddressPage", isLoggedIn, user.addAddress);
router.post("/newAddress", user.newAddress);
router.get("/manageAddress", isLoggedIn, user.manageAddress);
router.get("/deleteAddress/:id",isLoggedIn,user.deleteAddress);

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