const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/ReminderServer", {
  useNewUrlParser: true,
});

const eventSchema = new mongoose.Schema({
  eventName: String,
  id: String,
});

const Event = mongoose.model("Events", eventSchema);

const User = new mongoose.model("Users", {
  uid: Number,
  uname: String,
  password: String,
  events: [],
});

module.exports = {
  User,
  Event,
};
