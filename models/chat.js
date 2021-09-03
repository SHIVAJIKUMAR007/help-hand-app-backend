const mongoose = require("mongoose");

const rooms = mongoose.Schema({
  partners: Array,
  lastMassage: String,
  lastMassageTime: Number,
});

const massages = mongoose.Schema({
  roomId: String,
  massage: String,
  doerId: String,
  doerName: String,
  doerPic: String,
  time: Number,
});

const roomModel = mongoose.model("rooms", rooms);
const massageModel = mongoose.model("massages", massages);

module.exports = { roomModel, massageModel };
