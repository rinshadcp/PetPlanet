const mongoose = require("mongoose");

const category = new mongoose.Schema({
  animal: {
    type: String,
    required: true,
  },
});

module.exports = categorySchema = mongoose.model("animalCategory", category);