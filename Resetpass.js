const bcrypt = require("bcrypt");
const user = require("./db/User")
exports.resetPassword = async(req, res)=> {
    const { _id } = req.body;
    console.log("req.body",req.body,req.body.password)
    try {
      const hasedpassword = bcrypt.hashSync(req.body.password, 10);
      const data = await user.findOneAndUpdate(
        { _id: _id },
        { $set: { password: hasedpassword } },
        {
          new: true,
          useFindAndModify: false,
        }
      );

    // const data=await Customer.findOne({_id:_id})
  
      console.log("dataReset", data);
      if (data) {
        res.status(200).json({
          message: "Password Changed Successfully...",
          data,
        });
      } else {
        res.status(400).json({
          message: "Password Changed Failed...",
        });
      }
    } catch (error) {
      res.status(400).json({
        Error_Message: error,
      });
    }
  };