const express = require("express");
const router = express.Router();
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const {
  getallUser,
  getaUser,
  deleteaUser,
  blockUser,
  unblockUser,
  logout,
  loginAdmin,
  updateOrderStatus,
  getAllOrders,
} = require("../controllers/userController");
//product
const {
  createProduct,
  getaProduct,
  getAllProduct,
  updateProduct,
  deleteProduct,
  addToWishlist,
  rating,
} = require("../controllers/productController");
const {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategory,
  getallCategory,
} = require("../controllers/productcategoryController");
const {
  createCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon,
} = require("../controllers/couponController");
const {
  createBrand,
  updateBrand,
  deleteBrand,
  getBrand,
  getallBrand,
} = require("../controllers/brandController");
router.post("/admin-login", loginAdmin);
router.get("/:id", authMiddleware, isAdmin, getaUser);
router.get("/all-users", getallUser);

router.delete("/:id", deleteaUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin, unblockUser);
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser);
router.get("/logout", logout);

router.get("/getallorders", authMiddleware, isAdmin, getAllOrders);
router.put(
  "/order/update-order/:id",
  authMiddleware,
  isAdmin,
  updateOrderStatus
);
router.post("/", authMiddleware, isAdmin, createProduct);

router.get("/:id", getaProduct);
router.put("/wishlist", authMiddleware, addToWishlist);
router.put("/rating", authMiddleware, rating);

router.put("/:id", authMiddleware, isAdmin, updateProduct);
router.delete("/:id", authMiddleware, isAdmin, deleteProduct);

router.get("/", getAllProduct);

//category

router.post("/", authMiddleware, isAdmin, createCategory);
router.put("/:id", authMiddleware, isAdmin, updateCategory);
router.delete("/:id", authMiddleware, isAdmin, deleteCategory);
router.get("/:id", getCategory);
router.get("/", getallCategory);

//coupen

router.post("/", authMiddleware, isAdmin, createCoupon);
router.get("/", authMiddleware, isAdmin, getAllCoupons);
router.put("/:id", authMiddleware, isAdmin, updateCoupon);
router.delete("/:id", authMiddleware, isAdmin, deleteCoupon);

//brand

router.post("/", authMiddleware, isAdmin, createBrand);
router.put("/:id", authMiddleware, isAdmin, updateBrand);
router.delete("/:id", authMiddleware, isAdmin, deleteBrand);
router.get("/:id", getBrand);
router.get("/", getallBrand);
module.exports = router;
