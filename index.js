const express = require("express");
const app = express();
const mongoose = require("mongoose");
const MongoClient = require("mongodb").MongoClient;
const bodyParser = require("body-parser");
global.bodyParser = require("body-parser");
const User = require("./db/User");
const adminUser = require("./db/AdminUser");
const Portaluser = require("./db/Portaluser");
const Config = require("./db/config");
const cors = require("cors");
const bcrypt = require("bcrypt");
const randomstring = require("randomstring");
const nodemailer = require("nodemailer");
const { sgNodemailer } = require("./Nodemailer");
const { adminNodemailer } = require("./Adminmailer");
const sgMail = require("@sendgrid/mail");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const url = require("url");
const http = require("http");
const multer = require("multer");
const path = require("path");
app.use("/file1", express.static("./Images"));
// const sendResetMail = async (name, token, email) => {
//   console.log("where to send mail============", email);
//   console.log("where to send mailer name======", name);
//   console.log("where to send mailer token====", token);
//   try {
//     const transporter = nodemailer.createTransport({
//         host: "smtp.gmail.com",
//         secure: false,
//         requireTLS: true,
//         auth: {
//           user: "testing006900@gmail.com",
//           pass: "afxtmhcgzrxdkntm",
//         },
//         tls: {
//           ciphers: "SSLv3",
//           rejectUnauthorized: false,
//         },
//       });
//     // console.log("transporter finished",transporter)
//     const sgGridApi =
//       "ZaaYQRRVQg-RoC-_Rp0V9A.kqS28Df5NIiaMGEKEiy_wc6B_aCBk_fwroJf4SSb45QCopied!";
//     sgMail.setApiKey(sgGridApi);
//     sgMail.setApiKey(process.env.SENDGRID_API_KEY);
//     const mailOptions = {
//       from: "testing006900@gmail.com",
//       to: email,
//       port: 587,
//       subject: "For Reset Password",
//       html:
//         "<h1> hii" +
//           "  " +
//           name +
//           "click on the link below to reset your <br/>" +
//           " <a hrerf='http://127.0.0.1:5173/reset-password?token=" +
//           token >
//         "</a> </h1>",
//       auth: {
//         type: "Bearer",
//         email: email,
//         // password: "viwugsvdyjjhlksg",
//       },
//     };
//     // const sgmail = sgMail.send(mailOptions);
//     // console.log("sgmail is send grid", sgmail);
//     console.log("Sending mail options=========", mailOptions);
//     // console.log(Object.assign({}, mailOptions));
//     transporter.sendMail(mailOptions, function (error, info) {
//       if (error) {
//         // console.log(error);
//         console.log("main error ================", error);
//       } else {
//         console.log("mail sent successfully========", info.response.toObject());
//       }
//     });
//   } catch (error) {
//     console.log("error", error);
//   }
// };

app.use(express.json());
app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: "50mb",
    parameterLimit: 100000,
  })
);
app.use(
  bodyParser.json({
    limit: "50mb",
    parameterLimit: 100000,
  })
);

// ! ******************************************signup API*****************************

app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  let user = new User(req.body);
  try {
    let salt = await bcrypt.genSalt(10);
    let hashedPassword = await bcrypt.hash(password, salt);
    console.log(hashedPassword);
    let oldUser = await User.findOne({ email });
    if (oldUser) {
      return res.send({ status: false, error: "User Exists try again" });
    } else {
      await User.create({
        name,
        email,
        password: hashedPassword,
      });
      res.send({ status: true, error: "hurray" });
    }
    // res.send(result);
  } catch (error) {
    res.json({ status: true, status: "error" });
  }
});

// ! ******************************************login API********************************

app.post("/login", async (req, res) => {
  let { email, password } = req.body;
  let user = await User.findOne({ email });
  console.log("user is======", user);
  if (user) {
    let passwordMatch = await bcrypt.compare(password, user.password);
    console.log("matched password", passwordMatch);
    if (passwordMatch) {
      return res.json({ status: true, error: "User found" });
    }
    // else {
    //   return res.json({
    //     status: false,
    //     error: "User not found. Please SIGNUP again",
    //   });
    // }
  } else {
    return res.json({ status: false, error: "User not found" });
  }
});

// ! ******************************************forget password API************************

app.post("/forget-password", async (req, res) => {
  let email = req.body.email;
  let Newuser = await User.findOne({ email });
  if (!email || !Newuser) {
    return res.json({ status: false, error: "Please enter valid email" });
  } else {
    const randomToken = randomstring.generate();
    console.log("Random string=====", randomToken);
    console.log("**********************************************");
    const updateToken = await User.updateOne(
      { email },
      { $set: { token: randomToken } }
    );
    sgNodemailer(email, randomToken, Newuser._id);
    return res.json({
      status: true,
      error: "Check your mail or spam section to reset pass",
    });
  }
});

// ! ******************************************Reset API********************************

app.put("/reset-password", async (req, res) => {
  const id = req.body.id;
  console.log("req.body.id", id);
  try {
    const hasedpassword = bcrypt.hashSync(req.body.pass, 10);
    console.log("hashedpassword", hasedpassword);
    const data = await User.findOneAndUpdate(
      { _id: id },
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
});

// ! ******************************************Portal API********************************

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./Images");
  },
  filename: function (req, file, cb) {
    // cb(null, Date.now() + path.extname(file.originalname));
    return cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage: storage });
const uploadFields = upload.fields([
  { name: "file1", maxCount: 1 },
  { name: "file2", maxCount: 1 },
  { name: "file3", maxCount: 1 },
  { name: "file4", maxCount: 1 },
  { name: "file5", maxCount: 1 },
  { name: "file6", maxCount: 1 },
  { name: "file7", maxCount: 1 },
  { name: "file8", maxCount: 1 },
  { name: "file9", maxCount: 1 },
  { name: "file10", maxCount: 1 },
  { name: "file11", maxCount: 1 },
  { name: "file12", maxCount: 1 },
]);

