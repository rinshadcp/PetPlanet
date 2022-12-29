const mongoose = require("mongoose");

const brand = new mongoose.Schema({
  brand: {
    type: String,
    required: true,
  },
});

module.exports = brandSchema = mongoose.model("brand", brand);
