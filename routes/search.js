const router = require("express").Router();
const { bannedModel } = require("../models/banned");
const { provideModel } = require("../models/provide");
const { requestModel } = require("../models/request");
const { searchModel } = require("../models/search");
const { addStrike } = require("./strick");

router.get("/", (req, res) => res.send("search api is sending"));

router.post("/search", (req, res) => {
  const { uid, city, searchTerm, type } = req.body;
  bannedModel.find({}).exec((err, data) => {
    if (err) throw err;
    let banned = data.map((d) => d.name);
    if (banned.includes(searchTerm)) {
      const user = addStrike(uid, searchTerm, "search");
      res.send({
        msg: "banned",
        user: user,
        res: "This Item is banned on our platform, please learn terms and conditons.\n if you contineously voilate our policy then we have to block you from our platform.\n Hope you will understand.",
      });
    } else {
      provideModel
        .find(
          {
            type: type,
            $or: [{ state: city }, { city: city }],
            $text: { $search: searchTerm },
          },
          { score: { $meta: "textScore" } }
        )
        .sort({ time: "asc" })
        .exec((err, data) => {
          if (err) throw err;

          searchModel.create(
            {
              sercherId: uid,
              query: searchTerm,
              time: Date.now(),
            },
            (err2, data2) => {
              if (err2) throw err2;
              data = data.filter((x) => x.providerId !== uid);
              res.send({ msg: "ok", res: data });
            }
          );
        });
    }
  });
});

router.get("/post/:id", (req, res) => {
  provideModel.findById(req.params.id, (err, data) => {
    if (err) throw err;
    if (data) {
      res.send({ post: data, provider: true });
    } else {
      requestModel.findById(req.params.id, (err2, data2) => {
        if (err2) throw err2;
        res.send({ post: data2, provider: false });
      });
    }
  });
});
module.exports = router;
