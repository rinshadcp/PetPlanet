const mongoose = require("mongoose");

const category = new mongoose.Schema({
  age: {
    type: String,
    required: true,
  },
});

module.exports = categorySchema = mongoose.model("ageCategory", category);