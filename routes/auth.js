const router = require("express").Router();
const bcrypt = require("bcrypt");
const path = require("path");
const fs = require("fs");
const Mail = require("../class/varifyMail");
const { userModel, varifyModel } = require("../models/auth");

router.get("/", (req, res) => res.send("authentication api is sending"));

// login api check pass function
const checkPass = async (pass, userData) => {
  const compare = await bcrypt.compare(pass, userData.password);
  if (compare) {
    userData.password = "";
    return { err: false, msg: "SuccessFully Logined", user: userData };
  } else return { err: true, msg: "Please check your password" };
};
//login  api post method
router.post("/login", (req, res) => {
  const emailOrUsername = req.body.identifier;
  const pass = req.body.password;
  userModel.find({ username: emailOrUsername }).exec(async (err, data) => {
    if (err) throw err;
    if (data.length) {
      const x = await checkPass(pass, data[0]);
      res.send(x);
    } else {
      userModel.find({ email: emailOrUsername }).exec(async (err2, data2) => {
        if (err2) throw err2;
        if (data2.length === 1) res.send(await checkPass(pass, data2[0]));
        else res.send({ err: true, msg: "User do not exists." });
      });
    }
  });
});
//update profile pic
router.post("/updateProfilePic/:uid", (req, res) => {
  console.log(req.params.uid);
  let filename = "users/" + Date.now() + "_" + req.params.uid + ".png";
  fs.writeFile("./public/" + filename, req.body.profilePic, "base64", (err) => {
    if (err) throw err;
    userModel.updateOne(
      { _id: req.params.uid },
      { profilePic: filename },
      (err, data) => {
        if (err) throw err;
        console.log("ok");
        res.send({ msg: "ok", profilePic: filename });
      }
    );
  });
});
// update all query
router.post("/updateRestData", (req, res) => {
  let { uid, username, email, bio, city, state, country, pincode } = req.body;
  city = city.toLowerCase();
  state = state.toLowerCase();
  country = country.toLowerCase();
  userModel.updateOne(
    { _id: uid },
    { username, email, city, state, bio, country, pincode },
    (err, data) => {
      if (err) throw err;
      res.send({
        msg: "ok",
        city,
        state,
        bio,
        country,
        pincode,
        username,
        email,
      });
    }
  );
});
//update password
router.post("/updatePassword", async (req, res) => {
  const { uid, currentPassword, newPassword } = req.body;
  userModel.findById(uid, async (err, data) => {
    if (err) throw err;
    if (data) {
      const compare = await bcrypt.compare(currentPassword, data.password);
      if (compare) {
        const hashNew = await bcrypt.hash(newPassword, 5);
        userModel.updateOne(
          { _id: uid },
          { password: hashNew },
          (err2, data2) => {
            if (err2) throw err2;
            res.send({ msg: "ok", res: "Your password is updated now" });
          }
        );
      } else res.send({ msg: "current password is not provided correctly" });
    } else res.send({ msg: "user not exists" });
  });
});
// signup api post method
router.post("/signup", async (req, res) => {
  let { username, email, mobile, password, city, state, country, pincode } =
    req.body;
  city = city.toLowerCase();
  state = state.toLowerCase();
  country = country.toLowerCase();
  const newPass = await bcrypt.hash(password, 5);
  const newUser = {
    username: username,
    email: email,
    mobile: mobile,
    password: newPass,
    city: city,
    state: state,
    country: country,
    pincode: pincode,
    emailVarify: false,
  };

  userModel.create(newUser, (err, data) => {
    if (err) throw err;
    data.password = "";
    let otp = Math.floor(Math.random() * 900001) + 100000;
    varifyModel.create(
      { uid: data._id, email: email, otp: otp, time: Date.now() },
      async (err2, data2) => {
        if (err2) throw err2;
        let html = `<p>
                You are registered to help hand. One last step to varify you email.
                OTP is given below.
                <center>
                  <h2>${otp}</h2>
                </center>
             </p>`;
        let mail = new Mail(email, "Varify your email", html);
        try {
          let d = await mail.sendEmail();
          res.send({ msg: "ok", data: data });
        } catch (error) {
          res.send({ msg: "not ok", data: error });
        }
      }
    );
  });
});

//username exists
router.get("/usernameExists/:username", (req, res) => {
  userModel.find({ username: req.params.username }).exec((err, data) => {
    if (err) throw err;
    console.log(data, "yes");
    if (data.length)
      res.send({ err: true, msg: "username is already exinsting!!!!" });
    else res.send({ err: false, msg: "username is unique" });
  });
});
//email exists
router.get("/emailExists/:email", (req, res) => {
  const email = req.params.email.toLowerCase();
  userModel.find({ email: req.params.email }).exec((err, data) => {
    if (err) throw err;
    if (data.length)
      res.send({ err: true, msg: "email is already exinsting!!!!" });
    else res.send({ err: false, msg: "email is unique" });
  });
});

//user details exists
router.get("/getUser/:identifier", (req, res) => {
  userModel
    .find({
      $or: [
        { email: req.params.identifier },
        { username: req.params.identifier },
      ],
    })
    .exec((err, data) => {
      if (err) throw err;
      const {
        _id,
        name,
        bio,
        mobile,
        profilePic,
        username,
        email,
        city,
        state,
        country,
        pincode,
      } = data[0];
      const send = {
        _id,
        name,
        bio,
        mobile,
        profilePic,
        username,
        email,
        city,
        state,
        country,
        pincode,
      };
      if (data.length) res.send({ err: false, send: send });
      else res.send({ err: true, msg: "user not exists" });
    });
});

//user details exists
router.get("/getUserById/:id", (req, res) => {
  if (req.params.id === "undefined" || req.params.id === "null") {
    res.send({ err: true, msg: "user not exists" });
  } else {
    userModel.find({ _id: req.params.id }).exec((err, data) => {
      if (err) throw err;
      const {
        _id,
        name,
        username,
        email,
        mobile,
        city,
        bio,
        state,
        country,
        pincode,
        profilePic,
      } = data[0];
      const send = {
        _id,
        name,
        username,
        email,
        mobile,
        bio,
        city,
        state,
        country,
        pincode,
        profilePic,
      };
      if (data.length) res.send({ err: false, send: send });
      else res.send({ err: true, msg: "user not exists" });
    });
  }
});
module.exports = router;
