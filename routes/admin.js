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

module.exports = router;
