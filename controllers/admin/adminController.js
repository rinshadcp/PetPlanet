const bcrypt = require("bcrypt");
const sharp = require("sharp");
const adminSignup = require("../../models/admin/adminSignup");
const addProduct = require("../../models/admin/addProduct");
const asyncHandler = require("express-async-handler");
const signupModel = require("../../models/user/userModel");
const userSchema = require("../../models/user/userModel");
const couponSchema = require("../../models/admin/couponSchema");
const orderSchema = require("../../models/user/orderSchema");
const bannerModel = require("../../models/admin/bannerModel");
const brandSchema = require("../../models/admin/brandModel");
const categorySchema = require("../../models/admin/categorySchema");
const subCategorySchema = require("../../models/admin/subCategorySchema");
const animalCategorySchema = require("../../models/admin/animalCategorySchema");
const ageCategorySchema = require("../../models/admin/ageCategorySchema");

const moment = require("moment");

module.exports = {
  // admin Login

  adminLogin: (req, res) => {
    res.render("admin/login");
  },

  // admin home

  adminHome: async (req, res) => {
    const orders = await orderSchema
      .find({})
      .populate("products.productId")
      .populate("userId");
    res.render("admin/index", { orders });
  },

  viewUser: asyncHandler(async (req, res) => {
    const users = await userSchema.find({});
    res.render("admin/viewUser", { users, index: 1 });
  }),
  // block a user

  blockUser: asyncHandler(async (req, res) => {
    let id = req.params.id;
    await signupModel
      .findByIdAndUpdate(
        { _id: id },
        {
          $set: {
            status: "blocked",
          },
        }
      )
      .then(() => {
        res.redirect("/admin/viewUser");
      });
  }),

  //unblock a user

  unblockUser: asyncHandler(async (req, res) => {
    let id = req.params.id;
    await signupModel
      .findByIdAndUpdate(
        { _id: id },
        {
          $set: {
            status: "unblocked",
          },
        }
      )
      .then(() => {
        res.redirect("/admin/viewUser");
      });
  }),

  //show categroy section

  animalPage: async (req, res) => {
    let animalCategory = await animalCategorySchema.find({});

    res.render("admin/animalCategory", { animalCategory, index: 1 });
  },
  // NEW ANIMAL
  addAnimal: (req, res) => {
    try {
      const animal = req.body.animal;
      const newAnimal = animalCategorySchema({ animal });
      newAnimal.save().then(res.redirect("/admin/animalPage"));
    } catch (err) {
      next(err);
    }
  },
  // DELETE ANIMAL
  deleteAnimal: async (req, res) => {
    try {
      let id = req.params.id;
      // console.log("delete")
      await animalCategorySchema.findByIdAndDelete({ _id: id });
      res.redirect("/admin/animalPage");
    } catch (err) {
      next(err);
    }
  },
  //show categroy section

  agePage: async (req, res) => {
    let ageCategory = await ageCategorySchema.find({});

    res.render("admin/ageCategory", { ageCategory, index: 1 });
  },
  // NEW AGE
  addAge: (req, res) => {
    try {
      const age = req.body.age;
      const newAge = ageCategorySchema({ age });
      newAge.save().then(res.redirect("/admin/agePage"));
    } catch (err) {
      next(err);
    }
  },
  // DELETE Age
  deleteAge: async (req, res) => {
    try {
      let id = req.params.id;
      // console.log("delete")
      await ageCategorySchema.findByIdAndDelete({ _id: id });
      res.redirect("/admin/agePage");
    } catch (err) {
      next(err);
    }
  },

  //brands

  brand: async (req, res) => {
    let Brand = await brandSchema.find({});

    res.render("admin/brand", { Brand, index: 1 });
  },

  //add a new brand
  addBrand: (req, res) => {
    try {
      const brand = req.body.brand;
      const newBrand = brandSchema({ brand });
      newBrand.save().then(res.redirect("/admin/brand"));
    } catch (err) {
      next(err);
    }
  },
  // DELETE Age
  deleteBrand: async (req, res) => {
    try {
      let id = req.params.id;
      // console.log("delete")
      await brandSchema.findByIdAndDelete({ _id: id });
      res.redirect("/admin/brand");
    } catch (err) {
      next(err);
    }
  },

  //show categroy section

  category: async (req, res) => {
    let subCategory = await subCategorySchema.find({}).populate("category_id");

    res.render("admin/category", { subCategory });
  },

  //adding new category

  categoryAdd: async (req, res) => {
    try {
      const check_cat = await categorySchema.find({
        category: req.body.category,
      });
      if (check_cat.length > 0) {
        let checking = false;
        for (let i = 0; i < check_cat.length; i++) {
          if (
            check_cat[i]["category"].toLowerCase() ===
            req.body.category.toLowerCase()
          ) {
            checking = true;
            break;
          }
        }
        if (checking === false) {
          const category = new categorySchema({
            category: req.body.category,
          });
          const sub_cat_data = await category.save().then(() => {
            res.redirect("/admin/category");
          });
        } else {
          res.redirect("/admin/category");
        }
      } else {
        const category = new categorySchema({
          category: req.body.category,
        });
        const sub_cat_data = await category.save().then(() => {
          res.redirect("/admin/category");
        });
      }
    } catch (error) {
      res.render("error");
    }
  },

  //add main categroy

  addMainCategory: (req, res) => {
    res.render("admin/mainCategory");
  },

  //adding sub category

  subCategoryAdd: async (req, res) => {
    try {
      const { category, subCategory } = req.body;
      const image = req.files;
      image.forEach((img) => {});
      console.log(image);
      const productimages =
        image != null ? image.map((img) => img.filename) : null;
      console.log(productimages);
      const check_sub = await subCategorySchema.find({
        category_id: category,
      });
      if (check_sub.length > 0) {
        let checking = false;
        for (let i = 0; i < check_sub.length; i++) {
          if (
            check_sub[i]["subCategory"].toLowerCase() ===
            req.body.subCategory.toLowerCase()
          ) {
            checking = true;
            break;
          }
        }
        if (checking === false) {
          const subCategory = new subCategorySchema({
            category_id: category,
            subCategory: req.body.subCategory,
            image: productimages,
          });
          const sub_cat_data = await subCategory.save().then(() => {
            res.redirect("/admin/category");
          });
        } else {
          res.redirect("/admin/category");
        }
      } else {
        const subCategory = new subCategorySchema({
          category_id: category,
          subCategory: req.body.subCategory,
          image: productimages,
        });
        const sub_cat_data = await subCategory.save().then(() => {
          res.redirect("/admin/category");
        });
      }
    } catch (error) {
      res.render("error");
    }
  },

  //edit category form

  editCategory: async (req, res, next) => {
    try {
      const id = req.params.id;
      const image = productimages;
      let category = await categorySchema.find();
      const singleCategory = await subCategorySchema
        .findOne({ _id: id })
        .populate("category_id");

      res.render("admin/editCategory", { singleCategory, category });
    } catch {
      res.render("error");
    }
  },

  //categroy form

  categoryForm: async (req, res) => {
    let category = await categorySchema.find();
    res.render("admin/categoryForm", { category });
  },

  //update category

  updateCategory: async (req, res) => {
    try {
      const id = req.params.id;
      if (req.file) {
        // await ProductModel.findByIdAndUpdate(
        //     { _id: req.params.id }, { $set: { image: image.filename } }
        // );
        const image = req.files;
        image.forEach((img) => {});
        console.log(image);
        const categortimages =
          image != null ? image.map((img) => img.filename) : null;
        console.log(productimages);

        await ProductModel.findByIdAndUpdate(
          { _id: req.params.id },
          { $set: { image: productimages } }
        );
      }
      const { category, subCategory } = req.body;

      await subCategorySchema
        .updateOne(
          { _id: id },
          {
            $set: {
              category_id: category,
              subCategory: subCategory,
              image: productimages,
            },
          }
        )

        .then(() => {
          res.redirect("/admin/category");
        })
        .catch((err) => {
          console.log(err);
        });
    } catch {
      res.render("error");
    }
  },

  //delete category

  deleteCategory: async (req, res, next) => {
    let id = req.params.id;
    await subCategorySchema.findByIdAndRemove({ _id: id }).then(() => {
      res.redirect("/admin/category");
    });
  },

  //add product page
  addproductpage: asyncHandler(async (req, res) => {
    try {
      const animal = await animalCategorySchema.find();
      const age = await ageCategorySchema.find();
      let category = await categorySchema.find().populate("category");
      let subCategory = await subCategorySchema.find();
      let brand = await brandSchema.find();
      res.render("admin/addProduct", {
        animal,
        age,
        category,
        subCategory,
        brand,
      });
    } catch (err) {
      next(err);
    }
  }),
  //add products
  addproduct: asyncHandler(async (req, res) => {
    try {
      const {
        animal,
        age,
        category,
        subCategory,
        brand,
        name,
        description,
        price,
      } = req.body;

      const image = req.files;
      image.forEach((img) => {});
      console.log(image);
      const productimages =
        image != null ? image.map((img) => img.filename) : null;
      console.log(productimages);
      await sharp(req.file.path)
        .resize(200, 200)
        .jpeg({ quality: 90 })
        .toFile(path.resolve(req.file.destination, "resized", image));
      fs.unlinkSync(req.file.path);

      const newProduct = addProduct({
        animal,
        age,
        category,
        subCategory,
        brand,
        name,
        description,
        price,
        // image: image.filename,
        image: productimages,
      });
      console.log(newProduct);

      await newProduct
        .save()
        .then(() => {
          res.redirect("/admin/addProductPage");
        })
        .catch((err) => {
          console.log(err.message);
          res.redirect("/admin/addproductpage");
        });
    } catch (err) {
      next(err);
    }
  }),
  //view all products
  viewproduct: asyncHandler(async (req, res) => {
    // try {
    // const page = parseInt(req.query.page) || 1;
    // const items_per_page = 5;
    // const totalproducts = await ProductModel.find().countDocuments()
    // console.log(totalproducts);
    const animal = await animalCategorySchema.find();
    const age = await ageCategorySchema.find();
    const products = await addProduct
      .find({})
      .populate("category")
      .populate("brand");
    // .sort({ date: -1 }).skip((page - 1) * items_per_page).limit(items_per_page)
    console.log(products);
    res.render("admin/viewProduct", {
      products,
      animal,
      age,
      index: 1,
    });
    //  admin: req.session.admin, page,
    // hasNextPage: items_per_page * page < totalproducts,
    // hasPreviousPage: page > 1,
    // PreviousPage: page - 1,

    // } catch (err) {
    //     next(err)
    // }
  }),
  //list product

  listProduct: asyncHandler(async (req, res) => {
    let id = req.params.id;
    await addProduct
      .findByIdAndUpdate(
        { _id: id },
        {
          $set: {
            status: "listed",
          },
        }
      )
      .then(() => {
        res.redirect("/admin/viewProduct");
      });
  }),

  //unlist product

  unListProduct: asyncHandler(async (req, res) => {
    let id = req.params.id;
    await addProduct
      .findByIdAndUpdate(
        { _id: id },
        {
          $set: {
            status: "unlisted",
          },
        }
      )
      .then(() => {
        res.redirect("/admin/viewProduct");
      });
  }),

  //edit product page

  editProductForm: asyncHandler(async (req, res) => {
    try {
      const id = req.params.id;

      const singleProduct = await addProduct.findOne({ _id: id });
      let age = await ageCategorySchema.find();
      let animal = await animalCategorySchema.find();
      let category = await categorySchema.find().populate("category");
      let subCategory = await subCategorySchema.find();
      let brand = await brandSchema.find();
      res.render("/admin/editProductForm", {
        singleProduct,
        age,
        animal,
        category,
        subCategory,
        brand,
      });
    } catch {
      res.render("error");
    }
  }),

  // update product

  editProduct: asyncHandler(async (req, res) => {
    try {
      const id = req.params.id;
      if (req.file) {
        // await ProductModel.findByIdAndUpdate(
        //     { _id: req.params.id }, { $set: { image: image.filename } }
        // );
        const image = req.files;
        image.forEach((img) => {});
        console.log(image);
        const productimages =
          image != null ? image.map((img) => img.filename) : null;
        console.log(productimages);

        // await ProductModel.findByIdAndUpdate({ _id: req.params.id }, { $set: { image: productimages } })
      }
      const {
        age,
        name,
        animal,
        brand,
        category,
        subCategory,
        description,
        price,
      } = req.body;

      await addProduct
        .updateOne(
          { _id: id },
          {
            $set: {
              age,
              brand,
              category,
              subCategory,
              name,
              animal,
              description,
              price,
              image: productimages,
            },
          }
        )

        .then(() => {
          res.redirect("/admin/viewProduct");
        });
    } catch {
      res.render("error");
    }
  }),

  //add banner page

  banner: (req, res) => {
    res.render("admin/banner");
  },

  // add new banner

  addBanner: async (req, res) => {
    try {
      const { title, description } = req.body;
      const image = req.files;
      image.forEach((img) => {});
      console.log(image);
      const productimages =
        image != null ? image.map((img) => img.filename) : null;

      await new bannerModel({
        title,
        description,
        image: productimages,
      })
        .save()
        .then(() => {
          res.redirect("/admin/banner");
        });
    } catch (e) {
      throw Error(e);
      // res.render("error");
    }
  },

  //show banner

  showBanner: async (req, res) => {
    let banner = await bannerModel.find();
    res.render("admin/showBanner", { banner });
  },

  //edit banner

  editBanner: async (req, res) => {
    try {
      let bannerId = req.params.id;
      let banner = await bannerModel.findById({ _id: bannerId });
      res.render("admin/editBanner", { banner });
    } catch {
      res.render("error");
    }
  },

  //update edited banner

  updateBanner: async (req, res) => {
    try {
      const id = req.params.id;
      const { title, description } = req.body;
      const image = req.file;
      const productimages =
        image != null ? image.map((img) => img.filename) : null;
      const banner = await bannerModel.findByIdAndUpdate(
        { _id: id },
        {
          $set: {
            title,
            description,

            image: productimages,
          },
        }
      );
      banner.save().then(() => {
        res.redirect("admin/showBanner");
      });
    } catch {
      res.render("error");
    }
  },

  //delete banner

  deleteBanner: async (req, res) => {
    const id = req.params.id;
    await bannerModel.findByIdAndDelete({ _id: id }).then(() => {
      res.redirect("admin/showBanner");
    });
  },
  //coupon management

  coupon: (req, res) => {
    res.render("admin/couponManagement");
  },

  //show coupons page

  showCoupon: async (req, res) => {
    let coupon = await couponSchema.find();
    res.render("admin/showCoupon", { coupon });
  },

  // add new coupon

  addCoupon: async (req, res) => {
    const coupon = req.body;
    await new couponSchema(coupon).save().then(() => {
      res.redirect("/admin/coupon");
    });
  },

  //delete coupon

  deleteCoupon: async (req, res) => {
    const id = req.params.id;
    await couponSchema.findByIdAndDelete({ _id: id }).then(() => {
      res.redirect("/admin/showCoupon");
    });
  },

  //update coupon

  updateCoupon: async (req, res) => {
    try {
      const id = req.params.id;
      const { name, code, discount } = req.body;

      const coupon = await couponSchema.findByIdAndUpdate(
        { _id: id },
        {
          $set: {
            name,
            code,
            discount,
          },
        }
      );
      coupon.save().then(() => {
        res.redirect("/admin/showCoupon");
      });
    } catch {
      res.render("error");
    }
  },

  //edit coupon

  editCoupon: async (req, res) => {
    try {
      let couponId = req.params.id;
      let coupon = await couponSchema.findById({ _id: couponId });
      res.render("admin/editCoupon", { coupon });
    } catch {
      res.render("error");
    }
  },
  //orders page

  orders: asyncHandler(async (req, res) => {
    try {
      // const page = parseInt(req.query.page) || 1;
      // const items_per_page = 8;
      const totalproducts = await orderSchema.find().countDocuments();
      const orders = await orderSchema
        .find({})
        .populate("products.productId")
        .populate("userId");

      // .sort({ date: -1 })
      // .skip((page - 1) * items_per_page)
      // .limit(items_per_page);

      res.render("admin/orders", {
        orders,
        moment,
        index: 1,
        // page,
        // hasNextPage: items_per_page * page < totalproducts,
        // hasPreviousPage: page > 1,
        // PreviousPage: page - 1,
      });
    } catch {
      res.render("error");
    }
  }),
  //invoice

  invoice: async (req, res) => {
    try {
      let orderId = req.params.id;
      let productId = req.params.productId;

      let order = await orderSchema
        .findOne({ _id: orderId })
        .populate("products.productId")
        .populate("userId")
        .populate("address");

      const products = order.products;
      const address = order.address;
      res.render("admin/invoice", { order, address, products, moment });
    } catch {
      console.log("catchhhhh");
      res.render("error");
    }
  },

  //change order status in order management

  changeStatus: async (req, res) => {
    try {
      const { status, orderId, productId } = req.body;
      if (status == "Order Placed") {
        await orderSchema.updateOne(
          { _id: orderId, "products.productId": productId },
          { $set: { "products.$.orderStatus": "Packed" } }
        );
      } else if (status == "Packed") {
        await orderSchema.updateOne(
          { _id: orderId, "products.productId": productId },
          { $set: { "products.$.orderStatus": "Shipped" } }
        );
      } else if (status == "Shipped") {
        await orderSchema.updateOne(
          { _id: orderId, "products.productId": productId },
          {
            $set: {
              "products.$.orderStatus": "Delivered",
              "products.$.paymentStatus": "Paid",
            },
          },
          { multi: true }
        );
      } else {
        await orderSchema.updateOne(
          { _id: orderId, "products.productId": productId },
          {
            $set: {
              "products.$.orderStatus": "Cancelled",
              "products.$.paymentStatus": "Unpaid",
            },
          },
          { multi: true }
        );
      }
      res.json({ success: "success" });
    } catch {
      res.render(error);
    }
  },
};
