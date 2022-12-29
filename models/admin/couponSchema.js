const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    code:{
        type:String,
        required:true
    },
    discount:{
        type:Number,
        required:true
    }
});

module.exports  = mongoose.model("coupon", couponSchema);
