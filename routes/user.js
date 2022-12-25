const express = require("express");
const router = express.Router();
const passport = require("passport");
const { isLoggedIn } = require("../middlewrares/authentication");
const User = require("../models/user/userModel");
const user = require("../controllers/user/userController");
const cartController = require("../controllers/user/cartController");
const wishlistController = require("../controllers/user/wishlistController");
const orderController = require("../controllers/user/orderController");
router.get("/", user.home);
router.route("/signup").get(user.renderRegister).post(user.register);

router
  .route("/login")
  .get(user.renderLogin)
  .post(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    user.login
  );

router.get("/logout", user.logout);
router.get("/shop", user.shop);

//user profile and address management

router.get("/profile", isLoggedIn, user.profile);
router.get("/addAddressPage", isLoggedIn, user.addAddress);
router.post("/newAddress", user.newAddress);
router.get("/manageAddress", isLoggedIn, user.manageAddress);
router.get("/deleteAddress/:id", isLoggedIn, user.deleteAddress);

//wishlist routes

router.get("/wishlist", isLoggedIn, wishlistController.wishlist);
router.post("/addToWishlist", wishlistController.addToWishlist);
router.get(
  "/removeWishlistProduct/:id",
  wishlistController.removeWishlistProduct
);
router.get("/moveToCart/:id", isLoggedIn, wishlistController.moveToCart);

//cart routes

router.get("/cart", isLoggedIn, cartController.cart);
router.post("/addToCart/:id", isLoggedIn, cartController.addToCart);
router.get(
  "/removeProduct/:id/:total",
  isLoggedIn,
  cartController.removeCartProduct
);
router.post("/QtyIncrement", isLoggedIn, cartController.QtyIncrement);
router.post("/QtyDecrement", isLoggedIn, cartController.QtyDecrement);

//order management
router.post("/changeAddress", orderController.checkout);
router.get("/checkout", isLoggedIn, orderController.checkout);
router.post("/placeOrder", orderController.placeOrder);
router.get("/orderSuccess", isLoggedIn, orderController.orderSuccess);
router.post("/checkoutNewAddress", orderController.checkoutNewAddress);
// router.post('/verifyPayment' , isLoggedIn ,orderController.verifyPayment)
// router.get('/orders',isLoggedIn, orderController.orders)
// router.post('/cancelOrder',isLoggedIn,orderController.cancelOrder)
// router.post('/checkCoupen' ,isLoggedIn, cartController.checkCoupen)

module.exports = router;
