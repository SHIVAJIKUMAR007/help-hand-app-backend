const mongoose = require("mongoose");

const user = mongoose.Schema({
  name: String,
  username: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
  },
  profilePic: String,
  password: String,
  city: String,
  bio: String,
  mobile: Number,
  state: String,
  country: String,
  pincode: Number,
  strike: Array,
  expoPNId: String,
  active: Boolean,
  emailVarify: Boolean,
});
user.index({ username: "text", email: "text" });
const userModel = mongoose.model("users", user);

const varifyemail = mongoose.Schema({
  uid: String,
  otp: Number,
  email: String,
  time: Number,
});
varifyemail.index({ uid: "text" });
const varifyModel = mongoose.model("varifys", varifyemail);

module.exports = { userModel, varifyModel };
