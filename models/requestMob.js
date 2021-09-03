const mongoose = require("mongoose");

const requestItem = mongoose.Schema({
  requesterId: String,
  accepterId: String,
  postId: String,
  accept: Boolean,
});
requestItem.index({ requesterId: "text", accepterId: "text" });
const reqMobModel = mongoose.model("requestItems", requestItem);
module.exports = { reqMobModel };
