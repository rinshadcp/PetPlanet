const mongoose = require("mongoose");

const category = new mongoose.Schema({
  category: {
    type: String,
    required: true,
  },
});

module.exports = categorySchema = mongoose.model("category", category);
