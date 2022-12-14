const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "userdata",
  },
  productIds: {
    type: [mongoose.Schema.Types.ObjectId],
    required: true,
    ref: "product",
  },
});

module.exports = wishlist = mongoose.model("Wishlist", wishlistSchema);