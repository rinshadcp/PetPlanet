const mongoose = require("mongoose");



const addProductSchema = new mongoose.Schema({
  category:{
    type:String,
    required:true
  },
  subCategory:{
    type: String,
    required:true
  },  
  name: {
    type: String,
    required: true
  },
  brand: {
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
    type: String,
    required: true

  },
  status: {  
    type:String,
    default:"listed"
  },
  
});

module.exports = addProduct = mongoose.model("product", addProductSchema);