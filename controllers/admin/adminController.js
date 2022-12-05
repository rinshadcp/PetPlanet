const bcrypt = require("bcrypt");
const adminSignup = require("../../models/admin/adminSignup");
const addProduct = require("../../models/admin/addProduct");

const userSchema = require("../../models/user/userModel");

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
  
  viewUser:async(req,res) => {
    const users= await userSchema.find({ })
    res.render('admin/viewUser',{users,index:1});   
},
//show categroy section

animalPage: async (req, res) => {
  let animalCategory = await animalCategorySchema.find({})

  res.render("admin/animalCategory", { animalCategory ,index:1});
},
 // NEW ANIMAL
 addAnimal: (req, res) => {
  try {
      const animal = req.body.animal;
      const newAnimal = animalCategorySchema({ animal });
      newAnimal.save().then(res.redirect('/admin/animalPage'));

  } catch (err) {
      next(err)
  }
},
// DELETE ANIMAL
deleteAnimal: async (req, res) => {
  try {
      let id = req.params.id;
      // console.log("delete")
      await animalCategorySchema.findByIdAndDelete({ _id: id });
      res.redirect("/admin/animalPage")

  } catch (err) {
      next(err)
  }
},
//show categroy section

agePage: async (req, res) => {
  let ageCategory = await ageCategorySchema.find({})

  res.render("admin/ageCategory", { ageCategory ,index:1});
},
 // NEW AGE
 addAge: (req, res) => {
  try {
      const age = req.body.age;
      const newAge = ageCategorySchema({ age});
      newAge.save().then(res.redirect('/admin/agePage'));

  } catch (err) {
      next(err)
  }
},
// DELETE Age
deleteAge: async (req, res) => {
  try {
      let id = req.params.id;
      // console.log("delete")
      await ageCategorySchema.findByIdAndDelete({ _id: id });
      res.redirect("/admin/agePage")

  } catch (err) {
      next(err)
  }
},

    //add product page
    addproductpage: async (req, res) => {
      try {
          // if (req.session.adminLogin) {
              const animal = await animalCategorySchema.find()
              const age = await ageCategorySchema.find()

              res.render('admin/addproduct', { animal, age})//admin: req.session.admin })

          }

      // }
       catch (err) {
          next(err)
      }
  }









}


    








































