const router = require("express").Router();
const e = require("express");
const { provideModel } = require("../models/provide");
const { requestModel } = require("../models/request");

router.post("/helpInLocal", (req, res) => {
  const { pincode, city, state, uid } = req.body;
  provideModel.find({ state: state }).exec((err, data) => {
    if (err) throw err;
    data = data
      .filter((x) => x.providerId !== uid)
      .sort((a, b) => {
        if (a.pincode === pincode && b.pincode === pincode) return true;
        if (a.pincode === pincode && b.pincode !== pincode) {
          return true;
        } else if (a.pincode !== pincode && b.pincode === pincode) {
          return false;
        } else {
          if (a.city === city && b.city === city) return true;
          if (a.city === city && b.city !== city) {
            return true;
          } else if (a.city !== city && b.city === city) {
            return false;
          } else {
            return true;
          }
        }
      });
    res.send(data);
  });
});

router.post("/giveHelpInLocal", (req, res) => {
  const { pincode, city, state, uid } = req.body;

  requestModel.find({ state: state }).exec((err, data) => {
    if (err) throw err;
    data = data
      .filter((x) => x.requesterId !== uid)
      .sort((a, b) => {
        if (a.pincode === pincode && b.pincode === pincode) return true;
        if (a.pincode === pincode && b.pincode !== pincode) {
          return true;
        } else if (a.pincode !== pincode && b.pincode === pincode) {
          return false;
        } else {
          if (a.city === city && b.city === city) return true;
          if (a.city === city && b.city !== city) {
            return true;
          } else if (a.city !== city && b.city === city) {
            return false;
          } else {
            return true;
          }
        }
      });
    res.send(data);
  });
});

module.exports = router;
