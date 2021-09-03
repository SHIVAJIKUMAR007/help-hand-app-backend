const router = require("express").Router();
const { reportModel } = require("../models/report");

router.post("/report", (req, res) => {
  const { postId, doerId, report } = req.body;

  reportModel.create(
    {
      postId,
      doerId,
      report,
      time: Date.now(),
    },
    (err, data) => {
      if (err) throw err;
      res.send({
        msg: "ok",
        res: "Your report is registered!!!",
      });
    }
  );
});

router.get("/allReport", (req, res) => {
  reportModel.find({}).exec((err, data) => {
    if (err) throw err;
    res.send(data);
  });
});

module.exports = router;
