const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const { bannedModel } = require("../models/banned");
const { requestModel } = require("../models/request");
const { archiveRequestModel } = require("../models/archive");
const { addStrike } = require("./strick");
const { reqMobModel } = require("../models/requestMob");
router.use(express.static(path.join(__dirname, "./public/")));

router.post("/", (req, res) => res.send("search api is sending"));

router.post("/postimage/:doerId", (req, res) => {
  let filename = "request/" + Date.now() + "_" + req.params.doerId + ".png";
  fs.writeFile("./public/" + filename, req.body.image, "base64", (err) => {
    if (err) throw err;
    console.log("ok");
    res.send({ msg: "ok", imageUrl: filename });
  });
});
// add remaining details of providing item
router.post("/addRequestedItem", (req, res) => {
  const { name, type, image, _id, city, state, country, pincode, desc } =
    req.body;
  bannedModel.find({ name: name }).exec((err, data) => {
    if (err) throw err;
    if (data.length == 0) {
      requestModel.create(
        {
          name,
          type,
          image,
          requesterId: _id,
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
            res: "Your request is registered.\n It will visible to all person near you soon.\n",
          });
        }
      );
    } else {
      data = data[0];
      const user = addStrike(uid, data.name, "request");
      res.send({
        msg: "banned",
        res: "This Item is banned on our platform, please learn terms and conditons.\n if you contineously voilate our policy then we have to block you from our platform.\n Hope you will understand.",
        user: user,
      });
    }
  });
});
// get all requests items by user of uid
router.get("/allRequests/:uid", (req, res) => {
  requestModel.find({ requesterId: req.params.uid }).exec((err, data) => {
    if (err) throw err;
    res.send(data);
  });
});

// delete item from providing list
router.post("/delete", (req, res) => {
  requestModel.findById(req.body.id, (err, data) => {
    if (err) throw err;
    const {
      name,
      requesterId,
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
      requesterId,
      desc,
      image,
      city,
      state,
      country,
      pincode,
      time,
    };
    archiveRequestModel.create(data, (err2, data2) => {
      if (err2) throw err2;

      requestModel.deleteOne({ _id: req.body.id }, (err3, data3) => {
        if (err3) throw err3;
        res.send({
          msg: "ok",
          res: "Item is removed from your request list.",
        });
      });
    });
  });
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
// request section

//req for mobile number.
router.post("/reqmobile", (req, res) => {
  let { requesterId, accepterId, postId } = req.body;
  reqMobModel.create(
    { requesterId, accepterId, postId, accept: false },
    (err, data) => {
      if (err) throw err;
      res.send({ msg: "ok", res: "Request is sent" });
    }
  );
});

//isrequested
router.get("/isrequested/:requesterId/:accepterId/:postId", (req, res) => {
  let requesterId = req.params.requesterId;
  let accepterId = req.params.accepterId;
  let postId = req.params.postId;

  reqMobModel.find({ requesterId, accepterId, postId }).exec((err, data) => {
    if (err) throw err;
    if (data.length) {
      data = data[0];
      res.send({ msg: "sent", accept: data.accept });
    } else res.send({ msg: "not sent" });
  });
});
//accept the req.
router.post("/acceptReq", (req, res) => {
  let { requesterId, accepterId, postId } = req.body;
  reqMobModel.updateOne(
    { requesterId, accepterId, postId },
    { accept: true },
    (err, data) => {
      if (err) throw err;
      res.send({
        msg: "ok",
        res: "You accepted the request, Now requseter can see your mobile no.",
      });
    }
  );
});
//accept the req.
router.post("/deleteReq", (req, res) => {
  let { requesterId, accepterId, postId } = req.body;
  reqMobModel.deleteOne({ requesterId, accepterId, postId }, (err, data) => {
    if (err) throw err;
    res.send({
      msg: "ok",
      res: "You deleted this request.",
    });
  });
});
//all req did
router.get("/allreqdid/:requesterId", (req, res) => {
  reqMobModel
    .find({ requesterId: req.params.requesterId })
    .exec((err, data) => {
      console.log(data);
      if (err) throw err;
      res.send(data);
    });
});

//all req get
router.get("/allreqget/:accepterId", (req, res) => {
  reqMobModel.find({ accepterId: req.params.accepterId }).exec((err, data) => {
    if (err) throw err;
    console.log(data);

    res.send(data);
  });
});
module.exports = router;
