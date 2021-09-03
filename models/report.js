const mongoose = require("mongoose");

const report = mongoose.Schema({
  postId: String,
  report: String,
  doerId: String,
  time: Number,
});
const reportModel = mongoose.model("reports", report);

module.exports = { reportModel };
