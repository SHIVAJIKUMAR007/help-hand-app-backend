const { varifyModel, userModel } = require("../models/auth");

const router = require("express").Router();

router.post("/varifyotp", (req, res) => {
  const { uid, email, otp } = req.body;
  varifyModel.find({ uid: uid }).exec((err, data) => {
    if (err) throw err;
    data = data[0];
    if (otp == data.otp) {
      userModel.findByIdAndUpdate(uid, { emailVarify: true }, (err2, data2) => {
        data2.emailVarify = true;
        res.send({
          err: false,
          res: "Correct OTP, Your email is varified now.",
          user: data2,
        });
      });
    } else {
      res.send({ err: true, res: "Wrong OTP, User is not varified yet." });
    }
  });
});


module.exports = router;
