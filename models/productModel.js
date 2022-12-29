const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    pet: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },
    subCategory: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    ageGroup: {
      type: String,
      enum: ["Kitten", "Puppy", "Adult"],
    },

    quantity: {
      type: Number,
      required: true,
    },
    sold: {
      type: Number,
      default: 0,
    },
    images: [
      {
        public_id: String,
        url: String,
      },
    ],
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
  },
  { timestamps: true }
);

//Export the model
module.exports = mongoose.model("Product", productSchema);
