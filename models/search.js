const mongoose = require("mongoose");

const search = mongoose.Schema({
  sercherId: String,
  query: String,
  time: Date,
});

const searchModel = mongoose.model("searchs", search);

module.exports = { searchModel };
