const User = require("../../models/user/userModel");
const addressSchema = require("../../models/user/addressSchema");

const addProduct = require("../../models/admin/addProduct");
const { isLoggedIn ,checkReturnTo} = require("../../middlewrares/authentication");

module.exports.home = async (req, res) => {
  const products = await addProduct.find();
  let user = req.user;
  if (user) {
    res.render("user/index", { products, login: true });
  } else {
    res.render("user/index", { products, login: false });
  }
};
module.exports.renderRegister = (req, res) => {
  res.render("user/signup");
};

module.exports.register = async (req, res, next) => {
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
};
module.exports.renderLogin = (req, res) => {
  res.render("user/login");
};

module.exports.login = (req, res) => {
  req.flash("success", "welcome back!");
  const redirectUrl = req.session.returnTo || "/";
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
  // req.logout();
  req.session.destroy();
  // req.flash('success', "Goodbye!");
  res.redirect("/login");
};
//profile page

module.exports.profile = async (req, res) => {
    let userId = req.user._id;
    let user=req.user;

    // console.log(userId);
    
    
    let address = await addressSchema.findOne({ userId});
    
    
    if (address != null) {
        if (address.address.length > 0) {
            let num = address.address.length - 1;
            address = address.address[num];
        } else address = [];
    } else {
        address = [];
    }
    
    
    res.render("user/profile", { address, user ,login:true});
};
  // add address

  module.exports.addAddress = async (req, res) => {
    res.render("user/addAddress",{login:true});
  }
  module.exports.manageAddress = async (req, res) => {
    let userId = req.user._id;

    let address = await addressSchema.findOne({ userId: userId });

    if (address != null) {
      if (address.address.length > 0) {
        address = address.address;
      } else address = [];
    } else {
      address = [];
    }

    res.render("user/manageAddress", { address,login:true, index: 1 });
  }
  module.exports.deleteAddress = async (req, res) => {
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
  }
  module.exports.newAddress = async (req, res) => {
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
  };
