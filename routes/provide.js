const router = require("express").Router();
const { bannedModel } = require("../models/banned");
const { provideModel } = require("../models/provide");
const { archiveProvideModel } = require("../models/archive");
const path = require("path");
const { addStrike } = require("./strick");
router.get("/", (req, res) => res.send("search api is sending"));

router.post("/postImage/:doerId", (req, res) => {
  let filename = "items/" + Date.now() + "_" + req.params.doerId + ".png";
  fs.writeFile("./public/" + filename, req.body.image, "base64", (err) => {
    if (err) throw err;
    console.log("ok");
    res.send({ msg: "ok", imageUrl: filename });
  });
});
// add remaining details of providing item
router.post("/addProvidingItem", (req, res) => {
  const { name, type, image, _id, city, state, country, pincode, desc } =
    req.body;
  bannedModel.find({ name: name }).exec((err, data) => {
    if (err) throw err;
    if (data.length == 0) {
      provideModel.create(
        {
          name,
          type,
          image,
          providerId: _id,
          city,
          state,
          country,
          pincode,
          desc,
          time: Date.now(),
        },
        (err, data) => {
          if (err) throw err;
          res.send({
            msg: "ok",
            res: "Thank you to adding Your item.\n It will visible to all near you soon.\n",
          });
        }
      );
    } else {
      data = data[0];
      const user = addStrike(uid, data.name, "provide");
      res.send({
        msg: "banned",
        user: user,
        res: "This Item is banned on our platform, please learn terms and conditons.\n if you contineously voilate our policy then we have to block you from our platform.\n Hope you will understand.",
      });
    }
  });
});

// get all proving items by user of uid
router.get("/allProviding/:uid", (req, res) => {
  provideModel
    .find({ providerId: req.params.uid })
    .sort({ time: "desc" })
    .exec((err, data) => {
      if (err) throw err;
      res.send(data);
    });
});
//get post by postid
router.get("/OneProviding/:pid", (req, res) => {
  provideModel
    .find({ _id: req.params.pid })
    .sort({ time: "desc" })
    .exec((err, data) => {
      if (err) throw err;
      res.send(data[0]);
    });
});
// delete item from providing list
router.post("/delete", (req, res) => {
  provideModel.findById(req.body.id, (err, data) => {
    if (err) throw err;
    const {
      name,
      providerId,
      desc,
      image,
      city,
      state,
      country,
      pincode,
      time,
    } = data;
    data = {
      name,
      providerId,
      desc,
      image,
      city,
      state,
      country,
      pincode,
      time,
    };
    archiveProvideModel.create(data, (err2, data2) => {
      if (err2) throw err2;
      provideModel.deleteOne({ _id: req.body.id }, (err3, data3) => {
        if (err3) throw err3;
        res.send({
          msg: "ok",
          res: "Item is removed from your commodity list.",
        });
      });
    });
  });
});

module.exports = router;
