const wishlistSchema = require("../../models/user/wishlistSchema");
const brandModel = require("../../models/admin/brandModel");
const animalCategory = require("../../models/admin/animalCategorySchema");
module.exports = {
  //wishlist page

  wishlist: async (req, res) => {
    let user = req.user;
    let userId = user._id;
    let Brand = await brandModel.find();
    let Pet = await animalCategory.find();
    return new Promise(async (resolve, reject) => {
      let list = await wishlistSchema
        .findOne({ userId: userId })
        .populate("productIds")
        .then((list) => {
          if (list) {
            resolve(list.productIds);
          } else {
            resolve();
          }
        });
    }).then((list) => {
      if (list) {
        res.render("user/wishlist", { Pet, Brand, list, user });
      } else {
        res.render("user/wishlist", {
          list: [],
          user,
          Pet,
          Brand,
        });
      }
    });
  },

  // ADD TO WISHLIST
  addToWishlist: async (req, res, next) => {
    let productId = req.body.id;
    console.log(productId);
    let user = req.user;
    let user_id = user._id;

    let wishlist = await wishlistSchema.findOne({ userId: user_id });
    if (wishlist) {
      await wishlistSchema.findOneAndUpdate(
        { userId: user_id },
        { $addToSet: { productIds: productId } }
      );
      res.json({ success: true });
    } else {
      const wish = new wishlistSchema({
        userId: user_id,
        productIds: [productId],
      });
      wish.save().then(() => {
        console.log(wish);
      });
      res.json({ success: true });
    }
  },
  //remove wishlist product

  removeWishlistProduct: async (req, res) => {
    const id = req.params.id;

    let userId = req.user._id;
    console.log(userId, id);
    await wishlistSchema
      .findOneAndUpdate({ userId }, { $pull: { productIds: id } })
      .then(() => {
        res.redirect("/wishlist");
      });
  },

  //Add item into cart

  moveToCart: async (req, res) => {
    let userId = req.user._id;
    let productId = req.params.id;
    let product = await addProduct.findById({ _id: productId });
    let quantity = 1;

    let total = product.price * quantity;

    let cart = await cartModel.findOne({ userId: userId });
    let wishlist = await wishlistSchema.findOne({ userId: userId });
    console.log("wishlist " + wishlist);

    if (cart) {
      // checking that product already exist in cart
      let exist = await cartModel.findOne({
        userId,
        "products.productId": productId,
      });
      if (exist != null) {
        await cartModel
          .findOneAndUpdate(
            { userId, "products.productId": productId },
            {
              $inc: {
                "products.$.quantity": 1,
                "products.$.total": total,
                cartTotal: total,
              },
            }
          )
          .then(async () => {
            await wishlistSchema.findOneAndUpdate(
              { userId: userId },
              { $pull: { productIds: productId } }
            );
          });
      } else {
        await cartModel
          .findOneAndUpdate(
            { userId },
            {
              $push: { products: { productId, quantity, total } },
              $inc: { cartTotal: total },
            }
          )
          .then(async () => {
            await wishlistSchema.findOneAndUpdate(
              { userId: userId },
              { $pull: { productIds: productId } }
            );
          });
      }
    } else {
      const newCart = new cartModel({
        userId: userId,
        products: [{ productId, quantity, total }],
        cartTotal: total,
      });
      newCart.save().then(async () => {
        await wishlistSchema.findOneAndUpdate(
          { userId: userId },
          { $pull: { productIds: productId } }
        );
      });
    }
    res.redirect("/");
  },
};
