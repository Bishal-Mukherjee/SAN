const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilepic: {
    data: Buffer,
    contentType: String,
  },
  designation: {
    type: String,
  },
  institution: {
    type: String,
  },
  year: {
    type: String,
  },
  department: {
    type: String,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  notificationMessage: [
    {
      text: {
        type: String,
      },
      post_link: {
        type: String,
      },
      date: {
        type: Date,
        default: Date.now(),
      },
    },
  ],
  otp: {
    type: Number,
  },
  approved: {
    type: Boolean,
    default: false,
  },
});

module.exports = User = mongoose.model("user", userSchema);
