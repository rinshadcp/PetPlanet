const User = require("../../models/user/userModel");
const asyncHandler = require("express-async-handler");
const addressSchema = require("../../models/user/addressSchema");
const nodemailer = require("nodemailer");
const cartModel = require("../../models/user/cartModel");
const addProduct = require("../../models/admin/addProduct");
const bannerModel = require("../../models/admin/bannerModel");
const contactSchema = require("../../models/user/contactSchema");
const categorySchema = require("../../models/admin/categorySchema");
const animalCategory = require("../../models/admin/animalCategorySchema");
const passportLocalMongoose = require("passport-local-mongoose");

const {
  isLoggedIn,
  checkReturnTo,
} = require("../../middlewrares/authentication");
const brandModel = require("../../models/admin/brandModel");
var otp = Math.random();
otp = otp * 1000000;
otp = parseInt(otp);
console.log(otp);

var Name;
var Email;
var Phone;
var Password;

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  service: "Gmail",

  auth: {
    user: "petplanet7337@gmail.com",
    pass: "vttiwxoxfvvaupzi",
  },
});

const home = asyncHandler(async (req, res) => {
  const products = await addProduct
    .find({})
    .populate("brand")
    .sort({ date: -1 })
    .limit(12);

  const banner = await bannerModel.find();
  const Brand = await brandModel.find();
  const Pet = await animalCategory.find();
  let user = req.user;

  if (user) {
    res.render("user/index", {
      products,
      user,
      banner,
      Pet,
      Brand,
    });
  } else {
    res.render("user/index", { products, banner, Pet, Brand });
  }
});
const renderRegister = (req, res) => {
  res.render("user/signup");
};

// DO_SIGNUP
const sendOtp = asyncHandler(async (req, res) => {
  fName = req.body.firstname;
  lName = req.body.lastname;

  Email = req.body.email;
  uName = req.body.username;
  Phone = req.body.phone;
  Password = req.body.password;
  console.log(Phone);
  const user = await User.findOne({ email: Email });

  // send mail with defined transport object
  if (!user) {
    var mailOptions = {
      to: req.body.email,
      subject: "Otp for registration is: ",
      html:
        "<h3>OTP for account verification is </h3>" +
        "<h1 style='font-weight:bold;'>" +
        otp +
        "</h1>", // html body
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log("Message sent: %s", info.messageId);
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

      res.render("user/otp");
    });
  } else {
    res.redirect("/login");
  }
});

const resendOtp = asyncHandler(async (req, res) => {
  var mailOptions = {
    to: Email,
    subject: "Otp for registration is: ",
    html:
      "<h3>OTP for account verification is </h3>" +
      "<h1 style='font-weight:bold;'>" +
      otp +
      "</h1>", // html body
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    res.render("user/otp");
  });
});

const verifyOtp = asyncHandler(
  async (req, res) => {
    if (req.body.otp == otp) {
      // const { firstname, lastname, username, phone, email, password } =
      //   req.body;
      // console.log(".........................", req.body);
      const user = new User({
        firstname: fName,
        lastname: lName,
        username: uName,
        phone: Phone,
        email: Email,
      });
      const registeredUser = await User.register(user, Password);
      console.log(registeredUser);
      req.login(registeredUser, (err) => {
        if (err) return next(err);
        req.flash("success", "Welcome to home!");
        res.redirect("/login");
      });
    } else {
      res.render("user/otp");
    }
  }

  //
);

// const register = asyncHandler(async (req, res, next) => {
//   try {
//     const { firstname, lastname, username, phone, email, password } = req.body;
//     const user = new User({ firstname, lastname, username, phone, email });
//     const registeredUser = await User.register(user, password);
//     req.login(registeredUser, (err) => {
//       if (err) return next(err);
//       req.flash("success", "Welcome to home!");
//       res.redirect("/");
//     });
//   } catch (e) {
//     req.flash("error", e.message);
//     res.redirect("/signup");
//   }
// });
const renderLogin = (req, res) => {
  res.render("user/login");
};

const login = (req, res) => {
  req.flash("success", "welcome back!");
  const redirectUrl = req.session.returnTo || "/";
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};

const logout = (req, res) => {
  // req.logout();
  req.session.destroy();
  // req.flash('success', "Goodbye!");
  res.redirect("/login");
};
//profile page

const profile = asyncHandler(async (req, res) => {
  let userId = req.user._id;
  let user = req.user;
  const Brand = await brandModel.find();
  const Pet = await animalCategory.find();

  // console.log(userId);

  let address = await addressSchema.findOne({ userId });

  if (address != null) {
    if (address.address.length > 0) {
      let num = address.address.length - 1;
      address = address.address[num];
    } else address = [];
  } else {
    address = [];
  }

  res.render("user/profile", { address, user, Pet, Brand });
});
// add address

