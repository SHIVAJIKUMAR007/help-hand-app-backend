const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/daspDb", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
