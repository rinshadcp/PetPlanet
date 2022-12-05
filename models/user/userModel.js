const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new Schema({
  usernaname: {
    type: String,
  },
  phone: {
    type: Number,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isVarified: {
    type: Boolean,
  },
  status: {
    type: String,
    default: "unblocked",
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  type: {
    type: String,
    default: "user",
  }
});
  


UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
