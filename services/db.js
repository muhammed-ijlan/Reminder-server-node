const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/ReminderServer", {
  useNewUrlParser: true,
});

const User = new mongoose.model("Users", {
  uid: Number,
  uname: String,
  password: String,
  events: [],
});

module.exports = {
  User,
};
