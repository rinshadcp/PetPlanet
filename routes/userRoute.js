const express = require("express");
const router = express.Router();
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const {
  renderLogin,
  renderRegister,
  createUser,
  loginUserCtrl,
  handleRefreshToken,
  updatedUser,
  logout,
  updatePassword,
  forgotPasswordToken,
  resetPassword,
  getWishlist,
  saveAddress,
  userCart,
  getUserCart,
  emptyCart,
  applyCoupon,
  createOrder,
  getOrders,
} = require("../controllers/userController");

router.get("/register", renderRegister);
router.post("/register", createUser);
router.get("/login", renderLogin);
router.post("/login", loginUserCtrl);
router.get("/logout", logout);
router.put("/reset-password/:token", resetPassword);
router.put("/password", authMiddleware, updatePassword);
router.post("/forgot-password-token", forgotPasswordToken);

router.post("/cart", authMiddleware, userCart);
router.post("/cart/applycoupon", authMiddleware, applyCoupon);
router.post("/cart/cash-order", authMiddleware, createOrder);
router.get("/get-orders", authMiddleware, getOrders);
router.get("/refresh", handleRefreshToken);
router.get("/wishlist", authMiddleware, getWishlist);
router.get("/cart", authMiddleware, getUserCart);

router.delete("/empty-cart", authMiddleware, emptyCart);

router.put("/edit-user", authMiddleware, updatedUser);
router.put("/save-address", authMiddleware, saveAddress);

module.exports = router;
