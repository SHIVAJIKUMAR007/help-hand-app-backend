const { userModel } = require("../models/auth");

const addStrike = (uid, item, type) => {
  userModel.find({ _id: uid }).exec((err, data) => {
    if (err) throw err;
    const strike = data[0].strike;

    const newStrike = { id: strike.length, item, type };
    strike = [...strike, newStrike];
    if (strike.length >= 6) {
      userModel.findByIdAndUpdate(
        uid,
        { strike: strike, active: false },
        (err3, data3) => {
          if (err3) throw err3;
          data3.strike = strike;
          data3.active = false;
          return data3;
        }
      );
    }
    userModel.findByIdAndUpdate(uid, { strike: strike }, (err2, data2) => {
      if (err2) throw err2;
      data2.strike = strike;
      return data2;
    });
  });
};
module.exports = { addStrike };
