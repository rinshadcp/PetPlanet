const { response } = require("express");
const addProduct = require("../../models/admin/addProduct");
// const couponSchema = require("../../models/admin/couponSchema");
const cartModel = require("../../models/user/cartModel");
const {isLoggedIn}=require('../../middlewrares/authentication');
const userModel = require("../../models/user/userModel");

module.exports = {
  // cart showing page

  cart: async (req, res) => {
    let userId = req.user._id;

    let cart = await cartModel
      .findOne({ userId: userId })
      .populate("products.productId");

    if (cart) {
      let products = cart.products;
      let cartTotal = cart.cartTotal;
      let discount = cart.offer.discount;

      res.render("user/cart", { products, cartTotal, discount,login:true });
    } else {
      res.render("user/cart", { products: [] });
    }
  },

  // add to cart

  addToCart: async (req, res) => {
    let user = req.user;
    let userId = user._id;
    let productId = req.params.id;
    let product = await addProduct.findById({ _id: productId });
    let quantity = req.body.quantity;

    let total = product.price * quantity;

    let cart = await cartModel.findOne({ userId: userId });

    if (cart) {
      // checking that product already exist in cart
      let exist = await cartModel.findOne({
        userId,
        "products.productId": productId,
      });
      if (exist != null) {
        await cartModel.findOneAndUpdate(
          { userId, "products.productId": productId },
          {
            $inc: {
              "products.$.quantity": 1,
              "products.$.total": total,
              cartTotal: total,
            },
          }
        );
      } else {
        await cartModel.findOneAndUpdate(
          { userId },
          {
            $push: { products: { productId, quantity, total } },
            $inc: { cartTotal: total },
          }
        );
      }
    } else {
      const newCart = new cartModel({
        userId: userId,
        products: [{ productId, quantity, total }],
        cartTotal: total,
      });
      newCart.save();
    }
    res.redirect("/cart");
  },

  //remove cart product

  removeCartProduct: async (req, res) => {
    const productId = req.params.id;
    let user= req.user;
    let userId = user._id;
    let total = parseInt(req.params.total);

    const cartM = await cartModel.findOne({ userId: userId });
    console.log(cartM);
    let product = addProduct.findById(productId);
    if (cartM.products.length == 1) {
      await cartModel
        .findOneAndUpdate(
          { userId: userId },
          {
            $pull: { products: { productId } },

            $set: {
              "offer.discount": 0,
              "offer.couponId": null,

              cartTotal: 0,
            },
          }
        )
        .then(() => {
          res.redirect("/cart");
        });
    } else {
      await cartModel
        .findOneAndUpdate(
          { userId: userId },
          {
            $pull: { products: { productId } },

            $inc: {
              cartTotal: -total,
            },
          }
        )
        .then(() => {
          res.redirect("/cart");
        });
    }
  },

  //cart quantity increment

  QtyIncrement: async (req, res) => {
    let user= req.user;
    let userId = user._id;

    let productId = req.body.productId;
    console.log(productId);
    // let price = parseInt(req.body.price);
    let price = req.body.price;
    let product = await addProduct.findById(productId);

    let cart = await cartModel
      .findOneAndUpdate(
        { userId: userId, "products.productId": productId },
        {
          $inc: {
            "products.$.quantity": 1,
            "products.$.total": price,
            cartTotal: product.price,
          },
        }
      )
      .then(() => {
        // res.redirect("/login/cart");
        res.json(response);
      });
  },

  //cart quantity decrement

  QtyDecrement: async (req, res) => {
    let userId = req.user._id;

    let productId = req.body.productId;
    let price = req.body.price;
    let product = await addProduct.findById(productId);
    let index;
    const cartM = await cartModel
      .findOne({ userId: userId })
      .populate("products");
    for (let pro of cartM.products) {
      if (pro.productId == productId) {
        index = cartM.products.indexOf(pro);
        break;
      }
    }
    const quantity = cartM.products[index].quantity;
    console.log(quantity);
    if (quantity > 1) {
      let cart = await cartModel
        .findOneAndUpdate(
          { userId: userId, "products.productId": productId },
          {
            $inc: {
              "products.$.quantity": -1,
              "products.$.total": -price,
              cartTotal: -product.price,
            },
          }
        )
        .then(() => {
          res.json(response);
        });
    }
  }

//   //CHECK COUPON CODE 

//   checkCoupen: async (req, res) => {
//     const userId = req.session.user._id;
//     const couponCode = req.body.code;
//     const cartTotal = req.body.cartTotal;
//     console.log(couponCode);
//     const confirmCode = await couponSchema.findOne({ code: couponCode });
//     console.log(confirmCode);
//     if (confirmCode) {
//       const existOffer = await cartModel.findOne({ userId: userId });
//       if (!existOffer.offer.couponId) {
//         discountCoupen = Math.round((cartTotal * confirmCode.discount) / 100);
//         console.log(discountCoupen);
//         const cart = await cartModel.findOneAndUpdate(
//           { userId: userId },
//           {
//             $set: {
//               offer: { couponId: confirmCode._id, discount: discountCoupen },
//             },
//             $inc: { cartTotal: -discountCoupen },
//           },
//           { multi: true }
//         );
//         res.json({ apply: true });
//       } else {
//         res.json({ exist: true });
//       }
//     } else {
//       res.json({ apply: false });
//     }
//   },
};
