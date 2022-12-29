const mongoose = require("mongoose");

const brandModels = new mongoose.Schema({
  brand: {
    type: String,
    required: true,
  },
});

module.exports = brandSchema = mongoose.model("brand", brandModels);
