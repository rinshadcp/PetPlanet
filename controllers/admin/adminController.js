const bcrypt = require("bcrypt");
const adminSignup = require("../../models/admin/adminSignup");
const addProduct = require("../../models/admin/addProduct");
const asyncHandler = require("express-async-handler");
const signupModel = require("../../models/user/userModel");
const userSchema = require("../../models/user/userModel");
const couponSchema = require("../../models/admin/couponSchema");
const orderSchema = require("../../models/user/orderSchema");
const bannerModel = require("../../models/admin/bannerModel");

const animalCategorySchema = require("../../models/admin/animalCategorySchema");
const ageCategorySchema = require("../../models/admin/ageCategorySchema");

const moment = require("moment");

module.exports = {
  // admin Login

  adminLogin: (req, res) => {
    res.render("admin/login");
  },

  // admin home

  adminHome: (req, res) => {
    res.render("admin/index");
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

    res.render("admin/Category", { ageCategory, index: 1 });
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

  //add product page
  addproductpage: asyncHandler(async (req, res) => {
    try {
      // if (req.session.adminLogin) {
      const animal = await animalCategorySchema.find();
      const age = await ageCategorySchema.find();

      res.render("admin/addProduct", { animal, age }); //admin: req.session.admin })
    } catch (err) {
      // }
      next(err);
    }
  }),
  //add products
  addproduct: asyncHandler(async (req, res) => {
    try {
      const { animal, age, name, description, price } = req.body;

      const image = req.files;
      image.forEach((img) => {});
      console.log(image);
      const productimages =
        image != null ? image.map((img) => img.filename) : null;
      console.log(productimages);

      const newProduct = addProduct({
        animal,
        age,
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
    const products = await addProduct.find();
    // .sort({ date: -1 }).skip((page - 1) * items_per_page).limit(items_per_page)
    console.log(products);
    res.render("admin/viewProduct", {
      products,
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
      res.render("/admin/editProductForm", {
        singleProduct,
        age,
        animal,
      });
    } catch {
      res.render("error");
    }
  }),

  // update product

  editProduct: asyncHandler(async (req, res) => {
    try {
      const id = req.params.id;

      const image = req.file;

      const { age, name, animal, description, price } = req.body;

      await addProduct
        .updateOne(
          { _id: id },
          {
            $set: {
              age,

              name,
              animal,
              description,
              price,
              image: image.path,
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
};
