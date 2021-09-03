const mongoose = require("mongoose");

const bannedList = mongoose.Schema({
  name: {
    type: String,
    unique: true,
  },
});

const bannedModel = mongoose.model("bans", bannedList);

module.exports = { bannedModel };
