const express = require("express");
const router = express.Router();
const controller = require("../controllers/admin/adminController");

router.get("/", controller.adminHome);

//User Management
router.post("/blockUser/:id", controller.blockUser);
router.post("/unblockUser/:id", controller.unblockUser);
router.get("/viewUser", controller.viewUser);

router.get("/animalPage", controller.animalPage);
router.get("/agePage", controller.agePage);
router.get("/addProductPage", controller.addproductpage);
router.get("/viewProduct", controller.viewproduct);
router.patch("/unListProduct/:id", controller.unListProduct);
router.patch("/listProduct/:id", controller.listProduct);
router.get("/addProductPage", controller.editProduct);
router.put("/editProductForm/:id", controller.editProduct);
router.put("/editProductForm/:id", controller.editProductForm);

router.post("/addAnimal", controller.addAnimal);
router.post("/deleteAnimal/:id", controller.deleteAnimal);
router.post("/addAge", controller.addAge);
router.post("/deleteAge/:id", controller.deleteAge);
router.post("/addproduct", controller.addproduct);
router.route("/brand").get(controller.brand).post(controller.addBrand);
router.post("/deleteBrand/:id", controller.deleteBrand);

//Category Management
router.get("/category", controller.category);
router.post("/categoryAdd", controller.categoryAdd);
router.get("/categoryForm", controller.categoryForm);
router.post("/deleteCategory/:id", controller.deleteCategory);
router.post("/updateCategory/:id", controller.updateCategory);
router.get("/editCategory/:id", controller.editCategory);
router.post("/subCategoryAdd", controller.subCategoryAdd);
router.get("/addMainCategory", controller.addMainCategory);

//banner management
router.post("/deleteBanner/:id", controller.deleteBanner);
router.post("/updateBanner/:id", controller.updateBanner);
router.route("/banner").get(controller.banner).post(controller.addBanner);
router.get("/showBanner", controller.showBanner);
router.post("/editBanner/:id", controller.editBanner);

//coupon management
router.route("/coupon").get(controller.coupon).post(controller.addCoupon);
router.post("/deleteCoupon/:id", controller.deleteCoupon);
router.post("/updateCoupon/:id", controller.updateCoupon);
router.post("/editCoupon/:id", controller.editCoupon);
router.get("/showCoupon", controller.showCoupon);

//order management
router.get("/orders", controller.orders);
router.post("/invoice/:id/:productId", controller.invoice);
router.post("/changeStatus", controller.changeStatus);

module.exports = router;
