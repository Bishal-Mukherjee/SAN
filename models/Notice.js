const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  message: {
    type: String,
  },
  salutation: {
    type: String,
  },
  institution: {
    type: String,
  },
  department: {
    type: String,
  },
  year: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = Notice = mongoose.model("notice", noticeSchema);
