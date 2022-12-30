const mongoose = require("mongoose");

const addProductSchema = new mongoose.Schema({
  animal: {
    type: String,
    required: true,
    ref: "animalCategory",
  },
  age: {
    type: String,
    required: true,
    ref: "ageCategory",
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "category",
    required: true,
  },
  subCategory: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "brand",
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: [String],
    required: true,
  },
  status: {
    type: String,
    default: "listed",
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  stock: {
    type: String,
    default: "Available",
  },
});

module.exports = addProduct = mongoose.model("product", addProductSchema);
