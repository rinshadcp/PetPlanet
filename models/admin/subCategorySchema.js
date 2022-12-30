const mongoose = require("mongoose");

const subCategorySchema = mongoose.Schema({
  category_id: {
    type: mongoose.Schema.Types.ObjectId,

    ref: "category",
  },
  subCategory: {
    type: String,
    required: true,
  },

  image: {
    type: [String],
    required: true,
  },
});

module.exports = mongoose.model("subCategory", subCategorySchema);