const addAddress = async (req, res) => {
  let user = req.body;
  const Brand = await brandModel.find();
  const Pet = await animalCategory.find();
  res.render("user/addAddress", { user, Pet, Brand });
};
const manageAddress = asyncHandler(async (req, res) => {
  let userId = req.user._id;
  let user = req.user;
  const Brand = await brandModel.find();
  const Pet = await animalCategory.find();

  let address = await addressSchema.findOne({ userId: userId });

  if (address != null) {
    if (address.address.length > 0) {
      address = address.address;
    } else address = [];
  } else {
    address = [];
  }

  res.render("user/manageAddress", { address, user, Pet, Brand, index: 1 });
});
const deleteAddress = asyncHandler(async (req, res) => {
  let userId = req.user._id;
  let addressId = req.params.id;

  let address = await addressSchema
    .findOneAndUpdate(
      { userId: userId },
      { $pull: { address: { _id: addressId } } }
    )
    .then(() => {
      res.redirect("/manageAddress");
    });
});
const newAddress = asyncHandler(async (req, res) => {
  let userId = req.user._id;
  let user = req.user;
  const { fullName, houseName, city, state, pincode, phone } = req.body;
  let exist = await addressSchema.findOne({ userId: userId });

  if (exist) {
    await addressSchema
      .findOneAndUpdate(
        { userId },
        {
          $push: {
            address: { fullName, houseName, city, state, pincode, phone },
          },
        }
      )
      .then(() => {
        res.redirect("/manageAddress");
      });
  } else {
    const address = new addressSchema({
      userId,
      address: [{ fullName, houseName, city, state, pincode, phone }],
    });
    await address
      .save()
      .then(() => {
        res.redirect("/manageAddress");
      })
      .catch((err) => {
        console.log(err.message);
      });
  }
});

// single product details page

const showProductdetails = asyncHandler(async (req, res) => {
  const id = req.params.id;
  let user = req.user;
  const Brand = await brandModel.find();
  const Pet = await animalCategory.find();
  const singleProduct = await addProduct.findById({ _id: id });
  res.render("user/productdetail", { singleProduct, user, Pet, Brand });
});

const shop = asyncHandler(async (req, res) => {
  const agecategory = req.query.age;
  const animalcategory = req.query.animal;
  const category = req.query.category;
  const brand = req.query.brand;
  const sort = req.query.sort;

  const page = parseInt(req.query.page) || 1;
  const items_per_page = 10;
  const totalproducts = await addProduct.find().countDocuments();
  const mainCategory = await categorySchema.find({});
  const Brand = await brandModel.find();
  const Pet = await animalCategory.find();
  if (category) {
    let product = await addProduct
      .find({ category: category })
      .populate("category")
      .sort({ date: -1 })
      .skip((page - 1) * items_per_page)
      .limit(items_per_page);
    let user = req.user;

    res.render("user/shop", {
      product,
      mainCategory,
      brand,
      items_per_page,
      totalproducts,
      user,
      Pet,
      Brand,
      page,
      hasNextPage: items_per_page * page < totalproducts,
      hasPreviousPage: page > 1,
      PreviousPage: page - 1,
    });
  } else if (brand) {
    let product = await addProduct
      .find({ brand: brand })
      .populate("brand")
      .sort({ date: -1 })
      .skip((page - 1) * items_per_page)
      .limit(items_per_page);
    let user = req.user;

    res.render("user/shop", {
      product,
      brand,
      mainCategory,
      items_per_page,
      totalproducts,
      user,
      Pet,
      Brand,
      page,
      hasNextPage: items_per_page * page < totalproducts,
      hasPreviousPage: page > 1,
      PreviousPage: page - 1,
    });
  } else if (sort == "ascending") {
    let product = await addProduct
      .find({})

      .sort({ price: 1 })
      .skip((page - 1) * items_per_page)
      .limit(items_per_page);
    let user = req.user;

    res.render("user/shop", {
      product,
      brand,
      mainCategory,
      items_per_page,
      totalproducts,
      user,
      page,
      Pet,
      Brand,
      hasNextPage: items_per_page * page < totalproducts,
      hasPreviousPage: page > 1,
      PreviousPage: page - 1,
    });
  } else if (sort == "descending") {
    let product = await addProduct
      .find({})

      .sort({ price: -1 })
      .skip((page - 1) * items_per_page)
      .limit(items_per_page);
    let user = req.user;

    res.render("user/shop", {
      product,
      brand,
      mainCategory,
      items_per_page,
      totalproducts,
      user,
      page,
      Pet,
      Brand,
      hasNextPage: items_per_page * page < totalproducts,
      hasPreviousPage: page > 1,
      PreviousPage: page - 1,
    });
  } else if (sort == "new") {
    let product = await addProduct
      .find({})

      .sort({ dare: -1 })
      .skip((page - 1) * items_per_page)
      .limit(items_per_page);
    let user = req.user;

    res.render("user/shop", {
      product,
      brand,
      mainCategory,
      items_per_page,
      totalproducts,
      user,
      page,
      Pet,
      Brand,
      hasNextPage: items_per_page * page < totalproducts,
      hasPreviousPage: page > 1,
      PreviousPage: page - 1,
    });
  } else {
    let product = await addProduct
      .find({})
      .sort({ date: -1 })
      .skip((page - 1) * items_per_page)
      .limit(items_per_page);
    let user = req.user;

    res.render("user/shop", {
      product,
      mainCategory,
      brand,
      items_per_page,
      totalproducts,
      user,
      page,
      Pet,
      Brand,
      hasNextPage: items_per_page * page < totalproducts,
      hasPreviousPage: page > 1,
      PreviousPage: page - 1,
    });
  }
});

module.exports = {
  home,
  renderRegister,
  renderLogin,
  login,
  logout,
  sendOtp,
  resendOtp,
  verifyOtp,
  profile,
  newAddress,
  manageAddress,
  deleteAddress,
  showProductdetails,
  shop,
  addAddress,
};
