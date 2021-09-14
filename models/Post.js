const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  name: {
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
  text: {
    type: String,
  },
  photo: {
    data: Buffer,
    contentType: String,
  },
  pdfdocument: {
    data: Buffer,
    contentType: String,
  },
  photos: [
    {
      photoID: {
        type: Number,
      },
      data: Buffer,
      contentType: String,
    },
  ],
  doubts: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
      },
      name: {
        type: String,
      },
      text: {
        type: String,
      },
    },
  ],
  date: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = Post = mongoose.model("post", postSchema);
