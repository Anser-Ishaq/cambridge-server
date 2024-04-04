const mongoose = require("mongoose");
const portalSchema = new mongoose.Schema({
  passCountry: String,
  passNumber:{
    type:String,
   },
  passSeries:{
    type:String,
  },
  radio: String,
  phoneNumber: {
    type:String,
  },
  famName: {
    type:String,

    reqiured:true
   },
  fName: {
    type:String,

    reqiured:true
   },
  pName: {
    type:String,
    required:true,
    reqiured:true
   },
  radio1: {
    type:String,
   },
  birthday: {
    type:String,
   },
  file1: {
    type:String,
    required:true,
    reqiured:true
   },
  file2: {
    type:String,
   },
  file3: {
    type:String,
   },
  file4: {
    type:String,
   },
  file5: {
    type:String,
   },
  fatherFname: {
    type:String,
   },
  fatherLname: {
    type:String,
   },
  motherFname: {
    type:String,
   },
  motherLname: {
    type:String,
   },
  diploma1: {
    type:String,
   },
  diploma2: {
    type:String,
   },
  highschool: {
    type:String,
   },
  countrySchool: {
    type:String,
   },
  address: {
    type:String,
   },
  dateOfAdm: {
    type:String,
   },
  dateOfComp: {
    type:String,
   },
  bool1: {
    type:String,
    required:true,
    reqiured:true
   },
  bool2: {
    type:String,
   },
  bool3: {
    type:String,
   },
  bool4: {
    type:String,
    required:true,
    reqiured:true
   },
  bool5: {
    type:String,
   },
  bool6: {
    type:String,
    required:true,
    reqiured:true
   },
  file6: {
    type:String,
    required:true,
    reqiured:true
   },
  file7: {
    type:String,
   },
  file8: {
    type:String,
   },
  file9: {
    type:String,
   },
  file10: {
    type:String,
   },
  file11: {
    type:String,
   },
  file12: {
    type:String,
   },
  ans1: {
    type:String,
   },
  ans2: {
    type:String,
   },
  ans3: {
    type:String,
   },
  ans4: {
    type:String,
   },
  ans5: {
    type:String,
   },
  ans6: {
    type:String,
   },
  ans7: {
    type:String,
   },
  opt1: {
    type:String,
   },
  name: {
    type:String,
   },
  data:{
    type:String,
   },
});
module.exports = mongoose.model("Portal-Info", portalSchema);
