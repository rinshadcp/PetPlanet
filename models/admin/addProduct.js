const mongoose = require("mongoose");

const addProductSchema = new mongoose.Schema({
  animal:{
    type:String,
    required:true,
    ref:'animalCategory'
  },
  age:{
    type: String,
    required:true,
    ref:'ageCategory'
  },  
  name: {
    type: String,
    required: true
  },
  
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  image:{
    type: [String],
    required: true

  },
  status: {  
    type:String,
    default:"listed"
  },
  
});

module.exports = addProduct = mongoose.model("product", addProductSchema);