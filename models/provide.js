const mongoose = require("mongoose");

const providing = mongoose.Schema({
  name: String,
  type:String,
  image: String,
  providerId: String,
  city: String,
  state: String,
  country: String,
  pincode: Number,
  desc: String,
  time: Number,
});
providing.index({ name: "text", desc: "text", city: "text", state: "text" });
const provideModel = mongoose.model("provides", providing);
module.exports = { provideModel };
