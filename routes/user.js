const express = require("express");
const router = express.Router();
const passport = require("passport");
const { isLoggedIn } = require("../middlewrares/authentication");
const User = require("../models/user/userModel");
const {
  home,
  renderRegister,
  register,
  renderLogin,
  login,
  logout,
  profile,
  newAddress,
  manageAddress,
  deleteAddress,
  showProductdetails,
  shop,
  addAddress,
} = require("../controllers/user/userController");
const cartController = require("../controllers/user/cartController");
const wishlistController = require("../controllers/user/wishlistController");
const orderController = require("../controllers/user/orderController");
router.get("/", home);
router.route("/signup").get(renderRegister).post(register);

router
  .route("/login")
  .get(renderLogin)
  .post(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    login
  );

router.get("/logout", logout);
router.get("/shop", isLoggedIn, shop);

//user profile and address management

router.get("/profile", isLoggedIn, profile);
router.get("/addAddressPage", isLoggedIn, addAddress);
router.post("/newAddress", newAddress);
router.get("/manageAddress", isLoggedIn, manageAddress);
router.get("/deleteAddress/:id", isLoggedIn, deleteAddress);

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
