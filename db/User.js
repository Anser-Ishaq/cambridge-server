const mongoose = require("mongoose");
const validator = require("validator");
const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    // required: true,
    // unique: true,
    // index: true,
    // sparse: true,
    // validate(value) {
    //   if (!validator.isEmail(value)) {
    //     throw new Error("Email is INVALID");
    //   }
    // },
  },
  password: String,
  token:{
    type:String,
    default:""
  },
  id:{
    type:String,
    unique:true,
  }
 
});
module.exports = mongoose.model("Users-Info", userSchema);