// const uploadFields = upload.single("file1")

app.post("/portal", uploadFields, async (req, res) => {
  const images = req.files;

  

  for (const [name, files] of Object.entries(images)) {
    const file = files[0];
    const name = file.originalname;
    const link = `http://localhost:9000/images/${name}`;
    // console.log(link);
    const data = file.buffer;
    // console.log(data)

    const image = new Portaluser({ name, link });
    // await image.save();
    const imageId = image._id;
    console.log("imageId", imageId);
  }
  const {
    passCountry,
    passNumber,
    passSeries,
    radio,
    phoneNumber,
    famName,
    fName,
    pName,
    radio1,
    birthday,
    file1,
    file2,
    file3,
    file4,
    file5,
    fatherFname,
    fatherLname,
    motherFname,
    motherLname,
    diploma1,
    diploma2,
    highschool,
    countrySchool,
    address,
    dateOfAdm,
    dateOfComp,
    bool1,
    bool2,
    bool3,
    bool4,
    bool5,
    bool6,
    file6,
    file7,
    file8,
    file9,
    file10,
    file11,
    file12,
    ans1,
    ans2,
    ans3,
    ans4,
    ans5,
    ans6,
    ans7,
    op1,
    name,
    data,
  } = req.body;

  const data1 = new Portaluser({
    passCountry,
    passNumber,
    passSeries,
    radio,
    phoneNumber,
    famName,
    fName,
    pName,
    radio1,
    birthday,
    file1,
    file2: `http://localhost:9000/file1/${images.file2[0].filename}`,
    file3: `http://localhost:9000/file1/${images.file3[0].filename}`,
    file4: `http://localhost:9000/file1/${images.file4[0].filename}`,
    file5: `http://localhost:9000/file1/${images.file5[0].filename}`,
    fatherFname,
    fatherLname,
    motherFname,
    motherLname,
    diploma1,
    diploma2,
    highschool,
    countrySchool,
    address,
    dateOfAdm,
    dateOfComp,
    bool1,
    bool2,
    bool3,
    bool4,
    bool5,
    bool6,
    file6: `http://localhost:9000/file1/${images.file6[0].filename}`,
    file7: `http://localhost:9000/file1/${images.file7[0].filename}`,
    file8: `http://localhost:9000/file1/${images.file8[0].filename}`,
    file9: `http://localhost:9000/file1/${images.file9[0].filename}`,
    file10: `http://localhost:9000/file1/${images.file10[0].filename}`,
    file11: `http://localhost:9000/file1/${images.file11[0].filename}`,
    file12: `http://localhost:9000/file1/${images.file12[0].filename}`,
    ans1,
    ans2,
    ans3,
    ans4,
    ans5,
    ans6,
    ans7,
    op1,
    name,
    data,
    file1: `http://localhost:9000/file1/${images.file1[0].filename}`,
  });

  if (!data1) {
    console.log("error is something req");
  } else {
    console.log("there is something req");
  }

  console.log("data", data1);
  const val = await data1.save();
  res.json(val);
});

// ! ***********************************************************************************************

app.get("/admin", (req, res) => {
  Portaluser.find((err, data) => {
    if (err) {
      console.error(err);
      return res.sendStatus(500);
    } else {
      res.send(data);
    }
  });
});

// ! *********************Admin signup*****************

app.post("/admin-signup", async (req, res) => {
  const { name, email, password } = req.body;
  let adminuser = new adminUser(req.body);
  console.log("admin user ====", adminuser);
  try {
    let salt = await bcrypt.genSalt(10);
    let hashedPassword = await bcrypt.hash(password, salt);
    console.log(hashedPassword);
    let oldUser = await adminUser.findOne({ email });
    console.log("old user ====", oldUser);
    if (oldUser) {
      return res.send({ status: false, error: "User Exists try again" });
    } else {
      await adminUser.create({
        name,
        email,
        password: hashedPassword,
      });
      res.send({ status: true, error: "hurray" });
    }
    // res.send(result);
  } catch (error) {
    res.json({ status: true, status: "error" });
  }
});

// ! *********************Admin login*****************

app.post("/admin-login", async (req, res) => {
  let { email, password } = req.body;
  let user = await adminUser.findOne({ email });
  console.log("user is======", user);
  if (user) {
    let passwordMatch = await bcrypt.compare(password, user.password);
    console.log("matched password", passwordMatch);
    if (passwordMatch) {
      return res.json({ status: true, error: "User found" });
    }
  } else {
    return res.json({ status: false, error: "User not found" });
  }
});

// ! *********************admin forget password*****************
app.post("/admin-forget-password", async (req, res) => {
  let email = req.body.email;
  let Newuser = await adminUser.findOne({ email });
  if (!email || !Newuser) {
    return res.json({ status: false, error: "Please enter valid email" });
  } else {
    const randomToken = randomstring.generate();
    console.log("Random string=====", randomToken);
    console.log("**********************************************");
    const updateToken = await adminUser.updateOne(
      { email },
      { $set: { token: randomToken } }
    );
    adminNodemailer(email, randomToken, Newuser._id);
    return res.json({
      status: true,
      error: "Check your mail or spam section to reset pass",
    });
  }
});

// ! *********************admin reset password*****************

app.put("/admin-reset-password", async (req, res) => {
  const id = req.body.id;
  console.log("req.body.id", id);
  try {
    const hasedpassword = bcrypt.hashSync(req.body.pass, 10);
    console.log("hashedpassword", hasedpassword);
    const data = await adminUser.findOneAndUpdate(
      { _id: id },
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
});

app.listen(9000);
