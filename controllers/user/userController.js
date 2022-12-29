const User = require("../../models/user/userModel");
const asyncHandler = require("express-async-handler");
const addressSchema = require("../../models/user/addressSchema");
const flash = require("connect-flash");
const addProduct = require("../../models/admin/addProduct");
const {
  isLoggedIn,
  checkReturnTo,
} = require("../../middlewrares/authentication");

const home = asyncHandler(async (req, res) => {
  const products = await addProduct.find();
  let user = req.user;
  if (user) {
    res.render("user/index", { products, user, login: true });
  } else {
    res.render("user/index", { products, login: false });
  }
});
const renderRegister = (req, res) => {
  res.render("user/signup");
};

const register = asyncHandler(async (req, res, next) => {
  try {
    const { phone, email, username, password } = req.body;
    const user = new User({ email, username, phone });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to home!");
      res.redirect("/");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
});
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

  res.render("user/profile", { address, user, login: true, home: false });
});
// add address

const addAddress = async (req, res) => {
  res.render("user/addAddress", { login: true });
};
const manageAddress = asyncHandler(async (req, res) => {
  let userId = req.user._id;

  let address = await addressSchema.findOne({ userId: userId });

  if (address != null) {
    if (address.address.length > 0) {
      address = address.address;
    } else address = [];
  } else {
    address = [];
  }

  res.render("user/manageAddress", { address, login: true, index: 1 });
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
  const singleProduct = await addProduct.findById({ _id: id });
  res.render("user/productdetail", { singleProduct });
});

const shop = asyncHandler(async (req, res) => {
  const agecategory = req.query.category;
  const brand = req.query.brand;
  const sort = req.query.sort;

  const page = parseInt(req.query.page) || 1;
  const items_per_page = 10;
  const totalproducts = await addProduct.find().countDocuments();
  const mainCategory = await categorySchema.find({});

  if (category) {
    let product = await addProduct
      .find({ category: category })
      .populate("category")
      .sort({ date: -1 })
      .skip((page - 1) * items_per_page)
      .limit(items_per_page);

    res.render("user/shop", {
      product,
      mainCategory,
      brands,
      items_per_page,
      totalproducts,
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

    res.render("user/shop", {
      product,
      brands,
      mainCategory,
      items_per_page,
      totalproducts,
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

    res.render("user/shop", {
      product,
      brands,
      mainCategory,
      items_per_page,
      totalproducts,
      page,
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

    res.render("user/shop", {
      product,
      brands,
      mainCategory,
      items_per_page,
      totalproducts,
      page,
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

    res.render("user/shop", {
      product,
      brands,
      mainCategory,
      items_per_page,
      totalproducts,
      page,
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
    res.render("user/shop", {
      product,
      mainCategory,
      brands,
      items_per_page,
      totalproducts,
      page,
      hasNextPage: items_per_page * page < totalproducts,
      hasPreviousPage: page > 1,
      PreviousPage: page - 1,
    });
  }
});

module.exports = {
  home,
  renderRegister,
  register,
  renderLogin,
  login,
  logout,
  profile,
  newAddress,
  manageAddress,
  deleteAddress,
  showProductdetails,
  shop,
  addAddress,
};
