const express = require("express");
const router = express.Router();
const controller = require("../controllers/admin/adminController");

router.get("/", controller.adminLogin);

//User Management
router.post("/blockUser/:id", controller.blockUser);
router.post("/unblockUser/:id", controller.unblockUser);
router.get("/viewUser", controller.viewUser);

router.get("/animalPage", controller.animalPage);
router.get("/agePage", controller.agePage);
router.get("/addProductPage", controller.addproductpage);
router.get("/viewProduct", controller.viewproduct);

router.post("/addAnimal", controller.addAnimal);
router.post("/deleteAnimal/:id", controller.deleteAnimal);
router.post("/addAge", controller.addAge);
router.post("/deleteAge/:id", controller.deleteAge);
router.post("/addproduct", controller.addproduct);

router.use(function (req, res, next) {
  next(createError(404));
});

module.exports = router;
