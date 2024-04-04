const mongoose = require("mongoose");
const validator = require("validator");
const AdminUserSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
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
module.exports = mongoose.model("Admin-Info", AdminUserSchema);
