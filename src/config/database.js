const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    // "mongodb+srv://devTinder:a6g81janttfqNdQo@devtinder.kirh6yv.mongodb.net/"
    "mongodb+srv://kaushal:WTYdIbmBwk8NQiSt@devtinder.rpxg4am.mongodb.net/",
  );
};
// PqZ5onPBvJ1vhT3p
module.exports = connectDB;
