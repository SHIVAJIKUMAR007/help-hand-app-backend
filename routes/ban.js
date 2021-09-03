const router = require("express").Router();
const { bannedModel } = require("../models/banned");

router.get("/", (req, res) => res.send("banned api is sending"));
router.get("/allBanned", (req, res) => {
  bannedModel.find({}).exec((err, data) => {
    if (err) throw err;
    let banned = data.map((d) => d.name);
    res.send(banned);
  });
});

router.get("/addToBan/:name", (req, res) => {
  bannedModel.find({ name: req.params.name }).exec((err2, data2) => {
    if (err2) throw err2;
    if (data2.length == 0) {
      bannedModel.create({ name: req.params.name }, (err, data) => {
        if (err) throw err;
        res.send({ err: false, data: data });
      });
    } else {
      res.send({ err: false, data: data2 });
    }
  });
});

router.get("/removeFromBan/:name", (req, res) => {
  bannedModel.deleteMany({ name: req.params.name }, (err, data) => {
    if (err) throw err;
    res.send({ err: false, msg: "deleted" });
  });
});

module.exports = router;
