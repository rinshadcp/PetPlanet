const express = require("express");
const router = express.Router();
const passport = require("passport");
const { isAdminLoggedIn } = require("../middlewrares/authentication");
const controller = require("../controllers/admin/adminController");

router.get("/", controller.adminLoginPage);
router.get("/logout", controller.adminLogout);
router.get("/adminHome", controller.adminHome);
router.post(
  "/adminHome",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/admin",
  }),
  controller.adminLogin
);

//User Management
router.post("/blockUser/:id", isAdminLoggedIn, controller.blockUser);
router.post("/unblockUser/:id", isAdminLoggedIn, controller.unblockUser);
router.get("/viewUser", isAdminLoggedIn, controller.viewUser);

router.get("/animalPage", isAdminLoggedIn, controller.animalPage);
router.get("/agePage", isAdminLoggedIn, controller.agePage);
router.get("/addProductPage", isAdminLoggedIn, controller.addproductpage);
router.get("/viewProduct", isAdminLoggedIn, controller.viewproduct);
router.patch("/unListProduct/:id", isAdminLoggedIn, controller.unListProduct);
router.patch("/listProduct/:id", isAdminLoggedIn, controller.listProduct);
// router.get("/addProductPage", isAdminLoggedIn, controller.editProduct);
router.post("/editProduct/:id", isAdminLoggedIn, controller.editProduct);
router.post(
  "/editProductForm/:id",
  isAdminLoggedIn,
  controller.editProductForm
);

router.post("/addAnimal", isAdminLoggedIn, controller.addAnimal);
router.post("/deleteAnimal/:id", isAdminLoggedIn, controller.deleteAnimal);
router.post("/addAge", isAdminLoggedIn, controller.addAge);
router.post("/deleteAge/:id", isAdminLoggedIn, controller.deleteAge);
router.post("/addproduct", isAdminLoggedIn, controller.addproduct);
router
  .route("/brand")
  .get(isAdminLoggedIn, controller.brand)
  .post(isAdminLoggedIn, controller.addBrand);
router.post("/deleteBrand/:id", isAdminLoggedIn, controller.deleteBrand);

//Category Management
router.get("/category", isAdminLoggedIn, controller.category);
router.post("/categoryAdd", isAdminLoggedIn, controller.categoryAdd);
router.get("/categoryForm", isAdminLoggedIn, controller.categoryForm);
router.post("/deleteCategory/:id", isAdminLoggedIn, controller.deleteCategory);
router.post("/updateCategory/:id", isAdminLoggedIn, controller.updateCategory);
router.get("/editCategory/:id", isAdminLoggedIn, controller.editCategory);
router.post("/subCategoryAdd", isAdminLoggedIn, controller.subCategoryAdd);
router.get("/addMainCategory", isAdminLoggedIn, controller.addMainCategory);

//banner management
router.post("/deleteBanner/:id", isAdminLoggedIn, controller.deleteBanner);
router.post("/updateBanner/:id", isAdminLoggedIn, controller.updateBanner);
router
  .route("/banner")
  .get(isAdminLoggedIn, controller.banner)
  .post(isAdminLoggedIn, controller.addBanner);
router.get("/showBanner", isAdminLoggedIn, controller.showBanner);
router.post("/editBanner/:id", isAdminLoggedIn, controller.editBanner);

//coupon management
router
  .route("/coupon")
  .get(isAdminLoggedIn, controller.coupon)
  .post(isAdminLoggedIn, controller.addCoupon);
router.post("/deleteCoupon/:id", isAdminLoggedIn, controller.deleteCoupon);
router.post("/updateCoupon/:id", isAdminLoggedIn, controller.updateCoupon);
router.post("/editCoupon/:id", isAdminLoggedIn, controller.editCoupon);
router.get("/showCoupon", isAdminLoggedIn, controller.showCoupon);

//order management
router.get("/orders", isAdminLoggedIn, controller.orders);
router.post("/invoice/:id/:productId", isAdminLoggedIn, controller.invoice);
router.post("/changeStatus", isAdminLoggedIn, controller.changeStatus);

module.exports = router;
