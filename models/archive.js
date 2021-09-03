const mongoose = require("mongoose");

const archiveProvide = mongoose.Schema({
  name: String,
  image: String,
  providerId: String,
  city: String,
  state: String,
  country: String,
  pincode: Number,
  desc: String,
  time: Number,
});

const archiveProvideModel = mongoose.model("archiveProvides", archiveProvide);
const archiveRequested = mongoose.Schema({
  name: String,
  requesterId: String,
  desc: String,
  image: String,
  city: String,
  state: String,
  country: String,
  pincode: Number,
  time: Number,
});

const archiveRequestModel = mongoose.model("archiveRequests", archiveRequested);
module.exports = { archiveProvideModel, archiveRequestModel };
